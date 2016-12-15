using NLog;
using NzbDrone.Common.Http;
using NzbDrone.Common.Serializer;
using NzbDrone.Core.Download.Clients.DownloadStation.Responses;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace NzbDrone.Core.Download.Clients.DownloadStation.Proxies
{
    public abstract class DiskStationProxyBase
    {
        private static readonly Dictionary<SynologyApi, string> Resources;

        private readonly IHttpClient _httpClient;
        protected readonly Logger _logger;
        private bool _authenticated;

        static DiskStationProxyBase()
        {
            Resources = new Dictionary<SynologyApi, string>
            {
                { SynologyApi.Info, "query.cgi" }
            };
        }

        public DiskStationProxyBase(IHttpClient httpClient, Logger logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }


        protected DiskStationResponse<object> ProcessRequest(SynologyApi api,
                                                                 Dictionary<string, object> arguments,
                                                                 DownloadStationSettings settings,
                                                                 HttpMethod method = HttpMethod.GET)
        {
            return ProcessRequest<object>(api, arguments, settings, method);
        }

        protected DiskStationResponse<T> ProcessRequest<T>(SynologyApi api,
                                                               Dictionary<string, object> arguments,
                                                               DownloadStationSettings settings,
                                                               HttpMethod method = HttpMethod.GET,                                                              
                                                               int retries = 0 ) where T : new()
        {
            if (retries == 5)
            {
                throw new DownloadClientException("Try to process same request more than 5 times");
            }

            if (!_authenticated && api != SynologyApi.Info && api != SynologyApi.DSMInfo)
            {
                AuthenticateClient(settings);
            }

            var requestBuilder = BuildRequest(settings, api, arguments, method);                               
            var request = requestBuilder.Build();
            var response = _httpClient.Execute(request);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                var responseContent = Json.Deserialize<DiskStationResponse<T>>(response.Content);

                if (!responseContent.Success && responseContent.Error.SessionError)
                {
                    _authenticated = false;
                    return ProcessRequest<T>(api, arguments, settings, method, retries++);
                }
                else
                {
                    return responseContent;
                }
            }
            else
            {
                throw new HttpException(request, response);
            }
        }

        private void AuthenticateClient(DownloadStationSettings settings)
        {
            var arguments = new Dictionary<string, object>
            {
                 { "api", "SYNO.API.Auth" },
                 { "version", "1" },
                 { "method", "login" },
                 { "account", settings.Username },
                 { "passwd", settings.Password },
                 { "format", "cookie" },
                 { "session", "DownloadStation" },
             };

            var authLoginRequest = BuildRequest(settings, SynologyApi.Auth, arguments, HttpMethod.GET).Build();
            authLoginRequest.StoreResponseCookie = true;

            var response = _httpClient.Execute(authLoginRequest);

            var downloadStationResponse = Json.Deserialize<DiskStationResponse<DiskStationAuthResponse>>(response.Content);

            var authResponse = Json.Deserialize<DiskStationResponse<DiskStationAuthResponse>>(response.Content);

            _authenticated = authResponse.Success;

            if (!_authenticated)
            {
                throw new DownloadClientAuthenticationException(downloadStationResponse.Error.GetMessage(SynologyApi.Auth));
            }
        }

        private HttpRequestBuilder BuildRequest(DownloadStationSettings settings, SynologyApi api, Dictionary<string, object> arguments, HttpMethod method)
        {
            if (!Resources.ContainsKey(api))
            {
                GetApiVersion(settings, api);
            }

            var requestBuilder = new HttpRequestBuilder(false, settings.Host, settings.Port).Resource($"webapi/{Resources[api]}");
            requestBuilder.Method = method;
            requestBuilder.LogResponseContent = true;
            requestBuilder.SuppressHttpError = true;
            requestBuilder.AllowAutoRedirect = false;

            if (requestBuilder.Method == HttpMethod.POST)
            {
                if (api == SynologyApi.DownloadStationTask && arguments.ContainsKey("file"))
                {
                    requestBuilder.Headers.ContentType = "multipart/form-data";

                    foreach (var arg in arguments)
                    {
                        if (arg.Key == "file")
                        {
                            Dictionary<string, object> file = (Dictionary<string, object>)arg.Value;
                            requestBuilder.AddFormUpload(arg.Key, file["name"].ToString(), (byte[])file["data"]);
                        }
                        else
                        {
                            requestBuilder.AddFormParameter(arg.Key, arg.Value);
                        }
                    }

                    return requestBuilder;
                }

                requestBuilder.Headers.ContentType = "application/json";
            }

            foreach (var arg in arguments)
            {
                requestBuilder.AddQueryParam(arg.Key, arg.Value);
            }

            return requestBuilder;
        }

        protected IEnumerable<int> GetApiVersion(DownloadStationSettings settings, SynologyApi api)
        {
            var arguments = new Dictionary<string, object>
            {
                 { "api", "SYNO.API.Info" },
                 { "version", "1" },
                 { "method", "query" },
                 { "query", "SYNO.API.Auth, SYNO.DownloadStation.Info, SYNO.DownloadStation.Task, SYNO.FileStation.List, SYNO.DSM.Info" },
             };

            var infoResponse = ProcessRequest<DiskStationApiInfoResponse>(SynologyApi.Info, arguments, settings);

            if (infoResponse.Success == true)
            {
                //TODO: Refactor this into more elegant code
                var infoResponeDSAuth = infoResponse.Data["SYNO.API.Auth"];
                var infoResponeDSInfo = infoResponse.Data["SYNO.DownloadStation.Info"];
                var infoResponeDSTask = infoResponse.Data["SYNO.DownloadStation.Task"];
                var infoResponseFSList = infoResponse.Data["SYNO.FileStation.List"];
                var infoResponseDSMInfo = infoResponse.Data["SYNO.DSM.Info"];

                Resources[SynologyApi.Auth] = infoResponeDSAuth.Path;
                Resources[SynologyApi.DownloadStationInfo] = infoResponeDSInfo.Path;
                Resources[SynologyApi.DownloadStationTask] = infoResponeDSTask.Path;
                Resources[SynologyApi.FileStationList] = infoResponseFSList.Path;
                Resources[SynologyApi.DSMInfo] = infoResponseDSMInfo.Path;

                switch (api)
                {
                    case SynologyApi.Auth:
                        return Enumerable.Range(infoResponeDSAuth.MinVersion, infoResponeDSAuth.MaxVersion - infoResponeDSAuth.MinVersion + 1);
                    case SynologyApi.DownloadStationInfo:
                        return Enumerable.Range(infoResponeDSInfo.MinVersion, infoResponeDSInfo.MaxVersion - infoResponeDSInfo.MinVersion + 1);
                    case SynologyApi.DownloadStationTask:
                        return Enumerable.Range(infoResponeDSTask.MinVersion, infoResponeDSTask.MaxVersion - infoResponeDSTask.MinVersion + 1);
                    case SynologyApi.FileStationList:
                        return Enumerable.Range(infoResponseFSList.MinVersion, infoResponseFSList.MaxVersion - infoResponseFSList.MinVersion + 1);
                    case SynologyApi.DSMInfo:
                        return Enumerable.Range(infoResponseDSMInfo.MinVersion, infoResponseDSMInfo.MaxVersion - infoResponseDSMInfo.MinVersion + 1);
                    default:
                        throw new DownloadClientException("Api not implemented");
                }
            }
            else
            {
                throw new DownloadClientException(infoResponse.Error.GetMessage(SynologyApi.Info));
            }
        }
    }
}
