using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Responses
{
    public class FileStationListResponse
    {
        public List<FileStationListFileInfoResponse> Files { get; set; }
    }
}
