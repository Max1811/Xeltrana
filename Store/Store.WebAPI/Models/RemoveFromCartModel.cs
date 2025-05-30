namespace Store.WebAPI.Models
{
    public class RemoveFromCartModel
    {
        public int UserId { get; set; }
        public int? ProductVariantId { get; set; }
    }
}
