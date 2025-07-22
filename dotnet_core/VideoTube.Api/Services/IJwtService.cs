using VideoTube.API.Models;

namespace VideoTube.API.Services;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken(User user);
}
