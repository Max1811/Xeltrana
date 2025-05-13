import React, { useState, useEffect } from "react";
import ProductCard from "../productCard/ProductCard";
import "./products.css";
import api from "../../../services/api";
import { useSearchParams } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  audienceId: number;
  images: string[];
}

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const audience = searchParams.get("audience");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/products";

        if (audience) {
          url = url.concat(`?audience=${audience}`);
        }

        const response = await api.get<Product[]>(url);
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [audience]);

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
            audienceId={product.audienceId}
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
