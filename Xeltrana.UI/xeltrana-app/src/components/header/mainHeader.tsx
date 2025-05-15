import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const MainHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateToSettings = (event: any) => {
    navigate("/settings");
  };

  const logOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/dashboard">Home</Link>
        </nav>
        <div className="logo">
          <Link to="/dashboard">
            <img src="/images/Xeltrana.jpg" alt="logo"></img>
          </Link>
        </div>
        <div className="icons">
          <i
            className="fas fa-right-from-bracket"
            title="Logout"
            onClick={logOut}
          ></i>
          <i
            className="fas fa-gear settings"
            title="Settings"
            onClick={navigateToSettings}
          ></i>
        </div>
      </header>
    </>
  );
};

export default MainHeader;
