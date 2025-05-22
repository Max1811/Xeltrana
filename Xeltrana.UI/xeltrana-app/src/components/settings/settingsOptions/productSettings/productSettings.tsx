import { useNavigate } from "react-router-dom";
import "./productSettings.css";
import { useState } from "react";
import ProductListModal from "./productListModal";

export default function ProductSettings() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCreate = () => {
    navigate("/products/create-product");
  };

  return (
    <div>
      <h3>Product Settings</h3>
      <button onClick={handleCreate} className="product-btn create-btn">
        + Create New Product
      </button>

      <button onClick={() => setShowModal(true)} className="product-btn">
        Edit Product
      </button>

      {showModal && <ProductListModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
