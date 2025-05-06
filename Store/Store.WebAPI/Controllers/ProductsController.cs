using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Store.Business.Services.Contracts;
using Store.WebAPI.Models;

namespace Store.WebAPI.Controllers
{
    [ApiController]
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

        [HttpGet("/products")]
        public async Task<IEnumerable<Product>> GetProductsByCategory([FromQuery] int categoryId)
        {
            return await _productService.GetProductsByCategoryAsync(categoryId);
        }

        [HttpPost("product")]
        public async Task<Product> CreateProduct([FromBody] ProductDto product)
        {
            var productEntity = _mapper.Map<Product>(product);

            return await _productService.CreateProduct(productEntity, product.TempRef);
        }
    }
}
