using System.Net;

namespace VideoTube.API.Exceptions;

public class ApiException : Exception
{
    public HttpStatusCode StatusCode { get; }
    public IEnumerable<string>? Errors { get; }

    public ApiException(HttpStatusCode statusCode, string message, IEnumerable<string>? errors = null)
        : base(message)
    {
        StatusCode = statusCode;
        Errors = errors;
    }
}