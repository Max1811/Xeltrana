namespace Store.Business.Models
{
    public class ProductDataDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal OriginalPrice { get; set; } // new
        public decimal? SalePrice { get; set; }

        public int CategoryId { get; set; }

        public string CategoryName { get; set; }

        public int AudienceId { get; set; }

        public IEnumerable<string> Images { get; set; }
        public List<ProductVariantDataDto> Variants { get; set; }
    }
}
