import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/userSlice";
import {
  HomeIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  CurrencyDollarIcon,
  KeyIcon,
  ChartBarIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { PiggyBank, Wallet, LogOut } from "lucide-react";

const Drawer = () => {
  const drawerCheckboxRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLinkClick = () => {
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    handleLinkClick();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="drawer z-50">
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

        <div className="menu p-4 w-80 min-h-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xl">
          <div className="mb-8 px-2">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center"
            >
              <img
                src="./logo-black-transparent.png"
                alt="Logo"
                className="h-16 object-contain"
              />
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Menu Principal
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/")
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <HomeIcon
                      className={`w-5 h-5 mr-3 ${
                        isActive("/")
                          ? "text-indigo-600 dark:text-indigo-400"
                          : ""
                      }`}
                    />
                    Página Inicial
                    {isActive("/") && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/dashboard")
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <ChartBarIcon
                      className={`w-5 h-5 mr-3 ${
                        isActive("/dashboard")
                          ? "text-indigo-600 dark:text-indigo-400"
                          : ""
                      }`}
                    />
                    Dashboard
                    {isActive("/dashboard") && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wallet"
                    onClick={handleLinkClick}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/wallet")
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <Wallet
                      className={`w-5 h-5 mr-3 ${
                        isActive("/wallet")
                          ? "text-indigo-600 dark:text-indigo-400"
                          : ""
                      }`}
                    />
                    Carteira
                    {isActive("/wallet") && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/withdraw"
                    onClick={handleLinkClick}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/withdraw")
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <LogOut
                      className={`w-5 h-5 mr-3 ${
                        isActive("/withdraw")
                          ? "text-indigo-600 dark:text-indigo-400"
                          : ""
                      }`}
                    />
                    Sacar
                    {isActive("/withdraw") && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bank"
                    onClick={handleLinkClick}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/bank")
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <PiggyBank
                      className={`w-5 h-5 mr-3 ${
                        isActive("/bank")
                          ? "text-indigo-600 dark:text-indigo-400"
                          : ""
                      }`}
                    />
                    Bancos
                    {isActive("/bank") && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/configuration"
                    onClick={handleLinkClick}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/configuration")
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <AdjustmentsHorizontalIcon
                      className={`w-5 h-5 mr-3 ${
                        isActive("/configuration")
                          ? "text-indigo-600 dark:text-indigo-400"
                          : ""
                      }`}
                    />
                    Configurações
                    {isActive("/configuration") && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    onClick={handleLinkClick}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/about")
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <InformationCircleIcon
                      className={`w-5 h-5 mr-3 ${
                        isActive("/about")
                          ? "text-indigo-600 dark:text-indigo-400"
                          : ""
                      }`}
                    />
                    Sobre
                    {isActive("/about") && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Conta
              </h3>
              <ul className="space-y-1">
                {user ? (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        onClick={handleLinkClick}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive("/login")
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <KeyIcon
                          className={`w-5 h-5 mr-3 ${
                            isActive("/login")
                              ? "text-indigo-600 dark:text-indigo-400"
                              : ""
                          }`}
                        />
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        onClick={handleLinkClick}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive("/register")
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <UserPlusIcon
                          className={`w-5 h-5 mr-3 ${
                            isActive("/register")
                              ? "text-indigo-600 dark:text-indigo-400"
                              : ""
                          }`}
                        />
                        Registro
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {user && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="px-3 flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold mr-3">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.name || "Usuário"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.email || "email@exemplo.com"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            <p>© 2025 PulsePay</p>
            <p>Versão 2.0.1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
