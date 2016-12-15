using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;

namespace NzbDrone.Core.Download.Clients.DownloadStation
{
    public class DownloadStationTorrent
    {
        public string Username { get; set; }

        public string Id { get; set; }

        public string Title { get; set; }

        public long Size { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public DownloadStationTaskType Type { get; set; }

        [JsonProperty(PropertyName = "status_extra")]
        public Dictionary<string, string> StatusExtra { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public DownloadStationTaskStatus Status { get; set; }

        public DownloadStationTorrentAdditional Additional { get; set; }

        private string GetMessage()
        {
            if (StatusExtra != null)
            {
                if (Status == DownloadStationTaskStatus.Extracting)
                {
                    return $"Extracting: {int.Parse(StatusExtra["unzip_progress"])}%";
                }

                if (Status == DownloadStationTaskStatus.Error)
                {
                    return StatusExtra["error_detail"];
                }
            }

            return null;
        }

        private DownloadItemStatus GetStatus()
        {
            switch (Status)
            {
                case DownloadStationTaskStatus.Waiting:
                    return DownloadItemStatus.Queued;
                case DownloadStationTaskStatus.Paused:
                    return DownloadItemStatus.Paused;
                case DownloadStationTaskStatus.Finished:
                case DownloadStationTaskStatus.Seeding:
                    return DownloadItemStatus.Completed;
                case DownloadStationTaskStatus.Error:
                    return DownloadItemStatus.Failed;
            }

            return DownloadItemStatus.Downloading;
        }

        public enum DownloadStationTaskType
        {
            BT, NZB, http, ftp, eMule
        }

        public enum DownloadStationTaskStatus
        {
            Waiting,
            Downloading,
            Paused,
            Finishing,
            Finished,
            HashChecking,
            Seeding,
            FileHostingWaiting,
            Extracting,
            Error
        }
    }
}
