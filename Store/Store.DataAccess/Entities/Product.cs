using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

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

    [Required]
    public bool IsForMen { get; set; }

    [Required]
    public bool IsForWomen { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; }
    public ICollection<ProductImage> ProductImages { get; set; }
}