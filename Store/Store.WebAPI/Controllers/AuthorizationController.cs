using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Store.Business.Services;
using Store.DataAccess;
using Store.WebAPI.Models;

namespace Store.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorizationController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IAuthorizationService _authorizationService;
        private readonly IUserService _userService;

        public AuthorizationController(AppDbContext dbContext, IAuthorizationService authorizationService, IUserService userService)
        {
            _dbContext = dbContext;
            _authorizationService = authorizationService;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            var isUserExists = await _userService.IsUserExists(userDto.UserName);

            if (isUserExists)
            {
                return BadRequest("This username is already taken.");
            }

            var hasher = new PasswordHasher<User>();
            var user = new User
            {
                Username = userDto.UserName
            };
            user.PasswordHash = hasher.HashPassword(user, userDto.Password);

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "User created successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto userDto)
        {
            var user = await _dbContext.Users
                .Include(u => u.UserRole)
                .FirstOrDefaultAsync(u => u.Username == userDto.UserName);

            if (user is null)
                return Unauthorized();

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, userDto.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized();

            var token = _authorizationService.GenerateJwtToken(user);
            return Ok(new { token, user });
        }
    }
}
