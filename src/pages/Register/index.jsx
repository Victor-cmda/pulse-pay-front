import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Steps, Switch } from "antd";
import { Container } from "../../components";
import { authService } from "../../services/AuthService";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import ThemeToggle from "../../theme/ThemeToggle";
import {
  validateDocument,
  validateCNPJ,
  formatDocument,
} from "../../validators/documentValidator";
import {
  validateFullName,
  validateCompanyName,
} from "../../validators/nameValidator";
import {
  validateEmail,
  formatPhone,
  validatePhone,
} from "../../validators/contactValidator";
import { validatePassport } from "../../validators/foreignerValidator";

const { Step } = Steps;

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
    passport: "",
    nationality: "",
    isForeigner: false,
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
  const [passportError, setPassportError] = useState("");
  const [nationalityError, setNationalityError] = useState("");
  const navigate = useNavigate();

  // Estados para controlar animações
  const [showPage, setShowPage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  // Efeito de entrada na página
  useEffect(() => {
    setShowPage(true);

    const formTimer = setTimeout(() => {
      setShowForm(true);
    }, 300);

    return () => {
      clearTimeout(formTimer);
    };
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData, currentStep, documentError, passportError, nationalityError]);

  const validateForm = () => {
    const {
      name,
      document,
      email,
      phone,
      password,
      confirmPassword,
      isForeigner,
      passport,
      nationality,
    } = formData;

    switch (currentStep) {
      case 0:
        if (isForeigner) {
          setIsFormValid(
            name.length > 0 &&
              passport.length > 0 &&
              nationality.length > 0 &&
              !nameError &&
              !passportError &&
              !nationalityError
          );
        } else {
          setIsFormValid(
            name.length > 0 &&
              document.length > 0 &&
              !documentError &&
              !nameError
          );
        }
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
    } else if (name === "passport") {
      setFormData({
        ...formData,
        [name]: value,
      });

      if (isDirty) {
        const error = validatePassport(value);
        setPassportError(error);
      }
    } else if (name === "nationality") {
      const sanitizedValue = value.replace(
        /[^A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]/g,
        ""
      );

      setFormData({
        ...formData,
        [name]: sanitizedValue,
      });

      if (isDirty) {
        setNationalityError(
          sanitizedValue.length < 3
            ? "Nacionalidade deve ter pelo menos 3 caracteres"
            : ""
        );
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleForeignerToggle = (checked) => {
    setFormData({
      ...formData,
      isForeigner: checked,
      // Limpa os campos específicos quando muda o tipo de usuário
      document: checked ? "" : formData.document,
      documentType: checked ? "" : formData.documentType,
      passport: !checked ? "" : formData.passport,
      nationality: !checked ? "" : formData.nationality,
    });

    // Limpa erros
    if (checked) {
      setDocumentError("");
    } else {
      setPassportError("");
      setNationalityError("");
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
      // Efeito visual quando muda de step
      setShowForm(false);

      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setShowForm(true);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      // Efeito visual quando muda de step
      setShowForm(false);

      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setShowForm(true);
      }, 300);
    }
  };

  const handleBack = () => {
    // Animar a saída antes de navegar
    setShowPage(false);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Preparando os dados para envio conforme o tipo de usuário
    const registrationData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    if (formData.isForeigner) {
      registrationData.documentType = "PASSPORT";
      registrationData.document = formData.passport;
      registrationData.nationality = formData.nationality;
      registrationData.isForeigner = true;
    } else {
      registrationData.documentType = formData.documentType;
      registrationData.document = formData.document;
      registrationData.isForeigner = false;
    }

    try {
      const result = await authService.register(registrationData);
      setResponse(result.message);

      if (result.success) {
        // Animação de saída ao registrar com sucesso
        setShowPage(false);
        setTimeout(() => {
          navigate("/");
        }, 300);
      } else {
        // Shake animation para erro
        const form = document.getElementById("register-form");
        form.classList.add("animate-shake");
        setTimeout(() => {
          form.classList.remove("animate-shake");
        }, 500);
      }
    } catch (error) {
      setResponse("Erro ao registrar. Tente novamente.");
      // Shake animation para erro
      const form = document.getElementById("register-form");
      form.classList.add("animate-shake");
      setTimeout(() => {
        form.classList.remove("animate-shake");
      }, 500);
    } finally {
      setIsLoading(false);
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

  const handleInputFocus = (input) => {
    setActiveInput(input);
  };

  const handleInputBlur = (input) => {
    setActiveInput(null);
    setIsDirty(true);

    // Validações específicas no blur
    if (input === "document") {
      validateAndShowDocumentError(formData.document);
    } else if (input === "name") {
      const error = validateName(formData.name);
      setNameError(error);
    } else if (input === "email") {
      setEmailError(validateEmail(formData.email));
    } else if (input === "phone") {
      setPhoneError(validatePhone(formData.phone));
    } else if (input === "passport") {
      const error = validatePassport(formData.passport);
      setPassportError(error);
    } else if (input === "nationality") {
      const error =
        formData.nationality.length < 3
          ? "Nacionalidade deve ter pelo menos 3 caracteres"
          : "";
      setNationalityError(error);
    }
  };

  const steps = [
    {
      title: "Dados",
      content: (
        <>
          <div className="form-control mb-6">
            <label className="flex items-center justify-between">
              <span className="label-text">Sou Estrangeiro</span>
              <Switch
                checked={formData.isForeigner}
                onChange={handleForeignerToggle}
              />
            </label>
            <div className="text-xs text-slate-500 mt-1">
              {formData.isForeigner
                ? "Selecione esta opção se você não possui CPF/CNPJ brasileiro"
                : "Selecione esta opção caso não possua documento brasileiro"}
            </div>
          </div>

          {!formData.isForeigner ? (
            <>
              <div
                className={`form-control transition-all duration-300 ease-out ${
                  activeInput === "document" ? "scale-[1.02]" : ""
                }`}
              >
                <label
                  className={`label transition-all duration-300 ${
                    activeInput === "document" ? "text-primary font-medium" : ""
                  }`}
                >
                  <span className="label-text">Documento (CNPJ/CPF)</span>
                </label>
                <input
                  type="text"
                  placeholder={
                    documentType === "CPF"
                      ? "000.000.000-00"
                      : "00.000.000/0000-00"
                  }
                  name="document"
                  className={`input input-bordered transition-all duration-300 ${
                    documentError ? "input-error" : ""
                  } ${
                    activeInput === "document"
                      ? "border-primary shadow-md shadow-primary/20"
                      : ""
                  }`}
                  value={formData.document}
                  onChange={(e) => handleDocumentChange(e)}
                  maxLength={18}
                  onFocus={() => handleInputFocus("document")}
                  onBlur={() => handleInputBlur("document")}
                  required
                />
                {documentError && (
                  <label className="label animate-slideInDown">
                    <span className="label-text-alt text-error">
                      {documentError}
                    </span>
                  </label>
                )}
              </div>
              <div
                className={`form-control transition-all duration-300 ease-out ${
                  activeInput === "name" ? "scale-[1.02]" : ""
                }`}
              >
                <label
                  className={`label transition-all duration-300 ${
                    activeInput === "name" ? "text-primary font-medium" : ""
                  }`}
                >
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
                  className={`input input-bordered transition-all duration-300 ${
                    nameError ? "input-error" : ""
                  } ${
                    activeInput === "name"
                      ? "border-primary shadow-md shadow-primary/20"
                      : ""
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus("name")}
                  onBlur={() => handleInputBlur("name")}
                  required
                />
                {nameError && (
                  <label className="label animate-slideInDown">
                    <span className="label-text-alt text-error">
                      {nameError}
                    </span>
                  </label>
                )}
              </div>
            </>
          ) : (
            <>
              <div
                className={`form-control transition-all duration-300 ease-out ${
                  activeInput === "passport" ? "scale-[1.02]" : ""
                }`}
              >
                <label
                  className={`label transition-all duration-300 ${
                    activeInput === "passport" ? "text-primary font-medium" : ""
                  }`}
                >
                  <span className="label-text">Passaporte</span>
                </label>
                <input
                  type="text"
                  placeholder="AB123456"
                  name="passport"
                  className={`input input-bordered transition-all duration-300 ${
                    passportError ? "input-error" : ""
                  } ${
                    activeInput === "passport"
                      ? "border-primary shadow-md shadow-primary/20"
                      : ""
                  }`}
                  value={formData.passport}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus("passport")}
                  onBlur={() => handleInputBlur("passport")}
                  required
                />
                {passportError && (
                  <label className="label animate-slideInDown">
                    <span className="label-text-alt text-error">
                      {passportError}
                    </span>
                  </label>
                )}
              </div>

              <div
                className={`form-control transition-all duration-300 ease-out ${
                  activeInput === "nationality" ? "scale-[1.02]" : ""
                }`}
              >
                <label
                  className={`label transition-all duration-300 ${
                    activeInput === "nationality"
                      ? "text-primary font-medium"
                      : ""
                  }`}
                >
                  <span className="label-text">Nacionalidade</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Italiano"
                  name="nationality"
                  className={`input input-bordered transition-all duration-300 ${
                    nationalityError ? "input-error" : ""
                  } ${
                    activeInput === "nationality"
                      ? "border-primary shadow-md shadow-primary/20"
                      : ""
                  }`}
                  value={formData.nationality}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus("nationality")}
                  onBlur={() => handleInputBlur("nationality")}
                  required
                />
                {nationalityError && (
                  <label className="label animate-slideInDown">
                    <span className="label-text-alt text-error">
                      {nationalityError}
                    </span>
                  </label>
                )}
              </div>

              <div
                className={`form-control transition-all duration-300 ease-out ${
                  activeInput === "name" ? "scale-[1.02]" : ""
                }`}
              >
                <label
                  className={`label transition-all duration-300 ${
                    activeInput === "name" ? "text-primary font-medium" : ""
                  }`}
                >
                  <span className="label-text">Nome Completo</span>
                </label>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  name="name"
                  className={`input input-bordered transition-all duration-300 ${
                    nameError ? "input-error" : ""
                  } ${
                    activeInput === "name"
                      ? "border-primary shadow-md shadow-primary/20"
                      : ""
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus("name")}
                  onBlur={() => handleInputBlur("name")}
                  required
                />
                {nameError && (
                  <label className="label animate-slideInDown">
                    <span className="label-text-alt text-error">
                      {nameError}
                    </span>
                  </label>
                )}
              </div>
            </>
          )}
        </>
      ),
    },
    {
      title: "Contato",
      content: (
        <>
          <div
            className={`form-control transition-all duration-300 ease-out ${
              activeInput === "email" ? "scale-[1.02]" : ""
            }`}
          >
            <label
              className={`label transition-all duration-300 ${
                activeInput === "email" ? "text-primary font-medium" : ""
              }`}
            >
              <span className="label-text">E-mail</span>
            </label>
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              className={`input input-bordered transition-all duration-300 ${
                emailError ? "input-error" : ""
              } ${
                activeInput === "email"
                  ? "border-primary shadow-md shadow-primary/20"
                  : ""
              }`}
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("email")}
              onBlur={() => handleInputBlur("email")}
              required
            />
            {emailError && (
              <label className="label animate-slideInDown">
                <span className="label-text-alt text-error">{emailError}</span>
              </label>
            )}
          </div>

          <div
            className={`form-control transition-all duration-300 ease-out ${
              activeInput === "phone" ? "scale-[1.02]" : ""
            }`}
          >
            <label
              className={`label transition-all duration-300 ${
                activeInput === "phone" ? "text-primary font-medium" : ""
              }`}
            >
              <span className="label-text">Número de Celular</span>
            </label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              name="phone"
              className={`input input-bordered transition-all duration-300 ${
                phoneError ? "input-error" : ""
              } ${
                activeInput === "phone"
                  ? "border-primary shadow-md shadow-primary/20"
                  : ""
              }`}
              value={formData.phone}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("phone")}
              onBlur={() => handleInputBlur("phone")}
              maxLength={15}
              required
            />
            {phoneError && (
              <label className="label animate-slideInDown">
                <span className="label-text-alt text-error">{phoneError}</span>
              </label>
            )}
          </div>
        </>
      ),
    },
    {
      title: "Senha",
      content: (
        <>
          <div
            className={`form-control transition-all duration-300 ease-out ${
              activeInput === "password" ? "scale-[1.02]" : ""
            }`}
          >
            <label
              className={`label transition-all duration-300 ${
                activeInput === "password" ? "text-primary font-medium" : ""
              }`}
            >
              <span className="label-text">Senha</span>
            </label>
            <input
              type="password"
              placeholder="Senha"
              name="password"
              className={`input input-bordered transition-all duration-300 ${
                activeInput === "password"
                  ? "border-primary shadow-md shadow-primary/20"
                  : ""
              }`}
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("password")}
              onBlur={() => handleInputBlur("password")}
              required
            />
          </div>
          <div
            className={`form-control transition-all duration-300 ease-out ${
              activeInput === "confirmPassword" ? "scale-[1.02]" : ""
            }`}
          >
            <label
              className={`label transition-all duration-300 ${
                activeInput === "confirmPassword"
                  ? "text-primary font-medium"
                  : ""
              }`}
            >
              <span className="label-text">Confirme sua senha</span>
            </label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              name="confirmPassword"
              className={`input input-bordered transition-all duration-300 ${
                formData.password !== formData.confirmPassword &&
                formData.confirmPassword
                  ? "input-error"
                  : ""
              } ${
                activeInput === "confirmPassword"
                  ? "border-primary shadow-md shadow-primary/20"
                  : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("confirmPassword")}
              onBlur={() => handleInputBlur("confirmPassword")}
              required
            />
            {formData.password !== formData.confirmPassword &&
              formData.confirmPassword && (
                <label className="label animate-slideInDown">
                  <span className="label-text-alt text-error">
                    As senhas não coincidem
                  </span>
                </label>
              )}
          </div>
        </>
      ),
    },
  ];

  return (
    <div
      className={`min-h-screen bg-base-200 flex flex-col transition-opacity duration-500 ease-in-out ${
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
          className={`card bg-base-100 shadow-2xl max-w-5xl w-full overflow-hidden transition-all duration-500 ease-out ${
            showPage ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Lado Esquerdo - Informações */}
            <div className="bg-gradient-to-br from-primary/90 to-secondary/90 text-primary-content p-8 relative overflow-hidden">
              {/* Orbs animados no fundo */}
              <div
                className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary-focus opacity-20 animate-pulse"
                style={{ animationDuration: "7s" }}
              ></div>
              <div
                className="absolute top-1/2 -right-32 w-64 h-64 rounded-full bg-secondary-focus opacity-20 animate-pulse"
                style={{ animationDuration: "10s" }}
              ></div>

              <h2 className="text-3xl font-bold mb-2 transition-all duration-500 ease-out transform translate-x-0">
                PulsePay
              </h2>
              <div className="divider before:bg-primary-content/30 after:bg-primary-content/30"></div>
              <h3 className="text-2xl font-bold mb-4">Crie sua conta</h3>
              <p className="text-lg mb-8 transition-all duration-500 delay-100 transform translate-x-0">
                Crie uma nova conta para acessar seus dashboards e acompanhar
                seu histórico de vendas facilmente com nossa aplicação.
              </p>

              <div className="space-y-4 mt-auto">
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
            <div className="p-8">
              <div
                className={`transition-all duration-500 ease-out ${
                  showForm
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                <h3 className="text-2xl font-bold mb-6">
                  Passo {currentStep + 1} de 3
                </h3>

                <div className="w-full mb-8">
                  <ul className="steps w-full">
                    <li
                      className={`step ${
                        currentStep >= 0 ? "step-primary" : ""
                      } transition-colors duration-300`}
                      onClick={() => currentStep > 0 && handlePrev()}
                    >
                      <span
                        className={`${currentStep === 0 ? "font-medium" : ""}`}
                      >
                        Dados
                      </span>
                    </li>
                    <li
                      className={`step ${
                        currentStep >= 1 ? "step-primary" : ""
                      } transition-colors duration-300`}
                      onClick={() => currentStep > 1 && setCurrentStep(1)}
                    >
                      <span
                        className={`${currentStep === 1 ? "font-medium" : ""}`}
                      >
                        Contato
                      </span>
                    </li>
                    <li
                      className={`step ${
                        currentStep >= 2 ? "step-primary" : ""
                      } transition-colors duration-300`}
                      onClick={() => currentStep > 2 && setCurrentStep(2)}
                    >
                      <span
                        className={`${currentStep === 2 ? "font-medium" : ""}`}
                      >
                        Senha
                      </span>
                    </li>
                  </ul>
                </div>

                <form id="register-form" className="form-control gap-4">
                  {steps[currentStep].content}

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

                  <div className="form-control mt-6 flex space-y-2">
                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="primary"
                        onClick={handleNext}
                        className={`btn ${
                          isFormValid ? "btn-primary" : "btn-primary opacity-70"
                        } transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95`}
                        disabled={!isFormValid}
                      >
                        Próximo <ArrowRightOutlined />
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                        className={`btn ${
                          isFormValid ? "btn-primary" : "btn-primary opacity-70"
                        } ${
                          isLoading ? "loading" : ""
                        } transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95`}
                        disabled={!isFormValid || isLoading}
                      >
                        {isLoading ? "Processando..." : "Registrar"}{" "}
                        <UserAddOutlined />
                      </Button>
                    )}

                    {currentStep > 0 && (
                      <Button
                        onClick={handlePrev}
                        className="btn btn-outline transition-all duration-300 hover:shadow-md active:scale-95 mt-2"
                      >
                        <ArrowLeftOutlined /> Anterior
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content backdrop-blur-sm mt-auto">
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

export default Register;
