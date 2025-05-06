using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;

public interface IS3Service
{
    string GeneratePresignedPutUrl(string key, string contentType, int expireSeconds = 300);
    Task<List<S3Object>> ListObjectsAsync(string prefix);
    Task MoveObjectAsync(string sourceKey, string destinationKey);
    string GetPublicUrl(string key);
}

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly string _cdnBaseUrl;

    public S3Service(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _bucketName = configuration["AWS:S3:BucketName"];
        _cdnBaseUrl = configuration["AWS:S3:CdnBaseUrl"];
    }

    public string GeneratePresignedPutUrl(string key, string contentType, int expireSeconds = 300)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = key,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddSeconds(expireSeconds),
            ContentType = contentType
        };

        return _s3Client.GetPreSignedURL(request);
    }

    public async Task<List<S3Object>> ListObjectsAsync(string prefix)
    {
        var request = new ListObjectsV2Request
        {
            BucketName = _bucketName,
            Prefix = prefix
        };

        var response = await _s3Client.ListObjectsV2Async(request);
        return response.S3Objects;
    }

    public async Task MoveObjectAsync(string sourceKey, string destinationKey)
    {
        // 1. Copy
        var copyRequest = new CopyObjectRequest
        {
            SourceBucket = _bucketName,
            SourceKey = sourceKey,
            DestinationBucket = _bucketName,
            DestinationKey = destinationKey
        };

        await _s3Client.CopyObjectAsync(copyRequest);

        // 2. Delete original
        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = sourceKey
        };

        await _s3Client.DeleteObjectAsync(deleteRequest);
    }

    public string GetPublicUrl(string key)
    {
        return $"{_cdnBaseUrl}/{key}";
    }
}
