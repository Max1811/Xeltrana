using AutoMapper;
using Store.Business.Models;

public class ImageUrlResolver : IValueResolver<Product, ProductDataDto, IEnumerable<string>>
{
    private readonly IS3Service _s3Service;

    public ImageUrlResolver(IS3Service s3Service)
    {
        _s3Service = s3Service;
    }

    public IEnumerable<string> Resolve(Product source, ProductDataDto destination, IEnumerable<string> destMember, ResolutionContext context)
    {
        return source.ProductImages?.Select(img => _s3Service.GetPublicUrl(img.S3Key)) ?? [];
    }
}