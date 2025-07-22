using System.Net;
using System.Text.Json;
using VideoTube.API.Exceptions;

namespace VideoTube.API.Middleware;

public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception error)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            // Default to 500 Internal Server Error if not specified
            response.StatusCode = (int)HttpStatusCode.InternalServerError;

            string message = "An unexpected error occurred.";
            IEnumerable<string>? errors = null;

            // Check for our custom exception type
            if (error is ApiException apiException)
            {
                response.StatusCode = (int)apiException.StatusCode;
                message = apiException.Message;
                errors = apiException.Errors;
            }

            var result = JsonSerializer.Serialize(new { success = false, message, errors });
            await response.WriteAsync(result);
        }
    }
}