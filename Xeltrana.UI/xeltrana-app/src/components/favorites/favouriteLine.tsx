// components/FavoriteLine.tsx
import React from "react";
import "./favorites.css";

interface FavoriteLineProps {
  product: any;
  onRemove: (productId: number) => void;
}

const FavoriteLine: React.FC<FavoriteLineProps> = ({ product, onRemove }) => {
  console.log(product);
  return (
    <div className="favorite-line">
      <img
        src={product.images[0]}
        alt={product.name}
        className="favorite-image"
      />
      <div className="favorite-info">
        <h4>{product.name}</h4>
        <p>{product.description}</p>
        <strong>${product.price.toFixed(2)}</strong>
      </div>
      <button
        className="remove-favorite-button"
        onClick={() => onRemove(product.id)}
        title="Remove from favorites"
      >
        <i className="fas fa-times" />
      </button>
    </div>
  );
};

export default FavoriteLine;
