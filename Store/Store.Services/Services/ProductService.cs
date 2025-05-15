using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Store.Business.Models;
using Store.DataAccess;
using Store.DataAccess.Entities;
using Store.Shared.Enums;
using System.Linq.Expressions;

namespace Store.Business.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDataDto>> GetProductsByCategoryAsync(int categoryId, AudienceEnum? audience = null);

        Task<Product> CreateProduct(Product product, string tempRef);

        Task<IEnumerable<ProductDataDto>> GetProductsAsync(AudienceEnum? audience = null);
        Task<IEnumerable<Category>> GetProductCategories();
        Task<ProductDataDto?> GetProductAsync(int id);
        Task<IEnumerable<ProductColor>> GetProductColors();
        Task<IEnumerable<ProductSize>> GetProductSizes();
    }

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

        public async Task<IEnumerable<ProductDataDto>> GetProductsByCategoryAsync(int categoryId, AudienceEnum? audience = null)
        {
            Expression<Func<Product, bool>> filter;

            if (audience == null)
            {
                filter = p => p.Category.Id == categoryId;
            }
            else
            {
                filter = p =>
                    p.Category.Id == categoryId &&
                    (p.AudienceId == (int)AudienceEnum.Unisex || p.AudienceId == (int)audience.Value);
            }

            var products = await GetProducts(filter);
            return _mapper.Map<List<ProductDataDto>>(products);
        }

        public async Task<Product> CreateProduct(Product product, string tempRef)
        {
            var createdProduct = await _appDbContext.Products.AddAsync(product);
            //await _appDbContext.SaveChangesAsync();

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

            if (product.ProductVariants?.Any() == true)
            {
                foreach (var variant in product.ProductVariants)
                {
                    variant.ProductId = product.Id;
                    _appDbContext.ProductVariants.Add(variant);
                }
            }

            await _appDbContext.SaveChangesAsync();

            return product;
        }

        public async Task<IEnumerable<ProductDataDto>> GetProductsAsync(AudienceEnum? audience = null)
        {
            List<Product> products = new List<Product>();

            if (audience == null)
            {
                products = await GetProducts(p => true);
            }
            else
            {
                products = await GetProducts(p => p.AudienceId == (int)AudienceEnum.Unisex || p.AudienceId == (int)audience.Value);
            }

            var productDtos = _mapper.Map<List<ProductDataDto>>(products);

            return productDtos;
        }

        public async Task<IEnumerable<Category>> GetProductCategories()
        {
            return await _appDbContext.Categories.ToListAsync();
        }

        public async Task<ProductDataDto?> GetProductAsync(int id)
        {
            var products = await GetProducts(p => p.Id == id);
            var product = products.FirstOrDefault();

            if (product != null)
            {
                return _mapper.Map<ProductDataDto>(product);
            }
            else
            {
                return null;
            }
        }

        public async Task<IEnumerable<ProductColor>> GetProductColors()
        {
            return await _appDbContext.ProductColors.ToListAsync();
        }

        public async Task<IEnumerable<ProductSize>> GetProductSizes()
        {
            return await _appDbContext.ProductSizes.ToListAsync();
        }

        private async Task<List<Product>> GetProducts(Expression<Func<Product, bool>> predicate)
        {
            return await _appDbContext.Products
                .Where(predicate)
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.ProductVariants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.ProductVariants)
                    .ThenInclude(v => v.Size)
                .ToListAsync();
        }
    }
}
