using Moq;
using NUnit.Framework;
using NzbDrone.Core.Download.Clients.DownloadStation;
using NzbDrone.Core.Download.Clients.DownloadStation.Exceptions;
using NzbDrone.Core.Download.Clients.DownloadStation.Proxies;
using NzbDrone.Core.Test.Framework;
using NzbDrone.Test.Common;

namespace NzbDrone.Core.Test.Download.DownloadClientTests.DownloadStationTests
{
    [TestFixture]
    public class SerialNumberProviderFixture : CoreTest<SerialNumberProvider>
    {
        protected DownloadStationSettings _settings;

        [SetUp]
        protected void Setup()
        {
            _settings = new DownloadStationSettings();

            Mocker.GetMock<IDSMInfoProxy>()
                  .Setup(d => d.GetSerialNumber(It.IsAny<DownloadStationSettings>()))
                  .Throws(new SerialNumberException("Failed to get Download Station serial number"));
        }

        [Test]
        public void GetSerialNumber_should_log_error_and_throw_when_cannot_provide_serial_number()
        {
            Assert.Throws<SerialNumberException>(() => Subject.GetSerialNumber(_settings));
            ExceptionVerification.ExpectedErrors(1);
        }
    }
}