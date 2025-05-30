using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Store.Business.Models;
using Store.DataAccess;

namespace Store.Business.Services
{
    public interface ICartService
    {
        Task<int> GetCartItemsCount(int userId);
        Task<IEnumerable<CartItemDto>> GetCartItems(int userId);
        Task AddToCart(CartItem cartItem);
        Task<CartItem?> RemoveFromCart(int productId, int userId, int? productVariantId);
        Task SwitchCartItem(CartItem cartItem);
        Task UpdateQuantity(int productVariantId, int quantity);
    }
    public class CartService : ICartService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IMapper _mapper;

        public CartService(AppDbContext appDbContext, IMapper mapper)
        {
            _appDbContext = appDbContext;
            _mapper = mapper;
        }

        public async Task AddToCart(CartItem cartItem)
        {
            var existingCartItem = await GetExistingCartItem(cartItem);

            if (existingCartItem == null)
            {
                cartItem.Quantity = 1;
                await _appDbContext.CartItems.AddAsync(cartItem);
            }
            else
            {
                existingCartItem.Quantity++;
            }

            await _appDbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<CartItemDto>> GetCartItems(int userId)
        {
            var cartItems = await _appDbContext.CartItems
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                    .ThenInclude(p => p.ProductImages)
                .Include(c => c.ProductVariant)
                    .ThenInclude(v => v.Size)
                .Include(c => c.ProductVariant)
                    .ThenInclude(v => v.Color)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CartItemDto>>(cartItems);
        }

        public async Task<int> GetCartItemsCount(int userId)
        {
            return await _appDbContext.CartItems.Where(f => f.UserId == userId).CountAsync();
        }

        public async Task<CartItem?> RemoveFromCart(int productId, int userId, int? productVariantId)
        {
            var cartItem = await GetExistingCartItem(new CartItem 
            { 
                ProductVariantId = productVariantId, 
                UserId = userId, 
                ProductId = productId 
            });

            if (cartItem != null)
            {
                _appDbContext.CartItems.Remove(cartItem);
                _appDbContext.SaveChanges();
            }

            return cartItem;
        }

        public async Task SwitchCartItem(CartItem cartItem)
        {
            var existingCartItem = await GetExistingCartItem(cartItem);

            if (existingCartItem != null)
            {
                _appDbContext.CartItems.Remove(existingCartItem);
            }
            else
            {
                await _appDbContext.CartItems.AddAsync(cartItem);
            }

            await _appDbContext.SaveChangesAsync();
        }

        public async Task UpdateQuantity(int productVariantId, int quantity)
        {
            var cartItem = await _appDbContext.CartItems.FirstOrDefaultAsync(c => c.ProductVariantId == productVariantId);

            if (cartItem is null) return;

            cartItem.Quantity = quantity;
            await _appDbContext.SaveChangesAsync();
        }

        private async Task<CartItem?> GetExistingCartItem(CartItem cartItem)
        {
            if (cartItem.ProductVariantId.HasValue)
            {
                return await _appDbContext.CartItems.FirstOrDefaultAsync(c => c.ProductVariantId == cartItem.ProductVariantId);
            }

            return await _appDbContext.CartItems.FirstOrDefaultAsync(c => c.UserId == cartItem.UserId && c.ProductId == cartItem.ProductId);
        }
    }
}
