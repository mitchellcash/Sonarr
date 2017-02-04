using System.Collections.Generic;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Proxies
{
    public interface IFileStationProxy
    {
        string GetPhysicalPath(string sharedFolder, DownloadStationSettings settings);
        IEnumerable<int> GetApiVersion(DownloadStationSettings settings);
    }
}
