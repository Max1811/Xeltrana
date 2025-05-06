using AutoMapper;
using Store.Business.Models;
using Store.WebAPI.Models;

namespace Store.WebAPI.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>();
            CreateMap<ProductDto, Product>();

            CreateMap<ProductImageDto, ProductImage>();
            CreateMap<ProductImageDto[], ProductImage[]>();

            CreateMap<Product, ProductDataDto>()
                .ForMember(dest => dest.Images,
                opt => opt.MapFrom<ImageUrlResolver>());
            }
    }
}
