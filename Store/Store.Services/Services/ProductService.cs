using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyAuthApi.Data;
using Store.Business.Models;
using Store.Business.Services.Contracts;
using System.Linq.Expressions;

namespace Store.Business.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IS3Service _s3Service;
        private readonly IMapper _mapper; 

        public ProductService(
            AppDbContext appDbContext,
            IS3Service s3Service,
            IMapper mapper)
        {
            _appDbContext = appDbContext;
            _s3Service = s3Service;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _appDbContext.Products
                .Where(p => p.Category.Id == categoryId)
                .Include(p => p.ProductImages)
                .ToListAsync();

            return products;
        }

        public async Task<IEnumerable<Product>> GetProductsForMen() => await GetProducts(p => p.IsForMen == true);

        public async Task<IEnumerable<Product>> GetProductsForWomen() => await GetProducts(p => p.IsForWomen == true);

        public async Task<Product> CreateProduct(Product product, string tempRef)
        {
            var createdProduct = await _appDbContext.Products.AddAsync(product);
            await _appDbContext.SaveChangesAsync();

            var tempFolder = $"temp/{tempRef}/";
            var objects = await _s3Service.ListObjectsAsync(tempFolder);

            if (objects != null)
            {
                foreach (var obj in objects)
                {
                    var newKey = $"products/{product.Id}/{Path.GetFileName(obj.Key)}";
                    await _s3Service.MoveObjectAsync(obj.Key, newKey);
                    _appDbContext.ProductImages.Add(new ProductImage { ProductId = product.Id, S3Key = newKey });
                }
            }

            await _appDbContext.SaveChangesAsync();

            return product;
        }

        public async Task<IEnumerable<ProductDataDto>> GetProductsAsync()
        {
            var products = await _appDbContext.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .ToListAsync();

            var productDtos = _mapper.Map<List<ProductDataDto>>(products);

            return productDtos;
        }


        private async Task<IEnumerable<Product>> GetProducts(Expression<Func<Product, bool>> predicate)
        {
            return await _appDbContext.Products
                .Where(predicate)
                .Include(p => p.ProductImages)
                .ToListAsync();
        }
    }
}
