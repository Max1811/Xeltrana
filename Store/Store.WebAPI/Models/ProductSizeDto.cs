using Store.DataAccess.Enums;

namespace Store.WebAPI.Models
{
    public class ProductSizeDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public SizeType Type { get; set; }
    }
}
