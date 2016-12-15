using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Core.Download.Clients.DownloadStation.Proxies;
using System;

namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public class SerialNumberProvider : ISerialNumberProvider
    {
        private readonly IDSMInfoProxy _proxy;
        private ICached<SerialNumberCache> _cache;
        private readonly ILogger _logger;

        public SerialNumberProvider(ICacheManager cacheManager,
                                   IDSMInfoProxy proxy,
                                   Logger logger)
        {
            _proxy = proxy;
            _cache = cacheManager.GetCache<SerialNumberCache>(GetType());
            _logger = logger;
        }

        public string GetSerialNumber(DownloadStationSettings settings)
        {
            try
            {
                return _cache.Get(settings.Host,
                                             () => { return new SerialNumberCache(_proxy.GetSerialNumber(settings)); },
                                             TimeSpan.FromHours(1)).SerialNumber;
            }
            catch (Exception e)
            {
                _logger.Error(e, "Could not get the serial number from {0}:{1}", settings.Host, settings.Port);
                throw e;
            }
        }
    }
}
