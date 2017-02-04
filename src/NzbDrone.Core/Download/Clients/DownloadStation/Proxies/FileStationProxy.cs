using System;
using System.Collections.Generic;
using System.Linq;
using NLog;
using NzbDrone.Common.Http;
using NzbDrone.Common.Serializer;
using NzbDrone.Core.Download.Clients.DownloadStation.Responses;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Proxies
{
    public class FileStationProxy : DiskStationProxyBase, IFileStationProxy
    {
        public FileStationProxy(IHttpClient httpClient, Logger logger)
            : base(httpClient, logger)
        {
        }

        public IEnumerable<int> GetApiVersion(DownloadStationSettings settings)
        {
            return base.GetApiVersion(settings, SynologyApi.FileStationList);
        }

        public string GetPhysicalPath(string sharedFolder, DownloadStationSettings settings)
        {
            var arguments = new Dictionary<string, object>
            {
                { "api", "SYNO.FileStation.List" },
                { "version", "2" },
                { "method", "getinfo" },
                { "path", new [] { sharedFolder }.ToJson() },
                { "additional", $"[\"real_path\"]" }
            };

            try
            {
                var response = ProcessRequest<FileStationListResponse>(SynologyApi.FileStationList, arguments, settings);

                if (response.Success == true)
                {
                    return response.Data.Files.First().Additional["real_path"].ToString();
                }
                _logger.Debug("Failed to get shared folder {0}", sharedFolder);
                throw new EntryPointNotFoundException($"There is no shared folder: { sharedFolder }");
            }
            catch (DownloadClientException e)
            {
                _logger.Debug("Failed to get config from Download Station");

                throw e;
            }
        }
    }
}
