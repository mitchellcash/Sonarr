using NzbDrone.Common.Disk;

namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public interface ISharedFolderResolver
    {        
        OsPath ResolvePhysicalPath(string sharedFolder, DownloadStationSettings settings, string serialNumber);
    }
}
