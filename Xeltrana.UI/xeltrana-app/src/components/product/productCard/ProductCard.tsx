import React, { useEffect, useState } from "react";
import "./productCard.css";
import { useStoreContext } from "../../../context/storeContext";
import { useNavigate } from "react-router-dom";
import { ViewProduct } from "../../../types/types";

interface ProductCardProps {
  product: ViewProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const uniqueColorsMap = new Map(
    product.productVariants
      .filter((variant) => variant.color) // Ensure color exists
      .map((variant) => [variant.hexCode, variant.color])
  );
  const uniqueColors = Array.from(uniqueColorsMap.values());

  const [currentIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const { favorites } = useStoreContext();

  useEffect(() => {
    const isFav = favorites.items.some(
      (item) => item.product.id === product.id
    );
    setLiked(isFav);
  }, [favorites.items, product.id]);

  const toggleLike = async () => {
    console.log(liked);
    await favorites.switchFavorite(product.id);
  };

  return (
    <div className="product-card-container">
      <div className="product-card">
        <div className="product-card-clickable">
          <div
            className="product-images"
            onClick={() => {
              navigate(`/products/${product.id}`);
            }}
          >
            {product.images?.length > 0 ? (
              <>
                <img
                  src={product.images[currentIndex]}
                  alt={`${product.name} - ${currentIndex + 1}`}
                  className="product-image"
                />
              </>
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          <div className="product-info">
            <div className="product-name-and-price-container">
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">
                ${product.originalPrice?.toFixed(2)}
              </div>
            </div>
            <p className="product-description">{product.description}</p>

            <div className="product-available-colors">
              <p>Colors: </p>
              {uniqueColors.length > 0 &&
                uniqueColors.map((variant) => (
                  <div
                    className="product-variant-color"
                    style={{
                      backgroundColor: variant,
                    }}
                  ></div>
                ))}
            </div>
          </div>
          <div className="product-card-footer">
            <button
              className="btn-icon like-button"
              aria-label="Add to Favorites"
            >
              <i
                className={`fas fa-heart like-button ${liked ? "liked" : ""}`}
                onClick={toggleLike}
              ></i>
            </button>

            <button className="btn-add-to-cart">
              <i className="fas fa-shopping-cart"></i>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
