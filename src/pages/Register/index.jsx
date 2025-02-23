import React, { useState, useEffect } from "react";
import "./styles.css";
import { Container } from "../../components";
import { Button, Steps } from "antd";
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
import {
  validateDocument,
  validateCNPJ,
  formatDocument,
} from "../../validators/documentValidator";
import {
  validateFullName,
  validateCompanyName,
} from "../../validators/nameValidator";
const { Step } = Steps;
import {
  validateEmail,
  formatPhone,
  validatePhone,
} from "../../validators/contactValidator";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    document: "",
    documentType: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [documentType, setDocumentType] = useState("CNPJ");
  const [isDirty, setIsDirty] = useState(false);
  const [documentError, setDocumentError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    validateForm();
  }, [formData, currentStep, documentError]);

  const validateForm = () => {
    const { name, document, email, phone, password, confirmPassword } =
      formData;

    switch (currentStep) {
      case 0:
        setIsFormValid(
          name.length > 0 && document.length > 0 && !documentError && !nameError
        );
        break;
      case 1:
        setIsFormValid(
          email.length > 0 && phone.length > 0 && !emailError && !phoneError
        );
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

    if (name === "name") {
      const sanitizedValue = value.replace(
        /[^A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]/g,
        ""
      );

      setFormData({
        ...formData,
        [name]: sanitizedValue,
      });

      if (isDirty) {
        const error = validateName(sanitizedValue);
        setNameError(error);
      }
    } else if (name === "email") {
      setFormData({
        ...formData,
        [name]: value,
      });

      if (isDirty) {
        const error = validateEmail(value);
        setEmailError(error);
      }
    } else if (name === "phone") {
      const { formattedValue, error } = formatPhone(value);

      setFormData({
        ...formData,
        [name]: formattedValue,
      });

      if (isDirty) {
        setPhoneError(error);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDocumentChange = (e) => {
    const value = e.target.value;
    const { formattedValue, type } = formatDocument(value);

    setFormData((prev) => ({
      ...prev,
      document: formattedValue,
      documentType: type,
    }));

    setDocumentType(type);

    if (isDirty) {
      validateAndShowDocumentError(formattedValue);
    }
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

  const validateAndShowDocumentError = (value) => {
    const documentWithoutMask = value.replace(/[^\d]+/g, "");

    if (!documentWithoutMask) {
      setDocumentError("");
      return;
    }

    if (
      documentWithoutMask.length !== 11 &&
      documentWithoutMask.length !== 14
    ) {
      setDocumentError("Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos");
      return;
    }

    if (documentWithoutMask.length === 11) {
      if (!validateDocument(documentWithoutMask)) {
        setDocumentError("CPF inválido");
      } else {
        setDocumentError("");
        setDocumentType("CPF");
      }
    } else {
      if (!validateCNPJ(documentWithoutMask)) {
        setDocumentError("CNPJ inválido");
      } else {
        setDocumentError("");
        setDocumentType("CNPJ");
      }
    }
  };

  const validateName = (name) => {
    return documentType === "CNPJ"
      ? validateCompanyName(name)
      : validateFullName(name);
  };

  const steps = [
    {
      title: "Dados",
      icon: <IdentificationIcon className="size-7" />,
      content: (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Documento (CNPJ/CPF)</span>
            </label>
            <input
              type="text"
              placeholder={
                documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"
              }
              name="document"
              className={`input input-bordered ${
                documentError ? "input-error" : ""
              }`}
              value={formData.document}
              onChange={(e) => handleDocumentChange(e)}
              maxLength={18}
              onBlur={(e) => {
                setIsDirty(true);
                validateAndShowDocumentError(e.target.value);
              }}
              required
            />
            {documentError && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {documentError}
                </span>
              </label>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                {documentType === "CNPJ" ? "Razão Social" : "Nome Completo"}
              </span>
            </label>
            <input
              type="text"
              placeholder={
                documentType === "CNPJ" ? "Razão Social" : "Nome Completo"
              }
              name="name"
              className={`input input-bordered ${
                nameError ? "input-error" : ""
              }`}
              value={formData.name}
              onChange={handleInputChange}
              onBlur={() => {
                setIsDirty(true);
                const error = validateName(formData.name);
                setNameError(error);
              }}
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
              className={`input input-bordered ${
                emailError ? "input-error" : ""
              }`}
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => {
                setIsDirty(true);
                setEmailError(validateEmail(formData.email));
              }}
              required
            />
            {emailError && (
              <label className="label">
                <span className="label-text-alt text-error">{emailError}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Número de Celular</span>
            </label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              name="phone"
              className={`input input-bordered ${
                phoneError ? "input-error" : ""
              }`}
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={() => {
                setIsDirty(true);
                setPhoneError(validatePhone(formData.phone));
              }}
              maxLength={15}
              required
            />
            {phoneError && (
              <label className="label">
                <span className="label-text-alt text-error">{phoneError}</span>
              </label>
            )}
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
          <div
            className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
            style={{ minWidth: "47vh" }}
          >
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
