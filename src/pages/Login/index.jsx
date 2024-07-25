import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Button } from "antd";
import AuthService from "../../services/AuthService";

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

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await AuthService.login(email, password);
    setResponse(result.message);
    setIsLoading(false);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeftIcon className="h-6 w-6 icon" />
        <span className="label">Voltar</span>
      </button>
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">PulsePay</h1>
            <div className="divider"></div>
            <h1 className="text-5xl font-bold">Realize login</h1>
            <p className="py-5 max-w-lg">
              Faça login para acessar seus dashboards e consultar o histórico de
              vendas com facilidade usando nossa aplicação.
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
                <Button
                  type="primary"
                  onClick={handleLogin}
                  className="btn"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? <span className="loading"></span> : "Login"}
                </Button>
              </div>
              {response && (
                <div className="mt-4 text-red-500 text-center">{response}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
