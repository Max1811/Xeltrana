namespace Store.Business.Models
{
    public class ProductDataDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int CategoryId { get; set; }

        public int AudienceId { get; set; }

        public IEnumerable<string> Images { get; set; }
    }
}
