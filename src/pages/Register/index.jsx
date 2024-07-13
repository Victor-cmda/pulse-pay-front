import React, { useState, useEffect } from "react";
import "./styles.css";
import { Container } from "../../components";
import { Typography, Input, Button, Steps, Tooltip } from "antd";
import {
  IdentificationIcon,
  DevicePhoneMobileIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import { authService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Step } = Steps;

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
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
  }, [formData, currentStep]);

  const validateForm = () => {
    const { name, CPF, surname, email, phone, password, confirmPassword } = formData;
    switch (currentStep) {
      case 0:
        setIsFormValid(
          name.length > 0 && surname.length > 0 && (validateCPF(CPF) || validateCNPJ(CPF))
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

  const handleBack = () => {
    navigate(-1);
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
              <span className="label-text">Nome</span>
            </label>
            <input
              type="text"
              placeholder="Nome"
              name="name"
              className="input input-bordered"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Sobrenome</span>
            </label>
            <input
              type="text"
              placeholder="Sobrenome"
              name="surname"
              className="input input-bordered"
              value={formData.surname}
              onChange={handleInputChange}
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
            <input
              type="tel"
              placeholder="Celular com DDD"
              name="phone"
              className="input input-bordered"
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
    <>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeftIcon className="h-6 w-6 icon" />
        <span className="label">Voltar</span>
      </button>
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">PulsePay</h1>
            <div className="divider"></div>
            <h1 className="text-5xl font-bold">Crie sua conta</h1>
            <p className="py-5 max-w-lg">
              Crie uma nova conta para acessar seus dashboards e acompanhar seu
              histórico de vendas facilmente com nossa aplicação.
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100" style={{minWidth: "47vh"}}>
            <Container className="w-full max-w-md">
              <Steps current={currentStep} className="p-4">
                {steps.map((step, index) => (
                  <Step key={index} title={step.title} icon={step.icon} />
                ))}
              </Steps>
              <form className="card-body">
                {steps[currentStep].content}
                <div className="form-control mt-6">
                  {currentStep < steps.length - 1 && (
                    <Button
                      type="primary"
                      onClick={handleNext}
                      className="btn"
                      disabled={!isFormValid}
                      icon={<ArrowRightOutlined />}
                      iconPosition="end"
                    >
                      Próximo
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      className="btn"
                      disabled={!isFormValid || isLoading}
                      icon={<UserAddOutlined />}
                      iconPosition="end"
                    >
                      {isLoading ? (
                        <span className="loading"></span>
                      ) : (
                        "Registrar"
                      )}
                    </Button>
                  )}
                  {currentStep > 0 && (
                    <Button
                      onClick={handlePrev}
                      className="btn mt-2"
                      icon={<ArrowLeftOutlined />}
                      iconPosition="start"
                    >
                      Anterior
                    </Button>
                  )}
                </div>
                {response && (
                  <div className="mt-4 text-red-500 text-center">
                    {response}
                  </div>
                )}
              </form>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
