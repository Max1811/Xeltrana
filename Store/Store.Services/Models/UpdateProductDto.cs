namespace Store.WebAPI.Models
{
    public class UpdateProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public decimal OriginalPrice { get; set; }
        public decimal? SalePrice { get; set; }

        public int CategoryId { get; set; }

        public int AudienceId { get; set; }

        public string TempRef { get; set; }

        public List<ProductVariantDto> ProductVariants { get; set; }

        public List<string> Images { get; set; }
    }
}
