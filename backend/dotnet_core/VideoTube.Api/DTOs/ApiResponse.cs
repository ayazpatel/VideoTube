namespace VideoTube.API.DTOs;

public class ApiResponse<T>
{
    public int StatusCode { get; set; }
    public T Data { get; set; }
    public string Message { get; set; }
    public bool Success { get; set; }

    public ApiResponse(int statusCode, T data, string message = "Success")
    {
        StatusCode = statusCode;
        Data = data;
        Message = message;
        Success = statusCode < 400; // Success is true for status codes in the 2xx range
    }
}