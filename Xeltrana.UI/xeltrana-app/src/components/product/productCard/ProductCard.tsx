import React, { useEffect, useState } from "react";
import "./productCard.css";
import { Audience } from "../models/products.model";
import { useStoreContext } from "../../../context/storeContext";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../types/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const { favorites } = useStoreContext();

  useEffect(() => {
    const isFav = favorites.items.some(
      (item) => item.product.id === product.id
    );
    setLiked(isFav);
  }, [favorites.items, product.id]);

  const toggleLike = async () => {
    await favorites.switchFavorite(product.id);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="product-card">
      {/* Image Carousel */}
      <div
        className="product-card-clickable"
        onClick={() => {
          navigate(`/products/${product.id}`);
        }}
      >
        <div className="product-images">
          {product.images?.length > 0 ? (
            <>
              <img
                src={product.images[currentIndex]}
                alt={`${product.name} - ${currentIndex + 1}`}
                className="product-image"
              />
              {product.images?.length > 1 && (
                <div className="carousel-controls">
                  <button className="arrow left" onClick={goToPrev}>
                    &#10094;
                  </button>
                  <button className="arrow right" onClick={goToNext}>
                    &#10095;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">
            ${product.originalPrice?.toFixed(2)}
          </div>

          <div className="product-tags">
            {(product.audienceId === Audience.Men ||
              product.audienceId === Audience.Unisex) && (
              <span className="tag-men">For Men</span>
            )}
            {(product.audienceId === Audience.Women ||
              product.audienceId === Audience.Unisex) && (
              <span className="tag-women">For Women</span>
            )}
          </div>
        </div>
      </div>
      <i
        className={`fas fa-heart like-button ${liked ? "liked" : ""}`}
        onClick={toggleLike}
      />
    </div>
  );
};

export default ProductCard;
