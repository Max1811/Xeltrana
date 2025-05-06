using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Store.Business.Services.Contracts
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);

        Task<Product> CreateProduct(Product product, string tempRef);

        Task<IEnumerable<Product>> GetProductsForMen();

        Task<IEnumerable<Product>> GetProductsForWomen();
    }
}
