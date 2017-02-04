using NzbDrone.Common.Disk;

namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public class SharedFolderMapping
    {        
        public OsPath PhysicalPath { get; private set; }
        public OsPath SharedFolder { get; private set; }

        public SharedFolderMapping(string physicalPath, string sharedFolder)
        {
            PhysicalPath = new OsPath(physicalPath);
            SharedFolder = new OsPath(sharedFolder);
        }

        public override string ToString()
        {
            return $"{SharedFolder} -> {PhysicalPath}";
        }
    }
}
