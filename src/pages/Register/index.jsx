import React, { useState, useEffect } from "react";
import "./styles.css";
import { Container } from "../../components";
import { Typography, Input, Button, Form, Steps } from "antd";
import { IdentificationIcon, DevicePhoneMobileIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { authService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Step } = Steps;

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
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
  }, [formData]);

  const validateForm = () => {
    const { name, email, phone, password, confirmPassword } = formData;
    switch (currentStep) {
      case 0:
        setIsFormValid(name.length > 0);
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
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nome</span>
          </label>
          <Input
            type="text"
            placeholder="Nome"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
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
            <Input
              type="email"
              placeholder="E-mail"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Telefone</span>
            </label>
            <Input
              type="tel"
              placeholder="Telefone"
              name="phone"
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
            <Input
              type="password"
              placeholder="Senha"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirme sua senha</span>
            </label>
            <Input
              type="password"
              placeholder="Confirme sua senha"
              name="confirmPassword"
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
    <Container>
      <Title>Criar usuário</Title>
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} icon={step.icon} />
        ))}
      </Steps>
      <form className="card-body">
        {steps[currentStep].content}
        <div className="form-control mt-6">
          {currentStep > 0 && (
            <Button onClick={handlePrev} className="btn btn-secondary">
              Anterior
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button
              onClick={handleNext}
              className="btn btn-primary"
              disabled={!isFormValid}
            >
              Próximo
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? <span className="loading"></span> : "Registrar"}
            </Button>
          )}
        </div>
        {response && (
          <div className="mt-4 text-red-500 text-center">{response}</div>
        )}
      </form>
    </Container>
  );
};

export default Register;
