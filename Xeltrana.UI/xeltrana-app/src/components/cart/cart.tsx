import { useState, useEffect } from "react";
import { useStoreContext } from "../../context/storeContext";
import api from "../../services/api";
import CartLine from "./cartLine";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "../react-custom-components/banners/errorBanner";

const Cart: React.FC = () => {
  const { cart } = useStoreContext();
  const navigate = useNavigate();
  const [localCartItems, setLocalCartItems] = useState(cart.items);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLocalCartItems(cart.items);
  }, [cart.items]);

  const handleRemove = async (productId: number, productVariantId?: number) => {
    await cart.removeFromCart(productId, productVariantId);
  };

  const updateQuantityInBackend = async (
    productVariantId: number,
    newQty: number
  ) => {
    await api.put(`/cart/${productVariantId}/quantity`, { quantity: newQty });

    setLocalCartItems((prevItems: any) => {
      const updated = prevItems.map((item: any) =>
        item.productVariant?.id === productVariantId && item.quantity !== newQty
          ? { ...item, quantity: newQty }
          : item
      );

      // Only update state if changed to prevent unnecessary re-renders
      if (JSON.stringify(updated) !== JSON.stringify(prevItems)) {
        return updated;
      }
      return prevItems;
    });
  };

  const updateTotalCount = () => {
    return localCartItems.reduce((sum: number, item: any) => {
      const price = item?.product?.salePrice ?? item?.product?.originalPrice;
      return sum + price * item.quantity;
    }, 0);
  };

  const handleCreateOrder = () => {
    if (cart.items.some((c) => !c?.productVariant?.id)) {
      setErrorMessage("Please specify all products information");
    } else {
      navigate("/order");
    }
  };

  return (
    <>
      <ErrorBanner
        message={errorMessage}
        visible={!!errorMessage}
        onClose={() => setErrorMessage("")}
      />
      <div className="cart-page">
        <h2>Cart Items</h2>
        {localCartItems.length === 0 ? (
          <p>No cart items yet.</p>
        ) : (
          localCartItems.map((item: any) => (
            <CartLine
              key={item.productVariant?.id}
              cartItemId={item.id}
              product={item.product}
              productVariant={item?.productVariant}
              quantity={item?.quantity}
              maxAvailableQuantity={item?.productVariant?.stockQuantity}
              onRemove={handleRemove}
              onQuantityChange={updateQuantityInBackend}
            />
          ))
        )}
        <div className="cart-total-container">
          <h3>Total:</h3>
          <p>{updateTotalCount().toFixed(2)}$</p>
        </div>
        <div className="cart-order-now-container">
          <button className="order-now" onClick={handleCreateOrder}>
            Order Now
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
