import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./productListModal.css";
import api from "../../../../services/api";
import { ViewProduct } from "../../../../types/types";

interface Props {
  onClose: () => void;
}

export default function ProductListModal({ onClose }: Props) {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<ViewProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ViewProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await api.get<ViewProduct[]>("/products");
      setAllProducts(result.data);
      setFilteredProducts(result.data);
    };
    fetchProducts();
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/products/edit-product/${productId}`);
    onClose();
  };

  const filterProducts = (e: ChangeEvent<HTMLInputElement>) => {
    const filter = e.target.value.toLowerCase();
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(filter) ||
        p.id.toString().includes(filter)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Select a product to edit</h4>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <input
          id="filter-input"
          type="text"
          placeholder="Enter product name or ID"
          onChange={filterProducts}
          className="filter-products"
        />
        <ul className="modal-product-list">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="modal-product-item"
              onClick={() => handleProductClick(product.id)}
            >
              <span>
                <img src={product.images[0]} alt="img" />
              </span>
              <span>{product.name}</span>
              <span>product Id: {product.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
