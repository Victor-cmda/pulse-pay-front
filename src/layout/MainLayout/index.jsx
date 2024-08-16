import React from "react";
import { Navbar, Drawer } from "../../layout";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";
  const isRegisterRoute = location.pathname === "/register";
  return (
    <div>
      {!isLoginRoute && !isRegisterRoute && <Navbar />}
      {!isLoginRoute && !isRegisterRoute && <Drawer />}
      <div>{children}</div>
    </div>
  );
};

export default MainLayout;
