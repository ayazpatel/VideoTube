namespace VideoTube.API.DTOs.User;

public class UserResponseDto
{
    public string? Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string FullName { get; set; }
    public required string Avatar { get; set; }
    public string? CoverImage { get; set; }
    public DateTime CreatedAt { get; set; }
}