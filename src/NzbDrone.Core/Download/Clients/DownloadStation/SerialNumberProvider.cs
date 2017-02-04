using System;
using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Core.Download.Clients.DownloadStation.Exceptions;
using NzbDrone.Core.Download.Clients.DownloadStation.Proxies;

namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public class SerialNumberProvider : ISerialNumberProvider
    {
        private readonly IDSMInfoProxy _proxy;
        private ICached<string> _cache;
        private readonly ILogger _logger;

        public SerialNumberProvider(ICacheManager cacheManager,
                                   IDSMInfoProxy proxy,
                                   Logger logger)
        {
            _proxy = proxy;
            _cache = cacheManager.GetCache<string>(GetType());
            _logger = logger;
        }

        public string GetSerialNumber(DownloadStationSettings settings)
        {
            try
            {
                return _cache.Get(settings.Host,
                                             () =>  _proxy.GetSerialNumber(settings),
                                             TimeSpan.FromMinutes(5));
            }
            catch (SerialNumberException e)
            {
                _logger.Error(e, "Could not get the serial number from {0}:{1}", settings.Host, settings.Port);
                throw e;
            }
        }
    }
}
