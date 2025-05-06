using Azure.Core;
using Microsoft.EntityFrameworkCore;
using MyAuthApi.Data;
using Store.Business.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Store.Business.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IS3Service _s3Service;

        public ProductService(AppDbContext appDbContext, IS3Service s3Service)
        {
            _appDbContext = appDbContext;
            _s3Service = s3Service;
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _appDbContext.Products
                .Where(p => p.Category.Id == categoryId)
                .Include(p => p.ProductImages)
                .ToListAsync();

            return products;
        }

        public async Task<IEnumerable<Product>> GetProductsForMen() => await GetProductsBySex(p => p.IsForMen == true);

        public async Task<IEnumerable<Product>> GetProductsForWomen() => await GetProductsBySex(p => p.IsForWomen == true);

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
                    _appDbContext.ProductImages.Add(new ProductImage { ProductId = product.Id, ImageUrl = newKey });
                }
            }

            await _appDbContext.SaveChangesAsync();

            return product;
        }


        private async Task<IEnumerable<Product>> GetProductsBySex(Expression<Func<Product, bool>> predicate)
        {
            return await _appDbContext.Products
                .Where(predicate)
                .Include(p => p.ProductImages)
                .ToListAsync();
        }
    }
}
