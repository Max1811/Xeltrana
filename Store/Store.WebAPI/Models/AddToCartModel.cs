namespace Store.WebAPI.Models
{
    public class AddToCartModel
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int? ProductVariantId { get; set; }
    }
}
