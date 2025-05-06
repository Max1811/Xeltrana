namespace Store.WebAPI.Models
{
    public class ProductDto
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int CategoryId { get; set; }

        public bool IsForMen { get; set; }

        public bool IsForWomen { get; set; }

        public string TempRef { get; set; }
    }
}
