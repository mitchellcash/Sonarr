using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Common.Disk;
using NzbDrone.Core.Download.Clients.DownloadStation.Proxies;
using System;

namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public class SharedFolderResolver : ISharedFolderResolver
    {
        private readonly IFileStationProxy _proxy;
        private ICached<SharedFolderCache> _cache;
        private readonly ILogger _logger;

        public SharedFolderResolver(ICacheManager cacheManager,
                                    IFileStationProxy proxy,
                                    Logger logger)
        {
            _proxy = proxy;
            _cache = cacheManager.GetCache<SharedFolderCache>(GetType());
            _logger = logger;
        }

        private SharedFolderCache GetPhysicalPath(string sharedFolder, DownloadStationSettings settings)
        {
            return new SharedFolderCache(_proxy.GetPhysicalPath(sharedFolder, settings));
        }

        public OsPath ResolvePhysicalPath(string sharedFolder, DownloadStationSettings settings, string serialNumber)
        {
            try
            {
                return new OsPath(_cache.Get($"{serialNumber}:{sharedFolder}",
                                             () => GetPhysicalPath(sharedFolder, settings),
                                             TimeSpan.FromHours(1)).PhysicalPath);
            }
            catch (EntryPointNotFoundException e)
            {
                _logger.Error(e, "The shared folder {0} couldn't be resolved at {1}:{2}", sharedFolder, settings.Host, settings.Port);
                throw e;
            }
        }
    }
}
