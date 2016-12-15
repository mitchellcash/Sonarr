namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public interface ISerialNumberProvider
    {
        string GetSerialNumber(DownloadStationSettings settings);
    }
}
