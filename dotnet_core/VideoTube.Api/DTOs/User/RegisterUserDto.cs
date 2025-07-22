using System.ComponentModel.DataAnnotations;

namespace VideoTube.API.DTOs.User;

public class RegisterUserDto
{
    [Required]
    public required string FullName { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string Username { get; set; }

    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")]
    public required string Password { get; set; }

    [Required]
    public required IFormFile Avatar { get; set; }

    public IFormFile? CoverImage { get; set; }
}