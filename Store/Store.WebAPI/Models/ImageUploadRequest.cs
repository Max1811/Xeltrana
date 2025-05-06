namespace Store.WebAPI.Models
{
    public class ImageUploadRequest
    {
        public string TempRef { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
    }
}
