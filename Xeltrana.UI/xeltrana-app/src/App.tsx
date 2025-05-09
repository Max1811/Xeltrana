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

const App = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products/create-product" element={<CreateProduct />} />
            <Route path="products" element={<Products />} />
            <Route path="settings" element={<Settings />} />
            {/* other protected routes */}
          </Route>
        </Route>
      </Routes>
    </Router>
  </Provider>
);

export default App;
