using AutoMapper;
using Store.Business.Models;
using Store.DataAccess.Entities;
using Store.WebAPI.Models;

namespace Store.WebAPI.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>();

            CreateMap<ProductImageDto, ProductImage>();
            CreateMap<ProductImageDto[], ProductImage[]>();

            CreateMap<Favorite, FavoritesDto>();
            CreateMap<CartItem, CartItemDto>();

            CreateMap<AddFavouriteModel, Favorite>();
            CreateMap<AddToCartModel, CartItem>();

            CreateMap<ProductVariant, ProductVariantDataDto>()
                .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.Size.Name))
                .ForMember(dest => dest.HexCode, opt => opt.MapFrom(src => src.Color.HexCode))
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Color.Name));

            CreateMap<ProductDto, Product>()
                .ForMember(dest => dest.OriginalPrice, opt => opt.MapFrom(src => src.OriginalPrice))
                .ForMember(dest => dest.SalePrice, opt => opt.MapFrom(src => src.SalePrice));

            CreateMap<ProductVariantDto, ProductVariant>();

            CreateMap<Product, ProductDataDto>()
                .ForMember(dest => dest.Images,
                opt => opt.MapFrom<ImageUrlResolver>())
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));
            CreateMap<ProductVariant, ProductVariantDataDto>()
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Color.Name))
                .ForMember(dest => dest.HexCode, opt => opt.MapFrom(src => src.Color.HexCode))
                .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.Size.Name));

            CreateMap<ProductColor, ProductColorDto>();
            CreateMap<ProductSize, ProductSizeDto>();
        }
    }
}
