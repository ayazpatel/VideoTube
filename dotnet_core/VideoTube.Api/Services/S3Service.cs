using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util; // Add this using directive
using Microsoft.Extensions.Options;
using VideoTube.API.Configuration;
using System.Net;

namespace VideoTube.API.Services;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly S3Settings _s3Settings;

    public S3Service(IOptions<S3Settings> s3Settings)
    {
        _s3Settings = s3Settings.Value;
        var credentials = new Amazon.Runtime.BasicAWSCredentials(_s3Settings.AccessKeyId, _s3Settings.SecretAccessKey);

        var config = new AmazonS3Config
        {
            ServiceURL = _s3Settings.ServiceUrl,
            ForcePathStyle = _s3Settings.ForcePathStyle,
        };

        if (string.IsNullOrEmpty(config.ServiceURL) && !string.IsNullOrEmpty(_s3Settings.Region))
        {
            config.RegionEndpoint = RegionEndpoint.GetBySystemName(_s3Settings.Region);
        }

        _s3Client = new AmazonS3Client(credentials, config);
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        try
        {
            // Use the corrected method to check for bucket existence
            var bucketExists = await AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, _s3Settings.BucketName);
            if (!bucketExists)
            {
                await _s3Client.PutBucketAsync(_s3Settings.BucketName);
            }

            var key = $"{Guid.NewGuid()}-{file.FileName}";
            var request = new PutObjectRequest
            {
                BucketName = _s3Settings.BucketName,
                Key = key,
                InputStream = file.OpenReadStream(),
                ContentType = file.ContentType,
            };

            var response = await _s3Client.PutObjectAsync(request);

            if (response.HttpStatusCode == HttpStatusCode.OK)
            {
                if (!string.IsNullOrEmpty(_s3Settings.ServiceUrl))
                {
                    return $"{_s3Settings.ServiceUrl}/{_s3Settings.BucketName}/{key}";
                }
                else
                {
                    return $"https://{_s3Settings.BucketName}.s3.{_s3Settings.Region}.amazonaws.com/{key}";
                }
            }

            throw new Exception("File upload to S3 failed with a non-OK status code.");
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred during S3 upload: {ex.Message}", ex);
        }
    }
}
