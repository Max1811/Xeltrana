import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import "./cart.css";
import { ViewProduct, ViewProductVariant } from "../../types/types";
import api from "../../services/api";
import VariantSelector from "./cartItemVariantSelector";

interface CartLineProps {
  product: ViewProduct;
  cartItemId: number;
  productVariant: ViewProductVariant;
  quantity: number;
  maxAvailableQuantity: number;
  onRemove: (productId: number, productVariantId?: number) => void;
  onQuantityChange: (
    productVariantId: number,
    newQuantity: number
  ) => Promise<void>;
}

const CartLine: React.FC<CartLineProps> = ({
  product,
  cartItemId,
  productVariant,
  quantity,
  maxAvailableQuantity,
  onRemove,
  onQuantityChange,
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [productVariantData, setProductVariantData] = useState<
    ViewProductVariant[] | null
  >(null);
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((newQty: number) => {
      if (productVariant?.id) {
        onQuantityChange(productVariant.id, newQty);
      }
    }, 500),
    [productVariant?.id, onQuantityChange]
  );

  useEffect(() => {
    const fetchProductVariant = async () => {
      const result = await api.get<ViewProductVariant[]>(
        `/products/product-variant/${product.id}`
      );
      setProductVariantData(result.data);
      console.log(result.data);
    };

    fetchProductVariant();
  }, [product.id, productVariant]);

  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  useEffect(() => {
    debouncedUpdate(localQuantity);
    return debouncedUpdate.cancel;
  }, [localQuantity, debouncedUpdate]);

  const handleQuantityChange = (delta: number) => {
    if (
      localQuantity + delta <= maxAvailableQuantity ||
      (delta < 0 && localQuantity + delta > 0)
    ) {
      setLocalQuantity((prev) => Math.max(prev + delta, 1));
    }
  };

  const toggleEditMode = () => {
    setIsEditModeEnabled((prev) => !prev);
  };

  return (
    <div className="cart-line">
      {productVariant && (
        <i className="fas fa-pen edit-icon" onClick={toggleEditMode}></i>
      )}
      <img src={product.images[0]} alt={product.name} className="cart-image" />

      <div className="cart-info">
        <div className="cart-product-variant-info">
          <h4 className="cart-product-name">{product.name}</h4>

          {productVariant && !isEditModeEnabled ? (
            <div className="cart-variant-info">
              <span className="cart-size">{productVariant?.size}</span>
              <div
                className="product-variant-color"
                style={{ backgroundColor: productVariant?.hexCode }}
                title={productVariant?.color}
              ></div>
            </div>
          ) : (
            <VariantSelector
              variants={productVariantData}
              cartItemId={cartItemId}
              selectedProductVariantId={productVariant?.id}
            />
          )}

          <strong className="cart-price">
            ${product.originalPrice.toFixed(2)}
          </strong>
        </div>

        <div className="cart-secondary-data">
          <div className="cart-quantity-data">
            <button
              className="quantity-button"
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span>{localQuantity}</span>
            <button
              className="quantity-button"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>

          <button
            className="remove-cart-button"
            onClick={() => onRemove(product.id, productVariant?.id)}
            title="Remove from cart"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartLine;
