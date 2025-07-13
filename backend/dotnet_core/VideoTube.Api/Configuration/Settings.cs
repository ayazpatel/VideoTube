namespace VideoTube.API.Configuration;

public class MongoDBSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
}

public class JwtSettings
{
    public string AccessTokenSecret { get; set; } = null!;
    public int AccessTokenExpiryMinutes { get; set; }
    public string RefreshTokenSecret { get; set; } = null!;
    public int RefreshTokenExpiryDays { get; set; }
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
}

public class CloudinarySettings
{
    public string CloudName { get; set; } = null!;
    public string ApiKey { get; set; } = null!;
    public string ApiSecret { get; set; } = null!;
}

public class S3Settings
{
    public string BucketName { get; set; } = null!;
    public string? Region { get; set; } // No longer required for MinIO, but keep for AWS compatibility
    public string AccessKeyId { get; set; } = null!;
    public string SecretAccessKey { get; set; } = null!;
    public string? ServiceUrl { get; set; } // For local MinIO
    public bool ForcePathStyle { get; set; } // For local MinIO
}