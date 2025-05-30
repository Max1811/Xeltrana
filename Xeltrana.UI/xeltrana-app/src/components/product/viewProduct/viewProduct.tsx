import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./viewProduct.css";
import api from "../../../services/api";
import { ViewProduct } from "../../../types/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useStoreContext } from "../../../context/storeContext";

const ViewProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { favorites, cart } = useStoreContext();

  const [product, setProduct] = useState<ViewProduct | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const result = await api.get<ViewProduct>(`/products/${id}`);
        setProduct(result.data);
        const isFavoriteResult = await api.get<boolean>(
          `/favorites/isFavorite/${id}`
        );
        setIsFavorite(isFavoriteResult.data);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const colors = Array.from(
    new Map(product.productVariants.map((v) => [v.colorId, v])).values()
  );

  const sizes =
    selectedColorId !== null
      ? product.productVariants.filter((v) => v.colorId === selectedColorId)
      : [];

  const toggleLike = async () => {
    console.log("toggled");
    await favorites.switchFavorite(product.id);
    setIsFavorite((prev) => !prev);
  };

  const handleAddToCart = async () => {
    const selectedVariant = product.productVariants.find(
      (v) => v.colorId === selectedColorId && v.sizeId === selectedSizeId
    );

    await cart.addToCart(product.id, selectedVariant?.id);
  };

  return (
    <div className="view-product">
      <div className="product-images">
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="product-swiper"
        >
          {product.images.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <img src={imgUrl} alt={`Product ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="product-details">
        <h1>{product.name}</h1>
        <div className="price">
          {product.salePrice && product.salePrice < product.originalPrice ? (
            <>
              <span className="original-price">
                ${product.originalPrice?.toFixed(2)}
              </span>
              <span className="sale-price">
                ${product.salePrice?.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="sale-price">
              ${product.originalPrice?.toFixed(2)}
            </span>
          )}
        </div>
        {product.description && (
          <div className="product-description">
            <h2>About this product:</h2>
            <p>{product.description}</p>
          </div>
        )}

        <div className="selectors">
          <div className="color-options">
            <label>Color:</label>
            <div className="colors">
              {colors.map((variant) => (
                <button
                  key={variant.colorId}
                  className={`color-btn ${
                    selectedColorId === variant.colorId ? "selected" : ""
                  }`}
                  style={{ backgroundColor: variant.hexCode }}
                  onClick={() => {
                    setSelectedColorId(variant.colorId);
                    setSelectedSizeId(null);
                  }}
                />
              ))}
            </div>
          </div>

          {selectedColorId !== null && (
            <div className="size-options">
              <label>Size:</label>
              <div className="sizes">
                {sizes.map((variant) => (
                  <button
                    key={variant.sizeId}
                    className={`size-btn ${
                      selectedSizeId === variant.sizeId ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSizeId(variant.sizeId)}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className={`product-interaction-button add-to-favorites-button ${
            isFavorite ? "add-to-favorites-button-clicked" : ""
          }`}
          aria-label="Add to Favorites"
          onClick={toggleLike}
        >
          <i
            className={`fas fa-heart like-button ${isFavorite ? "liked" : ""}`}
          ></i>
        </button>
        <button
          className="product-interaction-button add-to-cart-button"
          onClick={handleAddToCart}
          disabled={selectedColorId === null || selectedSizeId === null}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ViewProductPage;
