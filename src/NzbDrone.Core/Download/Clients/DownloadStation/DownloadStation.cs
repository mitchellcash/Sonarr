using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using FluentValidation.Results;
using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Common.Crypto;
using NzbDrone.Common.Disk;
using NzbDrone.Common.Extensions;
using NzbDrone.Common.Http;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.Download.Clients.DownloadStation.Exceptions;
using NzbDrone.Core.Download.Clients.DownloadStation.Proxies;
using NzbDrone.Core.MediaFiles.TorrentInfo;
using NzbDrone.Core.Parser.Model;
using NzbDrone.Core.RemotePathMappings;
using NzbDrone.Core.Validation;
using static NzbDrone.Core.Download.Clients.DownloadStation.DownloadStationTorrent;

namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public class DownloadStation : TorrentClientBase<DownloadStationSettings>
    {
        protected readonly IDownloadStationProxy _proxy;
        protected readonly ISharedFolderResolver _sharedFolderResolver;
        protected readonly ISerialNumberProvider _serialNumberProvider;

        public DownloadStation(IDownloadStationProxy proxy,
                               ITorrentFileInfoReader torrentFileInfoReader,
                               IHttpClient httpClient,
                               IConfigService configService,
                               IDiskProvider diskProvider,
                               IRemotePathMappingService remotePathMappingService,
                               Logger logger,
                               ICacheManager cacheManager,
                               ISharedFolderResolver sharedFolderResolver,
                               ISerialNumberProvider serialNumberProvider)
            : base(torrentFileInfoReader, httpClient, configService, diskProvider, remotePathMappingService, logger)
        {
            _proxy = proxy;
            _sharedFolderResolver = sharedFolderResolver;
            _serialNumberProvider = serialNumberProvider;
        }

        public override string Name => "Download Station";

        private string GetHashedSerialNumber()
        {
            var serialNumber = _serialNumberProvider.GetSerialNumber(Settings);

            return HashConverter.GetHash(serialNumber).ToHexString();
        }

        public override IEnumerable<DownloadClientItem> GetItems()
        {
            IEnumerable<DownloadStationTorrent> torrents;

            try
            {
                torrents = _proxy.GetTorrents(Settings);
            }
            catch (DownloadClientException ex)
            {
                _logger.Error(ex);
                return Enumerable.Empty<DownloadClientItem>();
            }

            var items = new List<DownloadClientItem>();           

            foreach (var torrent in torrents)
            {
                var outputPath = new OsPath($"/{torrent.Additional.Detail["destination"]}");

                if (Settings.TvDirectory.IsNotNullOrWhiteSpace())
                {
                    if (!outputPath.Contains(new OsPath($"/{Settings.TvDirectory}")))
                    {
                        continue;
                    }
                }
                else if (Settings.TvCategory.IsNotNullOrWhiteSpace())
                {
                    var directories = outputPath.FullPath.Split('\\', '/');
                    if (!directories.Contains(Settings.TvCategory))
                    {
                        continue;
                    }
                }

                var item = new DownloadClientItem()
                {
                    Category = Settings.TvCategory,
                    DownloadClient = Definition.Name,
                    Title = torrent.Title,
                    TotalSize = torrent.Size,
                    Status = GetTorrentStatus(torrent.Status),
                    Message = GetMessage(torrent)
                };

                string hashedSerialNumber = null;

                try
                {
                    hashedSerialNumber = GetHashedSerialNumber();
                    item.DownloadId = GetID(torrent.Id, hashedSerialNumber);
                }
                catch (SerialNumberException s)
                {
                    _logger.Error(s, "{0} could not be imported.", torrent.Title);
                    continue;
                }

                try
                {
                    var sharedFolderMapping = _sharedFolderResolver.ResolvePhysicalPath(outputPath.FullPath, Settings, hashedSerialNumber);

                    item.OutputPath = GetOutputPath(outputPath, torrent, sharedFolderMapping.PhysicalPath);
                }
                catch (EntryPointNotFoundException e)
                {
                    _logger.Error(e, "{0} could not be imported.", torrent.Title);
                    continue;
                }

                try
                {
                    item.RemainingSize = GetRemainingSize(torrent);
                    item.RemainingTime = GetRemainingTime(torrent);                                                    
                }
                catch (Exception x)
                {
                    _logger.Warn(x, "Unknown error importing {0}", torrent.Title);
                }

                items.Add(item);
            }
            
            return items;
        }

        public override DownloadClientStatus GetStatus()
        {
            try
            {
                var path = GetDownloadDirectory();

                return new DownloadClientStatus
                {
                    IsLocalhost = Settings.Host == "127.0.0.1" || Settings.Host == "localhost",
                    OutputRootFolders = new List<OsPath> { _remotePathMappingService.RemapRemoteToLocal(Settings.Host, new OsPath(path)) }
                };
            }
            catch (DownloadClientException e)
            {
                _logger.Debug(e, "Failed to get config from Download Station");

                throw e;
            }
        }

        public override void RemoveItem(string downloadId, bool deleteData)
        {
            if (_proxy.RemoveTorrent(ParseID(downloadId), deleteData, Settings))
            {
                _logger.Debug("{0} removed correctly", downloadId);
                return;
            }

            _logger.Error("Failed to remove {0}", downloadId);
        }

        protected OsPath GetOutputPath(OsPath outputPath, DownloadStationTorrent torrent, OsPath physicalPath)
        {
            outputPath = _remotePathMappingService.RemapRemoteToLocal(Settings.Host, physicalPath);

            return outputPath + torrent.Title;
        }

        protected override string AddFromMagnetLink(RemoteEpisode remoteEpisode, string hash, string magnetLink)
        {
            try
            {
                var hashedSerialNumber = GetHashedSerialNumber();

                if (_proxy.AddTorrentFromUrl(magnetLink, GetDownloadDirectory(), Settings))
                {
                    var item = _proxy.GetTorrents(Settings).Where(t => t.Additional.Detail["uri"] == magnetLink).SingleOrDefault();

                    if (item != null)
                    {
                        _logger.Debug("{0} added correctly", remoteEpisode);
                        return GetID(item.Id, hashedSerialNumber);
                    }

                    _logger.Debug("No such task {0} in Download Station", magnetLink);
                }
            } catch (SerialNumberException) { }
            
            throw new DownloadClientException("Failed to add magnet task to Download Station");
        }

        protected override string AddFromTorrentFile(RemoteEpisode remoteEpisode, string hash, string filename, byte[] fileContent)
        {
            try
            {
                var hashedSerialNumber = GetHashedSerialNumber();

                if (_proxy.AddTorrentFromData(fileContent, filename, GetDownloadDirectory(), Settings))
                {
                    var items = _proxy.GetTorrents(Settings).Where(t => t.Additional.Detail["uri"] == Path.GetFileNameWithoutExtension(filename));

                    var item = items.SingleOrDefault();

                    if (item != null)
                    {
                        _logger.Debug("{0} added correctly", remoteEpisode);
                        return GetID(item.Id, hashedSerialNumber);
                    }

                    _logger.Debug("No such task {0} in Download Station", filename);
                }
            }
            catch (SerialNumberException) { }

            throw new DownloadClientException("Failed to add torrent task to Download Station");
        }

        protected override void Test(List<ValidationFailure> failures)
        {
            failures.AddIfNotNull(TestConnection());
            if (failures.Any()) return;
            failures.AddIfNotNull(TestGetTorrents());
        }

        protected ValidationFailure TestConnection()
        {
            try
            {
                return ValidateVersion();
            }
            catch (DownloadClientAuthenticationException ex)
            {
                _logger.Error(ex, ex.Message);
                return new NzbDroneValidationFailure("Username", "Authentication failure")
                {
                    DetailedDescription = $"Please verify your username and password. Also verify if the host running Sonarr isn't blocked from accessing {Name} by WhiteList limitations in the {Name} configuration."
                };
            }
            catch (WebException ex)
            {
                _logger.Error(ex);

                if (ex.Status == WebExceptionStatus.ConnectFailure)
                {
                    return new NzbDroneValidationFailure("Host", "Unable to connect")
                    {
                        DetailedDescription = "Please verify the hostname and port."
                    };
                }
                return new NzbDroneValidationFailure(string.Empty, "Unknown exception: " + ex.Message);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                return new NzbDroneValidationFailure(string.Empty, "Unknown exception: " + ex.Message);
            }
        }

        protected ValidationFailure ValidateVersion()
        {
            var versionRange = _proxy.GetApiVersion(Settings);

            _logger.Debug("Download Station api version information: Min {0} - Max {1}", versionRange.Min(), versionRange.Max());

            if (!versionRange.Contains(2))
            {
                return new ValidationFailure(string.Empty, $"Download Station API version not supported, should be at least 2. It supports from {versionRange.Min()} to {versionRange.Max()}");
            }

            return null;
        }

        protected long GetRemainingSize(DownloadStationTorrent torrent)
        {
            return torrent.Size - Math.Max(Convert.ToInt64(torrent.Additional.Transfer["size_downloaded"] ?? "0"), 0);
        }
        
        protected TimeSpan? GetRemainingTime(DownloadStationTorrent torrent)
        {
            var remainingSize = GetRemainingSize(torrent);
            var donwloadSpeed = Math.Max(Convert.ToInt64(torrent.Additional.Transfer["speed_download"] ?? "0"), 0);

            return (donwloadSpeed > 0) ? (TimeSpan?)TimeSpan.FromSeconds(remainingSize / donwloadSpeed) : null;
        }

        protected string GetMessage(DownloadStationTorrent torrent)
        {
            if (torrent.StatusExtra != null)
            {
                switch (torrent.Status)
                {
                    case DownloadStationTaskStatus.Error:
                        return torrent.StatusExtra["error_detail"];
                    case DownloadStationTaskStatus.Extracting:
                        return torrent.StatusExtra["unzip_progress"];
                }
            }

            return null;
        }

        protected DownloadItemStatus GetTorrentStatus(DownloadStationTaskStatus status)
        {
            switch (status)
            {
                case DownloadStationTorrent.DownloadStationTaskStatus.Waiting:
                    return DownloadItemStatus.Queued;
                case DownloadStationTorrent.DownloadStationTaskStatus.Error:
                    return DownloadItemStatus.Failed;
                case DownloadStationTorrent.DownloadStationTaskStatus.Paused:
                    return DownloadItemStatus.Paused;
                case DownloadStationTorrent.DownloadStationTaskStatus.Seeding:
                    return DownloadItemStatus.Completed;

                default:
                    return DownloadItemStatus.Downloading;
            }
        }

        protected ValidationFailure TestGetTorrents()
        {
            try
            {
                _proxy.GetTorrents(Settings);
                return null;
            }
            catch (Exception ex)
            {
                return new NzbDroneValidationFailure(string.Empty, "Failed to get the list of torrents: " + ex.Message);
            }
        }

        protected string ParseID(string id)
        {
            return id.Split(':')[1];
        }

        protected string GetID(string id, string hashedSerialNumber)
        {
            return $"{hashedSerialNumber}:{id}";
        }

        protected string GetDefaultDir()
        {
            var config = _proxy.GetConfig(Settings);

            var path = config["default_destination"] as string;

            return path;
        }

        protected string GetDownloadDirectory()
        {
            if (Settings.TvDirectory.IsNotNullOrWhiteSpace())
            {
                return Settings.TvDirectory.TrimStart('/');
            }
            else if (Settings.TvCategory.IsNotNullOrWhiteSpace())
            {
                var destDir = GetDefaultDir();

                return $"{destDir.TrimEnd('/')}/{Settings.TvCategory}";
            }

            return null;
        }
    }
}
