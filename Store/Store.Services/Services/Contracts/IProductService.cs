using Store.Business.Models;

namespace Store.Business.Services.Contracts
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);

        Task<Product> CreateProduct(Product product, string tempRef);

        Task<IEnumerable<Product>> GetProductsForMen();

        Task<IEnumerable<Product>> GetProductsForWomen();

        Task<IEnumerable<ProductDataDto>> GetProductsAsync();
    }
}
