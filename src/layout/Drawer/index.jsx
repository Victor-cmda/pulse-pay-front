import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  CurrencyDollarIcon,
  KeyIcon,
  ChartBarIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";

const Drawer = () => {
  const drawerCheckboxRef = useRef(null);

  const handleLinkClick = () => {
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false;
    }
  };

  return (
    <div className="drawer sticky top-0 z-50">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerCheckboxRef}
      />
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <h2 className="text-2xl font-bold mb-4">
            <img
              src="./logo-black-transparent.png"
              alt="Logo"
              style={{ height: "100px" }}
            />{" "}
          </h2>
          <ul>
            <li>
              <Link to="/" onClick={handleLinkClick}>
                <HomeIcon className="size-5" />
                Página Inicial
              </Link>
            </li>
            <li>
              <Link to="/configuration" onClick={handleLinkClick}>
                <AdjustmentsHorizontalIcon className="size-5" />
                Configurações
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={handleLinkClick}>
                <ChartBarIcon className="size-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/history" onClick={handleLinkClick}>
                <ListBulletIcon className="size-5" />
                Histórico de Transações
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={handleLinkClick}>
                <KeyIcon className="size-5" />
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={handleLinkClick}>
                <KeyIcon className="size-5" />
                Registro
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
