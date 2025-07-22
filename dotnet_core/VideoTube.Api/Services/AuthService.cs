using MongoDB.Driver;
using System.Net;
using VideoTube.API.DTOs.User;
using VideoTube.API.Exceptions;
using VideoTube.API.Models;
using MongoDB.Driver.Linq;
using VideoTube.API.Models;

namespace VideoTube.API.Services;

public class AuthService : IAuthService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IS3Service _s3Service; // Changed from ICloudinaryService
    private readonly IJwtService _jwtService;

    // Inject the new S3 service
    public AuthService(IMongoService mongoService, IS3Service s3Service, IJwtService jwtService)
    {
        _usersCollection = mongoService.GetCollection<User>("users");
        _s3Service = s3Service; // Changed from _cloudinaryService
        _jwtService = jwtService;
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

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
    {
        if (string.IsNullOrEmpty(dto.Username) && string.IsNullOrEmpty(dto.Email))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Username or email is required.");
        }

        // Find the user by username or email
        var user = await _usersCollection.Find(u => u.Username == dto.Username || u.Email == dto.Email).FirstOrDefaultAsync();
        if (user == null)
        {
            throw new ApiException(HttpStatusCode.NotFound, "User does not exist.");
        }

        // Check if the password is correct
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);
        if (!isPasswordValid)
        {
            throw new ApiException(HttpStatusCode.Unauthorized, "Invalid user credentials.");
        }

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken(user);

        // Save the refresh token to the user's record in the database
        user.RefreshToken = refreshToken;
        await _usersCollection.ReplaceOneAsync(u => u.Id == user.Id, user);

        // Create the response DTO
        var userResponse = new UserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Avatar = user.Avatar,
            CoverImage = user.CoverImage,
            CreatedAt = user.CreatedAt
        };

        return new LoginResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = userResponse
        };
    }

}