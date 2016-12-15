namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public class SharedFolderCache
    {        
        public string PhysicalPath { get; private set; }

        public SharedFolderCache(string physicalPath)
        {
            PhysicalPath = physicalPath;
        }

        public override string ToString()
        {
            return PhysicalPath;
        }
    }
}
