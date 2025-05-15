using Microsoft.EntityFrameworkCore;
using Store.DataAccess.Entities;
using Store.DataAccess.Enums;
using System.Drawing;

namespace Store.DataAccess;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Shipment> Shipments { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Audience> Audience { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<ProductSize> ProductSizes { get; set; }
    public DbSet<ProductColor> ProductColors { get; set; }
    public DbSet<ProductVariant> ProductVariants { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProductSize>()
            .Property(s => s.Type)
            .HasConversion<string>();

        modelBuilder.Entity<ProductVariant>()
            .HasIndex(pv => new { pv.ProductId, pv.SizeId, pv.ColorId })
            .IsUnique();

        modelBuilder.Entity<Audience>().HasData(
            new Audience { Id = 1, Name = "Male" },
            new Audience { Id = 2, Name = "Female" },
            new Audience { Id = 3, Name = "Unisex" }
        );

        modelBuilder.Entity<UserRole>().HasData(
            new UserRole { Id = 1, Role = "Admin" },
            new UserRole { Id = 2, Role = "Client" }
        );

        modelBuilder.Entity<ProductColor>().HasData(
            new ProductColor { Id = 1, Name = "Black", HexCode = "#000000" },
            new ProductColor { Id = 2, Name = "White", HexCode = "#FFFFFF" },
            new ProductColor { Id = 3, Name = "Red", HexCode = "#FF0000" },
            new ProductColor { Id = 4, Name = "Blue", HexCode = "#0000FF" },
            new ProductColor { Id = 5, Name = "Green", HexCode = "#008000" },
            new ProductColor { Id = 6, Name = "Yellow", HexCode = "#FFFF00" },
            new ProductColor { Id = 7, Name = "Orange", HexCode = "#FFA500" },
            new ProductColor { Id = 8, Name = "Purple", HexCode = "#800080" },
            new ProductColor { Id = 9, Name = "Gray", HexCode = "#808080" },
            new ProductColor { Id = 10, Name = "Pink", HexCode = "#FFC0CB" },
            new ProductColor { Id = 11, Name = "Brown", HexCode = "#A52A2A" },
            new ProductColor { Id = 12, Name = "Beige", HexCode = "#F5F5DC" },
            new ProductColor { Id = 13, Name = "Cyan", HexCode = "#00FFFF" },
            new ProductColor { Id = 14, Name = "Magenta", HexCode = "#FF00FF" },
            new ProductColor { Id = 15, Name = "Navy", HexCode = "#000080" },
            new ProductColor { Id = 16, Name = "Olive", HexCode = "#808000" },
            new ProductColor { Id = 17, Name = "Teal", HexCode = "#008080" },
            new ProductColor { Id = 18, Name = "Maroon", HexCode = "#800000" },
            new ProductColor { Id = 19, Name = "Lime", HexCode = "#00FF00" },
            new ProductColor { Id = 20, Name = "Silver", HexCode = "#C0C0C0" }
        );

        modelBuilder.Entity<ProductSize>().HasData(
    // Alpha sizes
    new ProductSize { Id = 1, Name = "XS", Type = SizeType.Apparel },
    new ProductSize { Id = 2, Name = "S", Type = SizeType.Apparel },
    new ProductSize { Id = 3, Name = "M", Type = SizeType.Apparel },
    new ProductSize { Id = 4, Name = "L", Type = SizeType.Apparel },
    new ProductSize { Id = 5, Name = "XL", Type = SizeType.Apparel },
    new ProductSize { Id = 6, Name = "XXL", Type = SizeType.Apparel },

    // Numeric waist sizes
    new ProductSize { Id = 7, Name = "28", Type = SizeType.Accessories },
    new ProductSize { Id = 8, Name = "30", Type = SizeType.Accessories },
    new ProductSize { Id = 9, Name = "32", Type = SizeType.Accessories },
    new ProductSize { Id = 10, Name = "34", Type = SizeType.Accessories },
    new ProductSize { Id = 11, Name = "36", Type = SizeType.Accessories },
    new ProductSize { Id = 12, Name = "38", Type = SizeType.Accessories },

    // EU shoe sizes 28 to 48
    new ProductSize { Id = 100, Name = "28", Type = SizeType.Shoes },
    new ProductSize { Id = 101, Name = "29", Type = SizeType.Shoes },
    new ProductSize { Id = 102, Name = "30", Type = SizeType.Shoes },
    new ProductSize { Id = 103, Name = "31", Type = SizeType.Shoes },
    new ProductSize { Id = 104, Name = "32", Type = SizeType.Shoes },
    new ProductSize { Id = 105, Name = "33", Type = SizeType.Shoes },
    new ProductSize { Id = 106, Name = "34", Type = SizeType.Shoes },
    new ProductSize { Id = 107, Name = "35", Type = SizeType.Shoes },
    new ProductSize { Id = 108, Name = "36", Type = SizeType.Shoes },
    new ProductSize { Id = 109, Name = "37", Type = SizeType.Shoes },
    new ProductSize { Id = 110, Name = "38", Type = SizeType.Shoes },
    new ProductSize { Id = 111, Name = "39", Type = SizeType.Shoes },
    new ProductSize { Id = 112, Name = "40", Type = SizeType.Shoes },
    new ProductSize { Id = 113, Name = "41", Type = SizeType.Shoes },
    new ProductSize { Id = 114, Name = "42", Type = SizeType.Shoes },
    new ProductSize { Id = 115, Name = "43", Type = SizeType.Shoes },
    new ProductSize { Id = 116, Name = "44", Type = SizeType.Shoes },
    new ProductSize { Id = 117, Name = "45", Type = SizeType.Shoes },
    new ProductSize { Id = 118, Name = "46", Type = SizeType.Shoes },
    new ProductSize { Id = 119, Name = "47", Type = SizeType.Shoes },
    new ProductSize { Id = 120, Name = "48", Type = SizeType.Shoes }
);
    }
}