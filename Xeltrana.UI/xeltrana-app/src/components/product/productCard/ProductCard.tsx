import React, { useEffect, useState } from "react";
import "./productCard.css";
import { Audience } from "../models/products.model";
import { useStoreContext } from "../../../context/storeContext";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  audienceId: number;
  images: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  audienceId,
  images,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { favorites } = useStoreContext();

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const isFav = favorites.items.some((item) => item.product.id === id);
    console.log(isFav);
    setLiked(isFav);
  }, [favorites.items, id]);

  const toggleLike = async () => {
    await favorites.switchFavorite(id);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  console.log(audienceId);

  return (
    <div className="product-card">
      {/* Image Carousel */}
      <div className="product-images">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentIndex]}
              alt={`${name} - ${currentIndex + 1}`}
              className="product-image"
            />
            {images.length > 1 && (
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
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-price">${price.toFixed(2)}</div>

        <div className="product-tags">
          {(audienceId === Audience.Men || audienceId === Audience.Unisex) && (
            <span className="tag-men">For Men</span>
          )}
          {(audienceId === Audience.Women ||
            audienceId === Audience.Unisex) && (
            <span className="tag-women">For Women</span>
          )}
        </div>
        <i
          className={`fas fa-heart like-button ${liked ? "liked" : ""}`}
          onClick={toggleLike}
        />
      </div>
    </div>
  );
};

export default ProductCard;
