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
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    validateForm();
  }, [formData, currentStep]);

  const validateForm = () => {
    const { name, surname, email, phone, password, confirmPassword } = formData;
    switch (currentStep) {
      case 0:
        setIsFormValid(name.length > 0 && surname.length > 0);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
              <span className="label-text">Telefone</span>
            </label>
            <input
              type="tel"
              placeholder="Telefone"
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
