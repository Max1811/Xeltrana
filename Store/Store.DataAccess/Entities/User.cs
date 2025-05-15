using Store.DataAccess.Entities;
using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Username { get; set; }

    public int UserRoleId { get; set; }

    [Required]
    public string PasswordHash { get; set; }

    [MaxLength(100)]
    public string Email { get; set; }

    public UserRole UserRole { get; set; }
    public ICollection<Order> Orders { get; set; }
    public ICollection<Favorite> Favourites { get; set; }
}
