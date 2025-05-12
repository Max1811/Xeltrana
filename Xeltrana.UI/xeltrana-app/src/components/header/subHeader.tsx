import { Link } from "react-router-dom";
import "./header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const SubHeader = () => {
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
    </header>
  );
};

export default SubHeader;
