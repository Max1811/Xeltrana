using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Business.Models;
using Store.Business.Services.Contracts;
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

        [HttpGet("categories")]
        public async Task<IEnumerable<Category>> GetProductCategoriesAsync()
        {
            return await _productService.GetProductCategories();
        }
    }
}
