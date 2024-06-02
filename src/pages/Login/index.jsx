import React, { useState, useEffect } from "react";
import { authService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateForm = () => {
    setIsFormValid(email.includes("@") && password.length > 0);
  };

  const handleLogin = async () => {
    event.preventDefault();
    setIsLoading(true);
    const result = await authService.login(email, password);
    setResponse(result.message);
    setIsLoading(false);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">PulsePay</h1>
          <div className="divider"></div>
          <h1 className="text-5xl font-bold">Realize login</h1>
          <p className="py-5">
            Realize login e analise seus dashboards e seu histórico de vendas
            com nossa aplicação.
          </p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">E-mail</span>
              </label>
              <input
                type="email"
                placeholder="E-mail"
                className="input input-bordered"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Senha</span>
              </label>
              <input
                type="password"
                placeholder="Senha"
                className="input input-bordered"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Esqueceu sua senha?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                onClick={handleLogin}
                className="btn btn-primary"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? <span className="loading"></span> : "Login"}
              </button>
            </div>
            {response && (
              <div className="mt-4 text-red-500 text-center">{response}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
