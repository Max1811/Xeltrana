using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Store.Business.Services.Contracts
{
    public interface IUserService
    {
        Task<bool> IsUserExists(string username);
    }
}
