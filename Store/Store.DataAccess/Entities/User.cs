using Store.DataAccess.Entities;
using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Username { get; set; }

    [Required]
    public string PasswordHash { get; set; }

    [MaxLength(100)]
    public string Email { get; set; }

    public ICollection<Order> Orders { get; set; }
    public ICollection<Favourite> Favourites { get; set; }
}
