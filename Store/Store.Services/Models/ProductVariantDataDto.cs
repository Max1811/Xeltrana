namespace Store.Business.Models
{
    public class ProductVariantDataDto
    {
        public int Id { get; set; }
        public string Color { get; set; }
        public int ColorId { get; set; }
        public string HexCode { get; set; }
        public string Size { get; set; }
        public int SizeId { get; set; }
        public int StockQuantity { get; set; }
    }
}
