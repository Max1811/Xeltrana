import React from "react";
import "./favorites.css";
import { useStoreContext } from "../../context/storeContext";
import FavoriteLine from "./favouriteLine";

const Favorites: React.FC = () => {
  const { favorites } = useStoreContext();

  const handleRemove = async (productId: number) => {
    await favorites.removeFavourite(productId);
  };

  return (
    <div className="favorites-page">
      <h2>My Favorites</h2>
      {favorites.items.length === 0 ? (
        <p>No favorite products yet.</p>
      ) : (
        favorites.items.map((item) => (
          <FavoriteLine
            key={item.product.id}
            product={item.product}
            onRemove={handleRemove}
          />
        ))
      )}
    </div>
  );
};

export default Favorites;
