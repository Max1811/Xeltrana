import React from "react";
import Slider from "react-slick";
import "./carousel.css";
import { ViewProduct } from "../../../types/types";
import ProductCard from "../../product/productCard/ProductCard";

interface CarouselProps {
  items: ViewProduct[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="products-carousel-container">
      {items.length > 0 ? (
        <Slider {...settings}>
          {items.map((product) => (
            <div key={product.id} className="carousel-slide">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      ) : (
        <div>No products available</div>
      )}
    </div>
  );
};

export default Carousel;
