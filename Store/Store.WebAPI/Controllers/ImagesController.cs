using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Store.WebAPI.Models;

namespace Store.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IS3Service _s3Service;

        public ImagesController(IMapper mapper, IS3Service s3Service)
        {
            _mapper = mapper;
            _s3Service = s3Service;
        }

        [HttpPost("presign-upload")]
        public IActionResult GetPresignedUrl([FromBody] ImageUploadRequest request)
        {
            var key = $"temp/{request.TempRef}/{Guid.NewGuid()}_{request.FileName}";
            var url = _s3Service.GeneratePresignedPutUrl(key, request.ContentType);

            return Ok(new { uploadUrl = url, key });
        }
    }
}
