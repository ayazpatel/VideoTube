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
}