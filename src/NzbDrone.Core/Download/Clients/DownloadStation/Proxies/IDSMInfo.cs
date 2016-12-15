using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Proxies
{
    public interface IDSMInfoProxy
    {
        string GetSerialNumber(DownloadStationSettings settings);
    }
}
