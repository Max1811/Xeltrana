import { useState } from "react";
import { useStoreContext } from "../../context/storeContext";
import "./order.css";
import api from "../../services/api";

const Order: React.FC = () => {
  const { cart } = useStoreContext();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    country: "",
    city: "",
    street: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const orderPayload = {
      shipping: shippingInfo,
      paymentMethod,
      items: cart.items.map((item) => ({
        productId: item.product.id,
        productVariantId: item.productVariant?.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await api.post("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      console.log(response);
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  const total = cart.items.reduce((sum, item) => {
    const price = item.product?.salePrice ?? item.product?.originalPrice;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="order-page">
      <div className="section">
        <h2 className="section-title">Order Summary</h2>
        <ul className="order-list">
          {cart.items.map((item) => (
            <li key={item.productVariant?.id} className="order-item">
              {item.product.name} × {item.quantity} ={" "}
              {(item.product?.salePrice ?? item.product?.originalPrice) *
                item.quantity}
              $
            </li>
          ))}
        </ul>
        <div className="order-total">Total: {total.toFixed(2)}$</div>
      </div>

      <div className="section">
        <h2 className="section-title">Shipping Information</h2>
        <div className="form-grid">
          <input
            className="input"
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={shippingInfo.fullName}
            onChange={handleInputChange}
          />
          <input
            className="input"
            type="text"
            name="country"
            placeholder="Country"
            value={shippingInfo.country}
            onChange={handleInputChange}
          />
          <input
            className="input"
            type="text"
            name="city"
            placeholder="City"
            value={shippingInfo.city}
            onChange={handleInputChange}
          />
          <input
            className="input"
            type="text"
            name="street"
            placeholder="Street"
            value={shippingInfo.street}
            onChange={handleInputChange}
          />
          <input
            className="input"
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={shippingInfo.postalCode}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Payment Method</h2>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={paymentMethod === "credit_card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit Card
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="paymentMethod"
              value="liqpay"
              checked={paymentMethod === "liqpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            LiqPay
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={paymentMethod === "cash_on_delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
        </div>
      </div>

      <div className="submit-container">
        <button onClick={handleSubmit} className="submit-button">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Order;
