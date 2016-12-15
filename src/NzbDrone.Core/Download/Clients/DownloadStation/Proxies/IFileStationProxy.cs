using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Proxies
{
    public interface IFileStationProxy
    {
        string GetPhysicalPath(string sharedFolder, DownloadStationSettings settings);
        IEnumerable<int> GetApiVersion(DownloadStationSettings settings);
    }
}
