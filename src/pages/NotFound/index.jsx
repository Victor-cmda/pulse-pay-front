import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography, ConfigProvider, theme } from "antd";
import {
  HomeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

const { Title, Text, Paragraph } = Typography;

const NotFound = () => {
  const [countdown, setCountdown] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    // Verifica se há uma preferência salva no localStorage
    const savedTheme = localStorage.getItem("theme");
    // Verifica a preferência do sistema se não houver tema salvo
    if (!savedTheme) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return savedTheme === "dark";
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate("/");
    }
  }, [countdown, navigate]);

  useEffect(() => {
    // Aplica a classe de tema ao documento
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    // Salva a preferência no localStorage
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    // Aplica a classe para o Tailwind
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const suggestedLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Configurações", path: "/configuration" },
    { name: "Produtos", path: "/produtos" },
    { name: "Suporte", path: "/suporte" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Buscando por: ${searchQuery}`);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#3b82f6", // blue-500
        },
      }}
    >
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-4 ${
          darkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-800"
            : "bg-gradient-to-b from-blue-50 to-white"
        }`}
      >
        {/* Toggle de tema */}
        <button
          onClick={toggleDarkMode}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            darkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } shadow-md transition-colors`}
          aria-label={
            darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"
          }
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>

        <div
          className={`max-w-3xl w-full mx-auto rounded-xl shadow-lg overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-600 text-white p-8 flex flex-col items-center justify-center md:w-2/5">
              <ExclamationTriangleIcon className="w-24 h-24 mb-4 animate-pulse" />
              <div className="text-center">
                <Title
                  level={1}
                  style={{
                    color: "white",
                    fontSize: "5rem",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  404
                </Title>
                <Text style={{ color: "white", fontSize: "1.25rem" }}>
                  Página não encontrada
                </Text>
              </div>
            </div>

            <div className={`p-8 md:w-3/5 ${darkMode ? "text-gray-200" : ""}`}>
              <Title
                level={2}
                style={{ color: darkMode ? "white" : undefined }}
              >
                Oops! Você se perdeu?
              </Title>

              <Paragraph
                className={`mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                A página que você está tentando acessar não existe ou foi
                movida. Verifique se a URL está correta ou utilize uma das
                opções abaixo.
              </Paragraph>

              <div className="space-y-4 mb-6">
                <Link to="/">
                  <Button
                    type="primary"
                    size="large"
                    className="flex items-center"
                    style={{
                      width: "100%",
                      height: "auto",
                      padding: "10px 16px",
                    }}
                    icon={<HomeIcon className="w-5 h-5 mr-2" />}
                  >
                    Ir para a página inicial
                  </Button>
                </Link>

                <Button
                  type="default"
                  onClick={() => window.history.back()}
                  className="flex items-center"
                  style={{
                    width: "100%",
                    height: "auto",
                    padding: "10px 16px",
                  }}
                  icon={<ChevronLeftIcon className="w-5 h-5 mr-2" />}
                >
                  Voltar à página anterior
                </Button>

                <Button
                  onClick={() => window.location.reload()}
                  className="flex items-center"
                  style={{
                    width: "100%",
                    height: "auto",
                    padding: "10px 16px",
                  }}
                  icon={<ArrowPathIcon className="w-5 h-5 mr-2" />}
                >
                  Tentar novamente
                </Button>
              </div>

              <div
                className={`mb-6 p-4 rounded-lg ${
                  darkMode ? "bg-blue-900/30" : "bg-blue-50"
                }`}
              >
                <Text style={{ color: darkMode ? "#e5e7eb" : undefined }}>
                  Redirecionamento automático para a página inicial em{" "}
                  <strong>{countdown}</strong> segundos.
                </Text>
              </div>

              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Buscar no site..."
                    className={`border rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white"
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg flex items-center"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                </form>
              </div>

              <div>
                <Text strong style={{ color: darkMode ? "white" : undefined }}>
                  Ou visite uma destas páginas populares:
                </Text>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {suggestedLinks.map((link, index) => (
                    <Link key={index} to={link.path}>
                      <div
                        className={`border rounded p-2 text-center transition-colors ${
                          darkMode
                            ? "border-gray-700 hover:bg-gray-700"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <span className={darkMode ? "text-gray-200" : ""}>
                          {link.name}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div
            className={`border-t p-4 flex justify-between items-center ${
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <QuestionMarkCircleIcon
                className={`w-5 h-5 mr-2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <Text className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Precisa de ajuda?
              </Text>
            </div>
            <Link to="/contato">
              <Button type="link">Contate o suporte</Button>
            </Link>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default NotFound;
