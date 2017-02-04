using System;
using System.Runtime.Serialization;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Exceptions
{
    public class SerialNumberException : Exception
    {
        public SerialNumberException()
        {
        }

        public SerialNumberException(string message)
            : base(message)
        {
        }

        public SerialNumberException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        protected SerialNumberException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
