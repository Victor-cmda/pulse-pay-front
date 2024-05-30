import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  CurrencyDollarIcon,
  KeyIcon
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
      <div className="drawer-content">
        {/* Content that will be covered by the drawer */}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <ul>
            <li>
              <Link to="/" onClick={handleLinkClick}>
                <HomeIcon className="size-5" />
                Página Inicial
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={handleLinkClick}>
                <InformationCircleIcon className="size-5" />
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/gerar-pix" onClick={handleLinkClick}>
                <CurrencyDollarIcon className="size-5"/>
                Gerar Pix
              </Link>
            </li>
            <li>
              <Link to="/configuration" onClick={handleLinkClick}>
                <AdjustmentsHorizontalIcon className="size-5"/>
                Configurações
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={handleLinkClick}>
                <KeyIcon className="size-5"/>
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
