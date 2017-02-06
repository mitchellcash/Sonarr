using System;
using System.Collections.Generic;
using FluentAssertions;
using Moq;
using NUnit.Framework;
using NzbDrone.Common.Http;
using NzbDrone.Core.Download;
using NzbDrone.Core.Download.Clients.DownloadStation;
using NzbDrone.Core.Download.Clients.DownloadStation.Proxies;
using NzbDrone.Core.MediaFiles.TorrentInfo;
using NzbDrone.Core.Parser.Model;
using NzbDrone.Test.Common;

namespace NzbDrone.Core.Test.Download.DownloadClientTests.DownloadStationTests
{
    [TestFixture]
    public class DownloadStationFixture : DownloadClientFixtureBase<DownloadStation>
    {
        protected DownloadStationSettings _settings;
        protected DownloadStationTorrent _queued;
        protected DownloadStationTorrent _downloading;
        protected DownloadStationTorrent _failed;
        protected DownloadStationTorrent _completed;
        protected DownloadStationTorrent _magnet;

        protected string _serialNumber = "SERIALNUMBER";
        protected string _category = "sonarr";
        protected string _tvDirectory = @"video/Series";
        protected string _defaultDestination = "somepath";

        protected Dictionary<string, object> _downloadStationConfigItems;

        protected string DownloadURL => "magnet:?xt=urn:btih:5dee65101db281ac9c46344cd6b175cdcad53426&dn=download";

        [SetUp]
        public void Setup()
        {
            _settings = new DownloadStationSettings()
            {
                Host = "127.0.0.1",
                Port = 5000,
                Username = "admin",
                Password = "pass"
            };

            Subject.Definition = new DownloadClientDefinition();
            Subject.Definition.Settings = _settings;

            _queued = new DownloadStationTorrent()
            {
                Id = "id1",
                Size = 1000,
                Status = DownloadStationTorrent.DownloadStationTaskStatus.Waiting,
                Type = DownloadStationTorrent.DownloadStationTaskType.BT,
                Username = "admin",
                Title = "title",
                Additional = new DownloadStationTorrentAdditional
                {
                    Detail = new Dictionary<string, string>
                    {
                        { "destination","shared/folder" },
                        { "uri", DownloadURL }
                    },
                    Transfer = new Dictionary<string, string>
                    {
                        { "size_downloaded", "0"},
                        { "speed_download", "0" }
                    }
                }
            };

            _completed = new DownloadStationTorrent()
            {
                Id = "id2",
                Size = 1000,
                Status = DownloadStationTorrent.DownloadStationTaskStatus.Finished,
                Type = DownloadStationTorrent.DownloadStationTaskType.BT,
                Username = "admin",
                Title = "title",
                Additional = new DownloadStationTorrentAdditional
                {
                    Detail = new Dictionary<string, string>
                    {
                        { "destination","shared/folder" },
                        { "uri", DownloadURL }
                    },
                    Transfer = new Dictionary<string, string>
                    {
                        { "size_downloaded", "1000"},
                        { "speed_download", "0" }
                    }
                }
            };

            _downloading = new DownloadStationTorrent()
            {
                Id = "id3",
                Size = 1000,
                Status = DownloadStationTorrent.DownloadStationTaskStatus.Downloading,
                Type = DownloadStationTorrent.DownloadStationTaskType.BT,
                Username = "admin",
                Title = "title",
                Additional = new DownloadStationTorrentAdditional
                {
                    Detail = new Dictionary<string, string>
                    {
                        { "destination","shared/folder" },
                        { "uri", DownloadURL }
                    },
                    Transfer = new Dictionary<string, string>
                    {
                        { "size_downloaded", "100"},
                        { "speed_download", "50" }
                    }
                }
            };

            _failed = new DownloadStationTorrent()
            {
                Id = "id4",
                Size = 1000,
                Status = DownloadStationTorrent.DownloadStationTaskStatus.Error,
                Type = DownloadStationTorrent.DownloadStationTaskType.BT,
                Username = "admin",
                Title = "title",
                Additional = new DownloadStationTorrentAdditional
                {
                    Detail = new Dictionary<string, string>
                    {
                        { "destination","shared/folder" },
                        { "uri", DownloadURL }
                    },
                    Transfer = new Dictionary<string, string>
                    {
                        { "size_downloaded", "10"},
                        { "speed_download", "0" }
                    }
                }
            };

            Mocker.GetMock<ITorrentFileInfoReader>()
                  .Setup(s => s.GetHashFromTorrentFile(It.IsAny<byte[]>()))
                  .Returns("CBC2F069FE8BB2F544EAE707D75BCD3DE9DCF951");

            Mocker.GetMock<IHttpClient>()
                  .Setup(s => s.Get(It.IsAny<HttpRequest>()))
                  .Returns<HttpRequest>(r => new HttpResponse(r, new HttpHeader(), new byte[0]));

            _downloadStationConfigItems = new Dictionary<string, object>
            {
                { "default_destination", _defaultDestination },
            };

            Mocker.GetMock<IDownloadStationProxy>()
              .Setup(v => v.GetConfig(It.IsAny<DownloadStationSettings>()))
              .Returns(_downloadStationConfigItems);
        }

