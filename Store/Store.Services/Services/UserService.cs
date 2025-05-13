using Microsoft.EntityFrameworkCore;
using Store.DataAccess;

namespace Store.Business.Services
{
    public interface IUserService
    {
        Task<bool> IsUserExists(string username);
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _dbContext;

        public UserService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> IsUserExists(string username)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Username == username);

            return user != null;
        }
    }
}
