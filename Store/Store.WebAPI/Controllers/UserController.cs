using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Store.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetProfile()
        {
            var username = User.Identity?.Name;
            return Ok(new { username });
        }

        [HttpGet("all")]
        public List<string> GetUsers()
        {
            return new List<string>
            {
                "Ivan",
                "Paulo",
                "Logan"
            };
        }
    }
}
