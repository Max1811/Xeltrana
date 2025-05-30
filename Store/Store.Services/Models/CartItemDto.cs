namespace Store.Business.Models
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public ProductDataDto Product { get; set; }
        public ProductVariantDataDto ProductVariant { get; set; }
        public int Quantity { get; set; }
    }
}
