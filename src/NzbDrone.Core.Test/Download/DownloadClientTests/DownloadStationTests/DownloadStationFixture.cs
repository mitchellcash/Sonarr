using FluentAssertions;
using Moq;
using NUnit.Framework;
using NzbDrone.Common.Http;
using NzbDrone.Core.Download;
using NzbDrone.Core.Download.Clients.DownloadStation;
using NzbDrone.Core.Download.Clients.DownloadStation.Proxies;
using NzbDrone.Core.MediaFiles.TorrentInfo;
using NzbDrone.Core.Test.Download.DownloadClientTests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NzbDrone.Core.Parser.Model;

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
                        { "destination","somepath" },
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
                        { "destination","somepath" },
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
                        { "destination","somepath" },
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
                        { "destination","somepath" },
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
                { "default_destination", "somepath" },
            };

            Mocker.GetMock<IDownloadStationProxy>()
              .Setup(v => v.GetConfig(It.IsAny<DownloadStationSettings>()))
              .Returns(_downloadStationConfigItems);
        }

        protected void GivenTvCategory()
        {
            _settings.TvCategory = "sonarr";
        }

        protected void GivenTvDirectory()
        {
            _settings.TvDirectory = @"video/Series";
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
                  .Callback(PrepareClientToReturnQueuedItem);

            Mocker.GetMock<IDownloadStationProxy>()
                  .Setup(s => s.AddTorrentFromData(It.IsAny<byte[]>(), It.IsAny<string>(), It.IsAny<DownloadStationSettings>()))
                  .Callback(PrepareClientToReturnQueuedItem);
        }

        protected override RemoteEpisode CreateRemoteEpisode()
        {
            var episode = base.CreateRemoteEpisode();

            episode.Release.DownloadUrl = DownloadURL;

            return episode;
        }

        [Test]
        public void DownloadStation_Download_with_TvDirectory_should_force_directory()
        {
            GivenTvDirectory();
            GivenSuccessfulDownload();

            var remoteEpisode = CreateRemoteEpisode();

            var id = Subject.Download(remoteEpisode);

            id.Should().NotBeNullOrEmpty();

            Mocker.GetMock<IDownloadStationProxy>()
                  .Verify(v => v.AddTorrentFromUrl(It.IsAny<string>(), @"video/Series", It.IsAny<DownloadStationSettings>()), Times.Once());
        }

        [Test]
        public void DownloadStation_Download_with_category_should_force_directory()
        {
            GivenTvCategory();
            GivenSuccessfulDownload();

            var remoteEpisode = CreateRemoteEpisode();

            var id = Subject.Download(remoteEpisode);

            id.Should().NotBeNullOrEmpty();

            Mocker.GetMock<IDownloadStationProxy>()
                  .Verify(v => v.AddTorrentFromUrl(It.IsAny<string>(), @"video/TvCategory", It.IsAny<DownloadStationSettings>()), Times.Once());
        }

        [Test]
        public void DownloadStation_Download_without_TvDirectory_and_Category_should_use_default()
        {
            GivenSuccessfulDownload();

            var remoteEpisode = CreateRemoteEpisode();

            var id = Subject.Download(remoteEpisode);

            id.Should().NotBeNullOrEmpty();

            Mocker.GetMock<IDownloadStationProxy>()
                  .Verify(v => v.AddTorrentFromUrl(It.IsAny<string>(), null, It.IsAny<DownloadStationSettings>()), Times.Once());
        }
    }
}
