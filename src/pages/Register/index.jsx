import React, { useState, useEffect } from "react";
import "./styles.css";
import { Container } from "../../components";
import { Typography, Input, Button, Form, Steps } from "antd";
import {
  IdentificationIcon,
  DevicePhoneMobileIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { authService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Step } = Steps;

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
    CPF: "",
    DDI: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isCPF, setIsCPF] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const { name, CPF, email, phone, password, confirmPassword } = formData;
    switch (currentStep) {
      case 0:
        setIsFormValid(
          name.length > 0 && (validateCPF(CPF) || validateCNPJ(CPF))
        );
        break;
      case 1:
        setIsFormValid(email.includes("@") && phone.length > 0);
        break;
      case 2:
        setIsFormValid(password.length > 0 && password === confirmPassword);
        break;
      default:
        setIsFormValid(false);
    }
  };

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, "");
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(0)) return false;

    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(1)) return false;

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCPFChange = (e) => {
    const { value } = e.target;
    const onlyNumbers = value.replace(/\D/g, "");

    let formattedValue;
    if (onlyNumbers.length <= 11) {
      setIsCPF(true);
      formattedValue = onlyNumbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      setIsCPF(false);
      formattedValue = onlyNumbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }

    setFormData({
      ...formData,
      CPF: formattedValue,
    });
  };

  const handleNext = () => {
    if (isFormValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await authService.register(formData);
    setResponse(result.message);
    setIsLoading(false);

    if (result.success) {
      navigate("/");
    }
  };

  const steps = [
    {
      title: "Dados",
      icon: <IdentificationIcon className="size-7" />,
      content: (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nome Completo</span>
            </label>
            <input
              type="text"
              placeholder="Nome Completo"
              name="name"
              className="input input-bordered"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">{isCPF ? "CPF" : "CNPJ"}</span>
            </label>
            <input
              type="text"
              placeholder={isCPF ? "CPF" : "CNPJ"}
              name="CPF"
              onChange={handleCPFChange}
              value={formData.CPF}
              className="input input-bordered"
              maxLength={18}
              required
            />
          </div>
        </>
      ),
    },
    {
      title: "Contato",
      icon: <DevicePhoneMobileIcon className="size-7" />,
      content: (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">E-mail</span>
            </label>
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              className="input input-bordered"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirmação de E-mail</span>
            </label>
            <input
              type="text"
              placeholder="Confirmação de E-mail"
              name="confirmEmail"
              className="input input-bordered"
              value={formData.confirmEmail}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">DDI</span>
            </label>
            <input
              type="text"
              placeholder="DDI"
              name="DDI"
              className="input input-bordered"
              value={formData.DDI}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Celular com DDD</span>
            </label>
            <Input
              type="tel"
              placeholder="Celular com DDD"
              name="phone"
              className="input input-bordered"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        </>
      ),
    },
    {
      title: "Senha",
      icon: <EyeSlashIcon className="size-7" />,
      content: (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Senha</span>
            </label>
            <input
              type="password"
              placeholder="Senha"
              name="password"
              className="input input-bordered"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirme sua senha</span>
            </label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              name="confirmPassword"
              className="input input-bordered"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">PulsePay</h1>
          <div className="divider"></div>
          <h1 className="text-5xl font-bold">Cadastre seu usuário</h1>
          <p className="py-5">
            Realize login e analise seus dashboards e seu histórico de vendas
            com nossa aplicação.
          </p>
        </div>
        <div className="card shrink-0 w-full max-w-md shadow-2xl bg-base-100">
          <Container>
            <Steps current={currentStep}>
              {steps.map((step, index) => (
                <Step key={index} title={step.title} icon={step.icon} />
              ))}
            </Steps>
            <form className="card-body">
              {steps[currentStep].content}
              <div className="form-control mt-6">
                {currentStep < steps.length - 1 && (
                  <Button
                    onClick={handleNext}
                    className="btn btn-primary"
                    disabled={!isFormValid}
                  >
                    Próximo
                  </Button>
                )}
                {currentStep > 0 && (
                  <Button onClick={handlePrev} className="btn btn-secondary">
                    Anterior
                  </Button>
                )}

                {currentStep === steps.length - 1 && (
                  <Button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <span className="loading"></span>
                    ) : (
                      "Registrar"
                    )}
                  </Button>
                )}
              </div>
              {response && (
                <div className="mt-4 text-red-500 text-center">{response}</div>
              )}
            </form>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Register;
