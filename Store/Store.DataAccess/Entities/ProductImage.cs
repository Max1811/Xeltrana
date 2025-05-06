using System.Text.Json.Serialization;

public class ProductImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; }

    public int ProductId { get; set; }

    [JsonIgnore]
    public Product Product { get; set; }
}