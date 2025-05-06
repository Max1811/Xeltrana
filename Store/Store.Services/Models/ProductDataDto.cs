namespace Store.Business.Models
{
    public class ProductDataDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int CategoryId { get; set; }

        public bool IsForMen { get; set; }

        public bool IsForWomen { get; set; }

        public IEnumerable<string> Images { get; set; }
    }
}
