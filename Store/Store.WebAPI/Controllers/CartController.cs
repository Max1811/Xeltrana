using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Business.Models;
using Store.Business.Services;
using Store.WebAPI.Models;

namespace Store.WebAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        private readonly IMapper _mapper;

        public CartController(IMapper mapper, ICartService cartService)
        {
            _cartService = cartService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<CartItemDto>> CartItems([FromQuery] int userId)
        {
            return await _cartService.GetCartItems(userId);
        }

        [HttpGet("count")]
        public async Task<object> CartItemsCount([FromQuery] int userId)
        {
            return await _cartService.GetCartItemsCount(userId);
        }

        [HttpPost]
        public async Task AddToCart([FromBody] AddToCartModel addToFavouritesModel)
        {
            await _cartService.AddToCart(_mapper.Map<CartItem>(addToFavouritesModel));
        }

        [HttpDelete("{productId}")]
        public async Task<CartItem?> RemoveFromCart(int productId, [FromBody] RemoveFromCartModel removeFromCartModel)
        {
            return await _cartService.RemoveFromCart(productId, removeFromCartModel.UserId, removeFromCartModel.ProductVariantId);
        }

        [HttpPost("switch")]
        public async Task SwitchCartItem([FromBody] AddToCartModel switchCartItemModel)
        {
            await _cartService.SwitchCartItem(_mapper.Map<CartItem>(switchCartItemModel));
        }

        [HttpPut("{productVariantId}/quantity")]
        public async Task UpdateProductVariantQuantity(int productVariantId, [FromBody] UpdateCartProductVariantQuantity updateQuantityModel)
        {
            await _cartService.UpdateQuantity(productVariantId, updateQuantityModel.Quantity);
        }
    }
}
