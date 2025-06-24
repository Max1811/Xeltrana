using AutoMapper;
using Store.DataAccess;

namespace Store.Business.Services
{
    public interface IOrderService
    {

    }
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IMapper _mapper;

        public OrderService(AppDbContext appDbContext, IMapper mapper)
        {
            _appDbContext = appDbContext;
            _mapper = mapper;
        }
    }
}
