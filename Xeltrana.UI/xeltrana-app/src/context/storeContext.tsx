import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface FavouritesContextProps {
  count: number;
  items: any[];
  refreshFavorites: () => void;
  addFavourite: (productId: number) => Promise<void>;
  removeFavourite: (productId: number) => Promise<void>;
  switchFavorite: (productId: number) => Promise<void>;
}

interface CartContextProps {
  count: number;
  items: any[];
  refreshCart: () => void;
  addToCart: (productId: number, productVariantId?: number) => Promise<void>;
  removeFromCart: (
    productId: number,
    productVariantId?: number
  ) => Promise<void>;
  switchCartItem: (
    productId: number,
    productVariantId?: number
  ) => Promise<void>;
}

interface StoreProps {
  favorites: FavouritesContextProps;
  cart: CartContextProps;
}

const StoreContext = createContext<StoreProps | undefined>(undefined);

export const StoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // favorites
  const [favoritesCount, setfavoritesCount] = useState(0);
  const [favoritesItems, setfavoritesItems] = useState<any[]>([]);

  // cart
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const refreshFavorites = async () => {
    if (userId) {
      const [countRes, itemsRes] = await Promise.all([
        api.get(`/favorites/count?userId=${userId}`),
        api.get(`/favorites?userId=${userId}`),
      ]);

      setfavoritesCount(countRes.data as number);
      setfavoritesItems(itemsRes.data as any[]);
    }
  };

  const refreshCart = async () => {
    if (userId) {
      const [countRes, itemsRes] = await Promise.all([
        api.get(`/cart/count?userId=${userId}`),
        api.get(`/cart?userId=${userId}`),
      ]);

      setCartItemsCount(countRes.data as number);
      setCartItems(itemsRes.data as any[]);
    }
  };

  const addFavourite = async (productId: number) => {
    await api.post(`/favorites`, { userId, productId });
    await refreshFavorites();
  };

  const addToCart = async (productId: number, productVariantId?: number) => {
    await api.post(`/cart`, { userId, productId, productVariantId });
    await refreshCart();
  };

  const removeFavourite = async (productId: number) => {
    await api.delete(`/favorites/${productId}`, {
      data: { userId },
    } as any);
    await refreshFavorites();
  };

  const removeFromCart = async (
    productId: number,
    productVariantId?: number
  ) => {
    await api.delete(`/cart/${productId}`, {
      data: { userId, productVariantId },
    } as any);

    await refreshCart();
  };

  const switchFavorite = async (productId: number) => {
    await api.post(`/favorites/switch`, { userId, productId });
    await refreshFavorites();
  };

  const switchCartItem = async (
    productId: number,
    productVariantId?: number
  ) => {
    await api.post(`cart/switch`, { userId, productId, productVariantId });
    await refreshCart();
  };

  useEffect(() => {
    refreshFavorites();
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <StoreContext.Provider
      value={{
        favorites: {
          count: favoritesCount,
          items: favoritesItems,
          refreshFavorites,
          addFavourite,
          removeFavourite,
          switchFavorite,
        },
        cart: {
          count: cartItemsCount,
          items: cartItems,
          refreshCart,
          addToCart,
          removeFromCart,
          switchCartItem,
        },
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context)
    throw new Error("useFavourites must be used within a FavouritesProvider");
  return context;
};
