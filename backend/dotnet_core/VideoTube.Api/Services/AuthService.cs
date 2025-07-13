using MongoDB.Driver;
using System.Net;
using VideoTube.API.DTOs.User;
using VideoTube.API.Exceptions;
using VideoTube.API.Models;

namespace VideoTube.API.Services;

public class AuthService : IAuthService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IS3Service _s3Service; // Changed from ICloudinaryService

    // Inject the new S3 service
    public AuthService(IMongoService mongoService, IS3Service s3Service)
    {
        _usersCollection = mongoService.GetCollection<User>("users");
        _s3Service = s3Service; // Changed from _cloudinaryService
    }

    public async Task<UserResponseDto> RegisterAsync(RegisterUserDto dto)
    {
        var existingUser = await _usersCollection.Find(u => u.Username == dto.Username || u.Email == dto.Email).FirstOrDefaultAsync();
        if (existingUser != null)
        {
            throw new ApiException(HttpStatusCode.Conflict, "User with email or username already exists.");
        }

        // Upload avatar to S3
        var avatarUrl = await _s3Service.UploadFileAsync(dto.Avatar);
        if (string.IsNullOrEmpty(avatarUrl))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Error uploading avatar.");
        }

        // Upload cover image if it exists
        string? coverImageUrl = null;
        if (dto.CoverImage != null)
        {
            coverImageUrl = await _s3Service.UploadFileAsync(dto.CoverImage);
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Username = dto.Username.ToLower(),
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Avatar = avatarUrl, // Use the S3 URL
            CoverImage = coverImageUrl ?? ""
        };

        await _usersCollection.InsertOneAsync(user);

        return new UserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Avatar = user.Avatar,
            CoverImage = user.CoverImage,
            CreatedAt = user.CreatedAt
        };
    }
}