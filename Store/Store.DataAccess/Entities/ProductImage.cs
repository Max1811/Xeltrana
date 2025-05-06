using System.Text.Json.Serialization;

public class ProductImage
{
    public int Id { get; set; }
    public string S3Key { get; set; }

    public int ProductId { get; set; }

    [JsonIgnore]
    public Product Product { get; set; }
}