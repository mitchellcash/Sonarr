using System;
using System.Collections.Generic;
using System.Linq;
using NLog;
using NzbDrone.Common.Http;
using NzbDrone.Common.Serializer;
using NzbDrone.Core.Download.Clients.DownloadStation.Responses;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Proxies
{
    public interface IFileStationProxy
    {
        SharedFolderMapping GetSharedFolderMapping(string sharedFolder, DownloadStationSettings settings);
        IEnumerable<int> GetApiVersion(DownloadStationSettings settings);
    }

    public class FileStationProxy : DiskStationProxyBase, IFileStationProxy
    {
        public FileStationProxy(IHttpClient httpClient, Logger logger)
            : base(httpClient, logger)
        {
        }

        public IEnumerable<int> GetApiVersion(DownloadStationSettings settings)
        {
            return base.GetApiVersion(settings, DiskStationApi.FileStationList);
        }

        public SharedFolderMapping GetSharedFolderMapping(string sharedFolder, DownloadStationSettings settings)
        {
            var arguments = new Dictionary<string, object>
            {
                { "api", "SYNO.FileStation.List" },
                { "version", "2" },
                { "method", "getinfo" },
                { "path", new [] { sharedFolder }.ToJson() },
                { "additional", $"[\"real_path\"]" }
            };

            var response = ProcessRequest<FileStationListResponse>(DiskStationApi.FileStationList, arguments, settings);

            if (response.Success == true)
            {
                var physicalPath = response.Data.Files.First().Additional["real_path"].ToString();

                return new SharedFolderMapping(sharedFolder, physicalPath);
            }

            throw new DownloadClientException($"Failed to get shared folder {0}", sharedFolder);
        }
    }
}
