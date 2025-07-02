import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/signup" || location.pathname === "/login" || location.pathname ==="/forgetpass";

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthPage && <Header />}
      <div className="flex">
        {!isAuthPage && <Sidebar />}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
