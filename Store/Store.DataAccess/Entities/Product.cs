using Store.DataAccess.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Product
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; }

    public string Description { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal OriginalPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? SalePrice { get; set; } // Nullable if no sale

    public DateTime? SaleStartDate { get; set; }
    public DateTime? SaleEndDate { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }

    public int AudienceId { get; set; }

    public Audience Audience { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; }
    public ICollection<ProductImage> ProductImages { get; set; }
    public ICollection<Favorite> Favourites { get; set; }
    public ICollection<ProductVariant> ProductVariants { get; set; }
}