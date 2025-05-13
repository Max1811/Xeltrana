using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Store.DataAccess.Entities;

public class Product
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; }

    public string Description { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }

    public int AudienceId { get; set; }

    public Audience Audience { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; }
    public ICollection<ProductImage> ProductImages { get; set; }
    public ICollection<Favorite> Favourites { get; set; }
}