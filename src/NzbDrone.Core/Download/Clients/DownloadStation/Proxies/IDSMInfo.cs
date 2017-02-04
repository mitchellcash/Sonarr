namespace NzbDrone.Core.Download.Clients.DownloadStation.Proxies
{
    public interface IDSMInfoProxy
    {
        string GetSerialNumber(DownloadStationSettings settings);
    }
}
