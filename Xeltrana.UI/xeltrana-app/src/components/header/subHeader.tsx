import { Link } from "react-router-dom";
import "./header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useStoreContext } from "../../context/storeContext";

const SubHeader = () => {
  const { favorites, cart } = useStoreContext();

  return (
    <header className="sub-header">
      <nav className="nav">
        <Link to="/products">Products</Link>
      </nav>
      <nav className="nav">
        <Link to="/products/sales">Sales</Link>
      </nav>
      <nav className="nav">
        <Link to="/products?audience=1">For Men</Link>
      </nav>
      <nav className="nav">
        <Link to="/products?audience=2">For Women</Link>
      </nav>
      <nav className="nav">
        <Link to="/products/categories">Categories</Link>
      </nav>
      <nav>
        <Link to="/favorites">
          <div className="icon-container">
            <i className="fas fa-heart custom-heart"></i>
            <span className="heart-count">{favorites.count}</span>
          </div>
        </Link>
      </nav>
      <nav>
        <Link to="/cart">
          <div className="icon-container">
            <i className="fas fa-basket-shopping custom-shopping-cart"></i>
            <span className="cart-count">{cart.count}</span>
          </div>
        </Link>
      </nav>
    </header>
  );
};

export default SubHeader;
