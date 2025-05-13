using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Business.Services;
using Store.DataAccess.Entities;
using Store.WebAPI.Models;

namespace Store.WebAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavouritesService _favouritesService;
        private readonly IMapper _mapper;

        public FavoritesController(IMapper mapper, IFavouritesService favouritesService)
        {
            _favouritesService = favouritesService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<object> Favorites([FromQuery] int userId)
        {
            return await _favouritesService.GetFavourites(userId);
        }

        [HttpGet("count")]
        public async Task<object> FavoritesCount([FromQuery] int userId)
        {
            return await _favouritesService.GetFavouritesCount(userId);
        }

        [HttpPost]
        public async Task AddFavorite([FromBody] AddFavouriteModel addToFavouritesModel)
        {
            await _favouritesService.AddFavorite(_mapper.Map<Favorite>(addToFavouritesModel));
        }

        [HttpDelete("{productId}")]
        public Favorite RemoveFavorite(int productId, [FromBody] RemoveFavoriteModel removeFavoriteModel)
        {
            return _favouritesService.RemoveFavorite(productId, removeFavoriteModel.UserId);
        }

        [HttpPost("switch")]
        public async Task SwitchFavorite([FromBody] AddFavouriteModel switchFavoriteModel)
        {
            await _favouritesService.SwitchFavorite(_mapper.Map<Favorite>(switchFavoriteModel));
        }
    }
}
