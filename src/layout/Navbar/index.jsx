import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/userSlice";
import {
  Search,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  UserCircle,
  Shield,
} from "lucide-react";
import ThemeToggle from "../../theme/ThemeToggle";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin } = useSelector((state) => state.user);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Pagamento recebido",
      message: "Você recebeu um pagamento de R$ 150,00",
      time: "2 horas atrás",
      read: false,
    },
    {
      id: 2,
      title: "Novo login detectado",
      message: "Um novo acesso foi detectado em seu dispositivo",
      time: "1 dia atrás",
      read: true,
    },
    {
      id: 3,
      title: "Promoção exclusiva",
      message: "Aproveite taxas reduzidas até o final do mês",
      time: "3 dias atrás",
      read: true,
    },
  ]);

  // Número de notificações não lidas
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fecha o dropdown de notificações quando clica fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notification-dropdown")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Marca uma notificação como lida
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Marca todas notificações como lidas
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Gerar iniciais do usuário para o avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";

    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="navbar bg-white dark:bg-slate-800 sticky top-0 z-40 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="navbar-start">
        {user ? (
          <label
            htmlFor="my-drawer"
            className="btn btn-ghost btn-circle drawer-button hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-slate-700 dark:text-slate-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
        ) : null}
      </div>

      <div className="navbar-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="./logo-black-icon.png" alt="Logo" className="h-10" />
          <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">
            PulsePay
          </span>
        </Link>
      </div>

      <div className="navbar-end">
        {/* Links visíveis apenas em telas maiores */}
        {user ? (
          <div className="hidden md:flex items-center space-x-1 mr-2">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/wallet"
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Carteira
            </Link>
          </div>
        ) : null}

        <div className="flex items-center">
          {/* Componente de alternância de tema */}
          <ThemeToggle />

          {/* Botão de notificações com dropdown */}
          {user ? (
            <div className="relative notification-dropdown">
              <button
                className="btn btn-ghost btn-circle relative hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                )}
              </button>

              {/* Dropdown de notificações */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-slate-200 dark:border-slate-700">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Notificações
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        Marcar todas como lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="py-1">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${
                              !notification.read
                                ? "bg-indigo-50 dark:bg-indigo-900/20"
                                : ""
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-slate-800 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {notification.time}
                              </p>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <div className="mt-1 flex justify-end">
                                <span className="inline-block h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Nenhuma notificação disponível
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                    <Link
                      to="/notifications"
                      className="block text-center w-full py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md"
                    >
                      Ver todas as notificações
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar ml-1"
            >
              {user && user.avatar ? (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={user.avatar} alt="Avatar" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-medium">
                  {getUserInitials()}
                </div>
              )}
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-white dark:bg-slate-800 rounded-box w-52 border border-slate-200 dark:border-slate-700"
            >
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                      {user.name || "Usuário"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email || "email@exemplo.com"}
                    </p>
                  </div>
                  <li>
                    <Link
                      to="/configuration"
                      className="flex items-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 py-2"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 py-2"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="flex items-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 py-2"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Painel de Administração
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Registro
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
