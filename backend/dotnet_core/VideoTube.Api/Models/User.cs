using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace VideoTube.API.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("username")]
    public required string Username { get; set; } //

    [BsonElement("email")]
    public required string Email { get; set; } //

    [BsonElement("fullName")]
    public required string FullName { get; set; } //

    [BsonElement("avatar")]
    public required string Avatar { get; set; } //

    [BsonElement("coverImage")]
    public string? CoverImage { get; set; } //

    [BsonElement("history")]
    public List<string> History { get; set; } = []; //

    [BsonElement("password")]
    [JsonIgnore] // Prevents password from being sent in API responses
    public required string Password { get; set; } //

    [BsonElement("refreshToken")]
    [JsonIgnore] // Prevents token from being sent in API responses
    public string? RefreshToken { get; set; } //

    [BsonElement("createdAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}