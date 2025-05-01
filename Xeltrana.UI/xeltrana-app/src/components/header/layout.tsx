import Header from "./header";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

export default Layout;
