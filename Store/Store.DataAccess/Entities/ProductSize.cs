using Store.DataAccess.Enums;
using System.ComponentModel.DataAnnotations;

namespace Store.DataAccess.Entities
{
    public class ProductSize
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string Name { get; set; }

        [Required]
        public SizeType Type { get; set; }

        public ICollection<ProductVariant> ProductVariants { get; set; }
    }
}
