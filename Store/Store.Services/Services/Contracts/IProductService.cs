using Store.Business.Models;
using Store.Shared.Enums;

namespace Store.Business.Services.Contracts
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);

        Task<Product> CreateProduct(Product product, string tempRef);

        Task<IEnumerable<ProductDataDto>> GetProductsAsync(AudienceEnum? audience = null);
        Task<IEnumerable<Category>> GetProductCategories();
    }
}
