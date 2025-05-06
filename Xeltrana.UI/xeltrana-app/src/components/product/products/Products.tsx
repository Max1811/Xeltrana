import React, { useState, useEffect } from "react";
import ProductCard from "../productCard/ProductCard";
import "./products.css";
import api from "../../../services/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isForMen: boolean;
  isForWomen: boolean;
  images: string[];
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products");
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="products-container">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            isForMen={product.isForMen}
            isForWomen={product.isForWomen}
            images={product.images}
          />
        ))
      ) : (
        <div>No products available</div>
      )}
    </div>
  );
};

export default Products;
