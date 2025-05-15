import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./viewProduct.css";
import api from "../../../services/api";
import { Product } from "../../../types/types";

const getAudienceLabel = (id: number) => {
  switch (id) {
    case 0:
      return "Men";
    case 1:
      return "Women";
    default:
      return "Unisex";
  }
};

const ViewProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data as any);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="view-product-container">
      <div className="product-card">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image"
        />
        <div className="product-details">
          <h2>{product.name}</h2>
          <p className="product-category">
            Category: <strong>{product.categoryName}</strong>
          </p>
          <p className="product-audience">
            Audience: <strong>{getAudienceLabel(product.audienceId)}</strong>
          </p>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.originalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
