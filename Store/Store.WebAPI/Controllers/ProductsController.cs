using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Business.Models;
using Store.Business.Services;
using Store.Shared.Enums;
using Store.WebAPI.Models;

namespace Store.WebAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public ProductsController(IProductService productService, IMapper mapper)
        {
            _productService = productService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<ProductDataDto>> GetProducts([FromQuery] AudienceEnum? audience = null)
        {
            return await _productService.GetProductsAsync(audience);
        }

        [HttpPost("product")]
        public async Task<Product> CreateProduct([FromBody] ProductDto product)
        {
            var productEntity = _mapper.Map<Product>(product);

            return await _productService.CreateProduct(productEntity, product.TempRef);
        }

        [HttpPut("product")]
        public async Task<Product?> UpdateProduct([FromBody] UpdateProductDto product)
        {
            var images = await _productService.HandleUpdateProductImages(product.Images, product.TempRef, product.Id);
            product.Images = images;

            return await _productService.UpdateProductAsync(product);
        }

        [HttpGet("categories")]
        public async Task<IEnumerable<Category>> GetProductCategoriesAsync()
        {
            return await _productService.GetProductCategories();
        }

        [HttpGet("{id}")]
        public async Task<ProductDataDto?> GetProduct(int id)
        {
            return await _productService.GetProductAsync(id);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IEnumerable<ProductDataDto>> GetProductsByCategory(int categoryId, [FromQuery] AudienceEnum? audience = null)
        {
            return await _productService.GetProductsByCategoryAsync(categoryId, audience);
        }

        [HttpGet("colors")]
        public async Task<IEnumerable<ProductColorDto>> GetProductColors()
        {
            var productColors = await _productService.GetProductColors();

            return _mapper.Map<IEnumerable<ProductColorDto>>(productColors);
        }

        [HttpGet("sizes")]
        public async Task<IEnumerable<ProductSizeDto>> GetProductSizes()
        {
            var productSizes = await _productService.GetProductSizes();

            return _mapper.Map<IEnumerable<ProductSizeDto>>(productSizes);
        }
    }
}
