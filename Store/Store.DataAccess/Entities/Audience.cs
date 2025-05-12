namespace Store.DataAccess.Entities
{
    public class Audience
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Product Product { get; set; }
    }
}
