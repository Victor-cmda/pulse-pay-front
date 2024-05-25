import React from "react";
import {Navbar, Drawer} from "../../layout";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Drawer />
      <div >{children}</div>
    </div>
  );
};

export default MainLayout;
