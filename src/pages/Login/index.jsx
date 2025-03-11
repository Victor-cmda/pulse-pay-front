import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/userSlice";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import ThemeToggle from "../../theme/ThemeToggle";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  // Estado para controlar animações
  const [showPage, setShowPage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    // Sequência de animações ao carregar
    setShowPage(true);

    const formTimer = setTimeout(() => {
      setShowForm(true);
    }, 300);

    const featuresTimer = setTimeout(() => {
      setShowFeatures(true);
    }, 600);

    return () => {
      clearTimeout(formTimer);
      clearTimeout(featuresTimer);
    };
  }, []);

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateForm = () => {
    setIsFormValid(email.includes("@") && password.length > 0);
  };

  const handleBack = () => {
    // Animar a saída antes de navegar
    setShowPage(false);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      await dispatch(loginUser({ email, password })).unwrap();
      setShowPage(false);
      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (err) {
      console.error("Login failed:", err);
      setResponse(
        err.message || "Falha na autenticação. Verifique suas credenciais."
      );
      const form = document.getElementById("login-form");
      form.classList.add("animate-shake");
      setTimeout(() => {
        form.classList.remove("animate-shake");
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = (input) => {
    setActiveInput(input);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  // Esta função não é mais necessária com o novo fundo SVG

  return (
    <div
      className={`min-h-screen bg-base-200 flex flex-col overflow-hidden relative transition-opacity duration-500 ease-in-out ${
        showPage ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Fundo com SVG Animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 w-full h-full">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="gradientLight"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.1"
                />
              </linearGradient>
              <linearGradient
                id="gradientDark"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.2"
                />
              </linearGradient>

              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ondas de fundo - coloridas via CSS para compatibilidade com tema */}
            <g className="waves text-primary">
              <path
                d="M0,50 C150,120 350,0 500,60 C650,120 750,75 800,110 L800,600 L0,600 Z"
                className="fill-current opacity-10 dark:opacity-20"
              >
                <animate
                  attributeName="d"
                  values="M0,50 C150,120 350,0 500,60 C650,120 750,75 800,110 L800,600 L0,600 Z;
                          M0,70 C150,40 350,80 500,40 C650,20 750,95 800,70 L800,600 L0,600 Z;
                          M0,50 C150,120 350,0 500,60 C650,120 750,75 800,110 L800,600 L0,600 Z"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </path>

              <path
                d="M0,100 C200,150 300,50 500,100 C700,150 750,100 800,150 L800,600 L0,600 Z"
                className="fill-current opacity-5 dark:opacity-10"
              >
                <animate
                  attributeName="d"
                  values="M0,100 C200,150 300,50 500,100 C700,150 750,100 800,150 L800,600 L0,600 Z;
                          M0,120 C200,80 300,130 500,80 C700,120 750,150 800,120 L800,600 L0,600 Z;
                          M0,100 C200,150 300,50 500,100 C700,150 750,100 800,150 L800,600 L0,600 Z"
                  dur="15s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* Partículas flutuantes */}
            <g className="particles text-primary">
              {/* Partícula 1 */}
              <circle
                cx="150"
                cy="150"
                r="2"
                className="fill-current opacity-30 dark:opacity-50"
              >
                <animate
                  attributeName="cy"
                  values="150;120;150"
                  dur="4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.7;0.3"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Partícula 2 */}
              <circle
                cx="300"
                cy="100"
                r="1.5"
                className="fill-current opacity-40 dark:opacity-60"
              >
                <animate
                  attributeName="cy"
                  values="100;80;100"
                  dur="5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.8;0.4"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Partícula 3 */}
              <circle
                cx="450"
                cy="200"
                r="2"
                className="fill-current opacity-30 dark:opacity-50"
              >
                <animate
                  attributeName="cy"
                  values="200;170;200"
                  dur="6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.6;0.3"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Partícula 4 */}
              <circle
                cx="600"
                cy="120"
                r="1.8"
                className="fill-current opacity-50 dark:opacity-70"
              >
                <animate
                  attributeName="cy"
                  values="120;140;120"
                  dur="7s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0.7;0.5"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Partícula 5 */}
              <circle
                cx="750"
                cy="180"
                r="1.5"
                className="fill-current opacity-40 dark:opacity-60"
              >
                <animate
                  attributeName="cy"
                  values="180;150;180"
                  dur="8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.7;0.4"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Partícula 6 */}
              <circle
                cx="100"
                cy="250"
                r="2"
                className="fill-current opacity-30 dark:opacity-50"
              >
                <animate
                  attributeName="cy"
                  values="250;230;250"
                  dur="9s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.6;0.3"
                  dur="9s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Partícula 7 */}
              <circle
                cx="350"
                cy="150"
                r="1.5"
                className="fill-current opacity-50 dark:opacity-70"
              >
                <animate
                  attributeName="cy"
                  values="150;180;150"
                  dur="7s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0.8;0.5"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Mais partículas... */}
              <circle
                cx="250"
                cy="200"
                r="1"
                className="fill-current opacity-30 dark:opacity-50"
              >
                <animate
                  attributeName="cy"
                  values="200;210;200"
                  dur="4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.6;0.3"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle
                cx="500"
                cy="300"
                r="1"
                className="fill-current opacity-20 dark:opacity-40"
              >
                <animate
                  attributeName="cy"
                  values="300;290;300"
                  dur="5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.5;0.2"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            {/* Linhas conectando algumas partículas */}
            <g
              className="text-primary stroke-current opacity-10 dark:opacity-30"
              strokeWidth="0.5"
            >
              <line x1="150" y1="150" x2="300" y2="100">
                <animate
                  attributeName="y1"
                  values="150;120;150"
                  dur="4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="100;80;100"
                  dur="5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.1;0.3;0.1"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </line>

              <line x1="300" y1="100" x2="450" y2="200">
                <animate
                  attributeName="y1"
                  values="100;80;100"
                  dur="5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="200;170;200"
                  dur="6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.4;0.2"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </line>

              <line x1="450" y1="200" x2="600" y2="120">
                <animate
                  attributeName="y1"
                  values="200;170;200"
                  dur="6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="120;140;120"
                  dur="7s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.1;0.3;0.1"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          </svg>
        </div>
      </div>

      {/* NavBar com ThemeToggle e Botão Voltar */}
      <div className="navbar bg-base-100/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <div className="navbar-start">
          <button
            className="btn btn-ghost btn-sm rounded-lg transition-all duration-300 hover:scale-105"
            onClick={handleBack}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="text-opacity-90">Voltar</span>
          </button>
        </div>
        <div className="navbar-center">
          <h1 className="text-2xl font-bold text-primary transition-all duration-300 hover:scale-105 cursor-pointer">
            PulsePay
            <span className="text-secondary">.</span>
          </h1>
        </div>
        <div className="navbar-end">
          <div className="transition-all duration-300 hover:scale-110">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex items-center justify-center p-4 my-8">
        <div
          className={`card lg:card-side bg-base-100 shadow-2xl max-w-5xl w-full overflow-hidden transition-all duration-500 ease-out ${
            showPage ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
          }`}
        >
          {/* Lado Esquerdo - Informações */}
          <div className="card-body lg:w-1/2 bg-gradient-to-br from-primary/90 to-secondary/90 text-primary-content p-8 rounded-l-box relative overflow-hidden">
            {/* Orbs animados no fundo */}
            <div
              className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary-focus opacity-20 animate-pulse"
              style={{ animationDuration: "7s" }}
            ></div>
            <div
              className="absolute top-1/2 -right-32 w-64 h-64 rounded-full bg-secondary-focus opacity-20 animate-pulse"
              style={{ animationDuration: "10s" }}
            ></div>

            <h2 className="card-title text-3xl font-bold mb-2 transition-all duration-500 ease-out transform translate-x-0">
              Bem-vindo ao PulsePay!
            </h2>
            <div className="divider before:bg-primary-content/30 after:bg-primary-content/30"></div>
            <p className="text-lg mb-8 transition-all duration-500 delay-100 transform translate-x-0">
              Sua plataforma completa para gerenciamento de pagamentos e análise
              de vendas. Acesse seus dashboards e consulte informações em tempo
              real.
            </p>

            <div
              className={`space-y-4 mt-auto transition-all duration-500 ease-out ${
                showFeatures
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {[
                "Dashboards em tempo real",
                "Relatórios detalhados",
                "Pagamentos 100% seguros",
              ].map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 transition-all"
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="w-4 h-4 rounded-full bg-primary-content flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping opacity-75"></div>
                  </div>
                  <span className="transition-all duration-300 hover:translate-x-1">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <div
            className={`card-body lg:w-1/2 p-8 transition-all duration-500 ease-out ${
              showForm
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <h2 className="card-title text-2xl font-bold mb-6">
              Realizar Login
            </h2>

            <form
              id="login-form"
              onSubmit={handleLogin}
              className="form-control gap-4"
            >
              <div
                className={`form-control transition-all duration-300 ease-out ${
                  activeInput === "email" ? "scale-[1.02]" : ""
                }`}
              >
                <label className="label">
                  <span
                    className={`label-text transition-all duration-300 ${
                      activeInput === "email" ? "text-primary font-medium" : ""
                    }`}
                  >
                    E-mail
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className={`input input-bordered focus:input-primary transition-all duration-300 ${
                    activeInput === "email"
                      ? "border-primary shadow-md shadow-primary/20"
                      : ""
                  }`}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleInputFocus("email")}
                  onBlur={handleInputBlur}
                />
              </div>

              <div
                className={`form-control transition-all duration-300 ease-out ${
                  activeInput === "password" ? "scale-[1.02]" : ""
                }`}
              >
                <label className="label">
                  <span
                    className={`label-text transition-all duration-300 ${
                      activeInput === "password"
                        ? "text-primary font-medium"
                        : ""
                    }`}
                  >
                    Senha
                  </span>
                  <a
                    href="#"
                    className="label-text-alt link link-hover link-primary transition-all duration-300 hover:scale-105"
                  >
                    Esqueceu sua senha?
                  </a>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input input-bordered focus:input-primary transition-all duration-300 ${
                    activeInput === "password"
                      ? "border-primary shadow-md shadow-primary/20"
                      : ""
                  }`}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleInputFocus("password")}
                  onBlur={handleInputBlur}
                />
              </div>

              {response && (
                <div className="alert alert-error shadow-lg animate-slideInDown">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{response}</span>
                </div>
              )}

              <div className="form-control mt-4">
                <button
                  type="submit"
                  className={`btn ${
                    isFormValid ? "btn-primary" : "btn-primary opacity-70"
                  } ${
                    isLoading ? "loading" : ""
                  } transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95`}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? "Processando..." : "Entrar"}
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-base-content/70">
                  Não tem uma conta?
                  <a
                    href="/register"
                    className="link link-primary ml-2 transition-all duration-300 hover:underline"
                  >
                    Registre-se agora
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold">PulsePay</span>
          <span>•</span>
          <p>
            Copyright © {new Date().getFullYear()} - Todos os direitos
            reservados
          </p>
        </div>
      </footer>

      {/* Estilos CSS para as animações personalizadas */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        @keyframes slideInDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        .animate-slideInDown {
          animation: slideInDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;