        protected void GivenSharedFolder()
        {
            Mocker.GetMock<ISharedFolderResolver>()
                  .Setup(s => s.ResolvePhysicalPath(It.IsAny<string>(), _settings, It.IsAny<string>()))
                  .Returns(new SharedFolderMapping(It.IsAny<string>(), It.IsAny<string>()));
        }

        protected void GivenSerialNumber()
        {
            Mocker.GetMock<ISerialNumberProvider>()
                .Setup(s => s.GetSerialNumber(It.IsAny<DownloadStationSettings>()))
                .Returns(_serialNumber);
        }

        protected void GivenTvCategory()
        {
            _settings.TvCategory = _category;
        }

        protected void GivenTvDirectory()
        {
            _settings.TvDirectory = _tvDirectory;
        }

        protected virtual void GivenTorrents(List<DownloadStationTorrent> torrents)
        {
            if (torrents == null)
            {
                torrents = new List<DownloadStationTorrent>();
            }

            Mocker.GetMock<IDownloadStationProxy>()
                  .Setup(s => s.GetTorrents(It.IsAny<DownloadStationSettings>()))
                  .Returns(torrents);
        }

        protected void PrepareClientToReturnQueuedItem()
        {
            GivenTorrents(new List<DownloadStationTorrent>
            {
                _queued
            });
        }

        protected void GivenSuccessfulDownload()
        {
            Mocker.GetMock<IHttpClient>()
                  .Setup(s => s.Get(It.IsAny<HttpRequest>()))
                  .Returns<HttpRequest>(r => new HttpResponse(r, new HttpHeader(), new byte[1000]));

            Mocker.GetMock<IDownloadStationProxy>()
                  .Setup(s => s.AddTorrentFromUrl(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<DownloadStationSettings>()))
                  .Returns(true)
                  .Callback(PrepareClientToReturnQueuedItem);

            Mocker.GetMock<IDownloadStationProxy>()
                  .Setup(s => s.AddTorrentFromData(It.IsAny<byte[]>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<DownloadStationSettings>()))
                  .Returns(true)
                  .Callback(PrepareClientToReturnQueuedItem);
        }

        protected override RemoteEpisode CreateRemoteEpisode()
        {
            var episode = base.CreateRemoteEpisode();

            episode.Release.DownloadUrl = DownloadURL;

            return episode;
        }

        protected int GivenAllKindOfTasks()
        {
            var tasks = new List<DownloadStationTorrent>() { _queued, _completed, _failed, _downloading };

            Mocker.GetMock<IDownloadStationProxy>()
                  .Setup(d => d.GetTorrents(_settings))
                  .Returns(tasks);

            return tasks.Count;
        }

