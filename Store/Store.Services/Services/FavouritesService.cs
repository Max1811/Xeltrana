﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Store.Business.Models;
using Store.DataAccess;
using Store.DataAccess.Entities;

namespace Store.Business.Services
{
    public interface IFavouritesService
    {
        Task<int> GetFavouritesCount(int userId);
        Task<IEnumerable<FavoritesDto>> GetFavourites(int userId);
        Task AddFavorite(Favorite favorite);
        Favorite RemoveFavorite(int productId, int userId);
        Task SwitchFavorite(Favorite favorite);
    }

    public class FavouritesService : IFavouritesService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IMapper _mapper;

        public FavouritesService(AppDbContext appDbContext, IMapper mapper)
        {
            _appDbContext = appDbContext;
            _mapper = mapper;
        }

        public async Task AddFavorite(Favorite favorite)
        {
            var existingFavorite = await GetFavorite(favorite);

            if (existingFavorite == null)
            {
                await _appDbContext.Favorites.AddAsync(favorite);
                await _appDbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<FavoritesDto>> GetFavourites(int userId)
        {
            var favourites = await _appDbContext.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Product)
                .Include(f => f.Product.ProductImages)
                .ToListAsync();

            return _mapper.Map<IEnumerable<FavoritesDto>>(favourites);
        }

        public async Task<int> GetFavouritesCount(int userId)
        {
            return await _appDbContext.Favorites.Where(f => f.UserId == userId).CountAsync();
        }

        public Favorite RemoveFavorite(int productId, int userId)
        {
            return _appDbContext.Favorites.Remove(new Favorite { ProductId = productId, UserId = userId }).Entity;
        }

        public async Task SwitchFavorite(Favorite favorite)
        {
            var existingFavorite = await GetFavorite(favorite);

            if (existingFavorite != null)
            {
                _appDbContext.Favorites.Remove(existingFavorite);
            }
            else
            {
                await _appDbContext.Favorites.AddAsync(favorite);
            }

            await _appDbContext.SaveChangesAsync();
        }

        private async Task<Favorite?> GetFavorite(Favorite favorite)
        {
            return await _appDbContext.Favorites.FirstOrDefaultAsync(f => f.UserId == favorite.UserId && f.ProductId == favorite.ProductId);
        }
    }
}
