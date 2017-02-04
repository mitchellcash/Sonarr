using NzbDrone.Common.Disk;

namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public interface ISharedFolderResolver
    {        
        SharedFolderMapping ResolvePhysicalPath(string sharedFolder, DownloadStationSettings settings, string serialNumber);
    }
}