        [Test]
        public void Download_with_TvDirectory_should_force_directory()
        {
            GivenSerialNumber();
            GivenTvDirectory();
            GivenSuccessfulDownload();

            var remoteEpisode = CreateRemoteEpisode();

            var id = Subject.Download(remoteEpisode);

            id.Should().NotBeNullOrEmpty();

            Mocker.GetMock<IDownloadStationProxy>()
                  .Verify(v => v.AddTorrentFromUrl(It.IsAny<string>(), _tvDirectory, It.IsAny<DownloadStationSettings>()), Times.Once());
        }

        [Test]
        public void Download_with_category_should_force_directory()
        {
            GivenSerialNumber();
            GivenTvCategory();
            GivenSuccessfulDownload();

            var remoteEpisode = CreateRemoteEpisode();

            var id = Subject.Download(remoteEpisode);

            id.Should().NotBeNullOrEmpty();

            Mocker.GetMock<IDownloadStationProxy>()
                  .Verify(v => v.AddTorrentFromUrl(It.IsAny<string>(), $"{_defaultDestination}/{_category}", It.IsAny<DownloadStationSettings>()), Times.Once());
        }

        [Test]
        public void Download_without_TvDirectory_and_Category_should_use_default()
        {
            GivenSerialNumber();
            GivenSuccessfulDownload();

            var remoteEpisode = CreateRemoteEpisode();

            var id = Subject.Download(remoteEpisode);

            id.Should().NotBeNullOrEmpty();

            Mocker.GetMock<IDownloadStationProxy>()
                  .Verify(v => v.AddTorrentFromUrl(It.IsAny<string>(), null, It.IsAny<DownloadStationSettings>()), Times.Once());
        }

        [Test]
        public void GetItems_should_ignore_downloads_in_wrong_folder()
        {
            _settings.TvDirectory = @"/shared/folder/sub";

            GivenSerialNumber();
            GivenSharedFolder();
            GivenTorrents(new List<DownloadStationTorrent> { _completed });

            Subject.GetItems().Should().BeEmpty();
        }

        public void DownloadStation_Should_log_error_and_return_empty_list_when_cannot_resolve_shared_folder()
        {
            Mocker.GetMock<ISharedFolderResolver>()
                  .Setup(s => s.ResolvePhysicalPath(It.IsAny<string>(), _settings, It.IsAny<string>()))
                  .Throws(new EntryPointNotFoundException());

            GivenSerialNumber();
            var quantity = GivenAllKindOfTasks();

            Subject.GetItems().Should().BeEmpty();
            ExceptionVerification.ExpectedErrors(quantity);
        }

        [Test]
        public void DownloadStation_Should_log_error_and_return_empty_list_when_cannot_get_serial_number()
        {
            Mocker.GetMock<ISerialNumberProvider>()
                 .Setup(s => s.GetSerialNumber(_settings))
                 .Throws(new DownloadClientException("Some Syno error"));

            GivenSharedFolder();
            GivenAllKindOfTasks();

            Subject.GetItems().Should().BeEmpty();
            ExceptionVerification.ExpectedErrors(1);
        }

        [Test]
        public void DownloadStation_Should_throw_and_not_add_torrent_if_cannot_get_serial_number()
        {
            var remoteEpisode = CreateRemoteEpisode();

            Mocker.GetMock<ISerialNumberProvider>()
               .Setup(s => s.GetSerialNumber(_settings))
               .Throws(new DownloadClientException("Some Syno error"));

            Assert.Throws<DownloadClientException>(() => Subject.Download(remoteEpisode));

            Mocker.GetMock<IDownloadStationProxy>()
                  .Verify(v => v.AddTorrentFromUrl(It.IsAny<string>(), null, _settings), Times.Never());
        }
    }
}
