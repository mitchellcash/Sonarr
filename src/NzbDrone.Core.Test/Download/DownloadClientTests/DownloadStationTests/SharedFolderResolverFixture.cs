using System;
using Moq;
using NUnit.Framework;
using NzbDrone.Core.Download.Clients.DownloadStation;
using NzbDrone.Core.Download.Clients.DownloadStation.Proxies;
using NzbDrone.Core.Test.Framework;
using NzbDrone.Test.Common;

namespace NzbDrone.Core.Test.Download.DownloadClientTests.DownloadStationTests
{
    [TestFixture]
    public class SharedFolderResolverFixture : CoreTest<SharedFolderResolver>
    {
        protected string _sharedFolder = "shared/folder";
        protected string _serialNumber = "SERIALNUMBER";
        protected DownloadStationSettings _settings;

        [SetUp]
        protected void Setup()
        {
            _settings = new DownloadStationSettings();

            Mocker.GetMock<IFileStationProxy>()
                  .Setup(f => f.GetPhysicalPath(It.IsAny<string>(), It.IsAny<DownloadStationSettings>()))
                  .Throws(new EntryPointNotFoundException($"There is no shared folder: { _sharedFolder }"));
        }

        [Test]
        public void ResolvePhysicalPath_should_log_error_and_throw_when_cannot_resolve_shared_folder()
        {            
            Assert.Throws<EntryPointNotFoundException>(() => Subject.ResolvePhysicalPath(_sharedFolder, _settings, _serialNumber));
            ExceptionVerification.ExpectedErrors(1);
        }
    }
}