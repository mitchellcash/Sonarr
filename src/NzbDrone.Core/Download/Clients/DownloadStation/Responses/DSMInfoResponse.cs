using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Responses
{
    public class DSMInfoResponse
    {
        [JsonProperty("serial")]
        public string SerialNumber { get; set; }
    }
}
