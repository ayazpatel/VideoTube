using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VideoTube.API.DTOs;
using VideoTube.API.DTOs.User;
using VideoTube.API.Services;

namespace VideoTube.API.Controllers;

[ApiController]
[Route("api/v1/users")] // [cite: 195]
public class UsersController : ControllerBase
{
    private readonly IAuthService _authService;

    public UsersController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")] // [cite: 404]
    public async Task<IActionResult> Register([FromForm] RegisterUserDto registerUserDto)
    {
        var createdUser = await _authService.RegisterAsync(registerUserDto);

        // This creates a response that matches your Express ApiResponse structure
        var response = new ApiResponse<UserResponseDto>(201, createdUser, "User registered Successfully");

        return StatusCode(response.StatusCode, response);
    }

    // POST /api/v1/users/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
    {
        var loginResponse = await _authService.LoginAsync(loginRequestDto);

        Response.Cookies.Append("accessToken", loginResponse.AccessToken, new CookieOptions { HttpOnly = true, Secure = true });
        Response.Cookies.Append("refreshToken", loginResponse.RefreshToken, new CookieOptions { HttpOnly = true, Secure = true });

        var response = new ApiResponse<LoginResponseDto>(200, loginResponse, "User logged in successfully");
        return Ok(response);
    }

    // --- Secured Routes ---
    // The [Authorize] attribute replaces the verifyJWT middleware.
    // We will configure it in the next step.

    // POST /api/v1/users/logout
    [HttpPost("logout")]
    // [Authorize]
    public IActionResult Logout()
    {
        // Logic to be implemented
        return Ok(new { message = "Logout endpoint placeholder" });
    }

    // POST /api/v1/users/refresh-token
    [HttpPost("refresh-token")]
    public IActionResult RefreshToken()
    {
        // Logic to be implemented
        return Ok(new { message = "Refresh token endpoint placeholder" });
    }

    // POST /api/v1/users/change-password
    [HttpPost("change-password")]
    // [Authorize]
    public IActionResult ChangePassword()
    {
        // Logic to be implemented
        return Ok(new { message = "Change password endpoint placeholder" });
    }

    // GET /api/v1/users/current-user
    [HttpGet("current-user")]
    // [Authorize]
    public IActionResult GetCurrentUser()
    {
        // Logic to be implemented
        return Ok(new { message = "Get current user endpoint placeholder" });
    }

    // PATCH /api/v1/users/update-account
    [HttpPatch("update-account")]
    // [Authorize]
    public IActionResult UpdateAccountDetails()
    {
        // Logic to be implemented
        return Ok(new { message = "Update account endpoint placeholder" });
    }

    // PATCH /api/v1/users/update-avatar
    [HttpPatch("update-avatar")]
    // [Authorize]
    public IActionResult UpdateUserAvatar()
    {
        // Logic to be implemented
        return Ok(new { message = "Update avatar endpoint placeholder" });
    }

    // PATCH /api/v1/users/update-cover-image
    [HttpPatch("update-cover-image")]
    // [Authorize]
    public IActionResult UpdateUserCoverImage()
    {
        // Logic to be implemented
        return Ok(new { message = "Update cover image endpoint placeholder" });
    }

    // GET /api/v1/users/channel/{username}
    [HttpGet("channel/{username}")]
    // [Authorize]
    public IActionResult GetUserChannelProfile(string username)
    {
        // Logic to be implemented
        return Ok(new { message = $"Get channel profile for {username} placeholder" });
    }

    // GET /api/v1/users/history
    [HttpGet("history")]
    // [Authorize]
    public IActionResult GetWatchHistory()
    {
        // Logic to be implemented
        return Ok(new { message = "Get watch history endpoint placeholder" });
    }
}