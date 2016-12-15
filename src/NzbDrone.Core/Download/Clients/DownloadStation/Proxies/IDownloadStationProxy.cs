using System.Collections.Generic;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Proxies
{
    public interface IDownloadStationProxy
    {
        IEnumerable<DownloadStationTorrent> GetTorrents(DownloadStationSettings settings);
        Dictionary<string, object> GetConfig(DownloadStationSettings settings);
        bool RemoveTorrent(string downloadId, bool deleteData, DownloadStationSettings settings);
        bool AddTorrentFromUrl(string url, string downloadDirectory, DownloadStationSettings settings);
        bool AddTorrentFromData(byte[] torrentData, string filename, string downloadDirectory, DownloadStationSettings settings);
        IEnumerable<int> GetApiVersion(DownloadStationSettings settings);
    }
}
