import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface FavouritesContextProps {
  count: number;
  items: any[];
  refresh: () => void;
  addFavourite: (productId: number) => Promise<void>;
  removeFavourite: (productId: number) => Promise<void>;
  switchFavorite: (productId: number) => Promise<void>;
}

interface StoreProps {
  favorites: FavouritesContextProps;
}

const StoreContext = createContext<StoreProps | undefined>(undefined);

export const StoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<any[]>([]);

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const refresh = async () => {
    if (userId) {
      const [countRes, itemsRes] = await Promise.all([
        api.get(`/favorites/count?userId=${userId}`),
        api.get(`/favorites?userId=${userId}`),
      ]);

      setCount(countRes.data as number);
      setItems(itemsRes.data as any[]);
    }
  };

  const addFavourite = async (productId: number) => {
    await api.post(`/favorites`, { userId, productId });
    await refresh();
  };

  const removeFavourite = async (productId: number) => {
    await api.delete(`/favorites/${productId}`, { userId } as any);
    await refresh();
  };

  const switchFavorite = async (productId: number) => {
    await api.post(`/favorites/switch`, { userId, productId });
    await refresh();
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <StoreContext.Provider
      value={{
        favorites: {
          count,
          items,
          refresh,
          addFavourite,
          removeFavourite,
          switchFavorite,
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
