namespace VideoTube.API.DTOs.User;

public class LoginResponseDto
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public required UserResponseDto User { get; set; }
}
