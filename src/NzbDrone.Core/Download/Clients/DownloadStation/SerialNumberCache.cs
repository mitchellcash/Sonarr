using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public class SerialNumberCache
    {
        public string SerialNumber { get; set; }

        public SerialNumberCache(string serialNumber)
        {
            SerialNumber = serialNumber;
        }

        public override string ToString()
        {
            return SerialNumber.ToString();
        }
    }
}
