using System.ComponentModel.DataAnnotations;

namespace Store.DataAccess.Entities
{
    public class ProductVariant
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        [Required]
        public int SizeId { get; set; }
        public ProductSize Size { get; set; }

        [Required]
        public int ColorId { get; set; }
        public ProductColor Color { get; set; }

        public int StockQuantity { get; set; }
    }
}
