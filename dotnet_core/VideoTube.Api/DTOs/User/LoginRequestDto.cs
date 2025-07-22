using System.ComponentModel.DataAnnotations;

namespace VideoTube.API.DTOs.User;

public class LoginRequestDto
{
    // Users can log in with either their username or email
    public string? Username { get; set; }
    public string? Email { get; set; }

    [Required]
    public required string Password { get; set; }
}