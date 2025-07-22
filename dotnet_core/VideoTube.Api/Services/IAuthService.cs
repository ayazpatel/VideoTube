using VideoTube.API.DTOs.User;

namespace VideoTube.API.Services;

public interface IAuthService
{
    Task<UserResponseDto> RegisterAsync(RegisterUserDto registerUserDto);
    Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequestDto);
}