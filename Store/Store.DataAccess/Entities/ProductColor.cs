using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Store.DataAccess.Entities
{
    public class ProductColor
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } // "Red", "Black", etc.

        [MaxLength(7)]
        public string HexCode { get; set; } // "#FFFFFF"

        public ICollection<ProductVariant> ProductVariants { get; set; }
    }
}
