import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./components/auth/login";
import Dashboard from "./components/dashboard/dashboard";
import ProtectedRoute from "./components/protectedRoute";
import Register from "./components/auth/register";
import Layout from "./components/header/layout";
import Settings from "./components/settings/settings";
import "./styles/variables.css";
import CreateProduct from "./components/product/createProduct";
import Products from "./components/product/products/Products";
import { StoreProvider } from "./context/storeContext";
import Favorites from "./components/favorites/favourites";
import ViewProductPage from "./components/product/viewProduct/viewProduct";

const App = () => (
  <Provider store={store}>
    <StoreProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="products/create-product"
                element={<CreateProduct />}
              />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ViewProductPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="favorites" element={<Favorites />} />
              {/* other protected routes */}
            </Route>
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  </Provider>
);

export default App;
