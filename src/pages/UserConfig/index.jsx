import React, { useRef, useState, useEffect } from "react";
import { Container } from "../../components";
import {
  IdentificationIcon,
  ArrowRightCircleIcon,
  ChartPieIcon,
  ClipboardIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  XCircleIcon,
  PencilIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { notification, Modal, Form, Input } from "antd";
import ThemeToggle from "../../theme/ThemeToggle";
import { authService } from "../../services/AuthService";
import { useLoading } from "../../context/LoadingContext";

const UserConfig = () => {
  const inputRefs = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("api");
  const [api, contextHolder] = notification.useNotification();
  const [selectedCommerce, setSelectedCommerce] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [apiConfig, setApiConfig] = useState({
    clientId: "",
    clientSecret: "",
    apiEndpoint: "",
  });

  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [commerces, setCommerces] = useState([]);
  const [webhookKeyVisible, setWebhookKeyVisible] = useState(false);
  const [isSellerModalVisible, setIsSellerModalVisible] = useState(false);
  const [sellerForm] = Form.useForm();
  const loadedCommerceIds = useRef([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authService.setAuthorizationHeader(token);
    }

    loadApiConfig();
  }, []);

  useEffect(() => {
    if (activeTab === "ecommerce") {
      loadSellers();
    }
  }, [activeTab]);

  useEffect(() => {
    const commerceId = selectedCommerce?.id;
    if (commerceId && !loadedCommerceIds.current.includes(commerceId)) {
      loadCommerceDetails(commerceId);
      loadedCommerceIds.current.push(commerceId);
    }
  }, [selectedCommerce]);

  const loadApiConfig = async () => {
    setIsLoading(true);
    try {
      setLoading(true);
      const response = await authService.getConfiguration();
      if (response.success) {
        setApiConfig({
          clientId: response.data.apiConfig.clientId || "",
          clientSecret: response.data.apiConfig.clientSecret || "",
          apiEndpoint: response.data.apiConfig.apiEndpoint || "",
        });
      } else {
        api.error({
          message: "Erro",
          description:
            response.message || "Erro ao carregar configurações da API",
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Erro",
        description: "Não foi possível carregar as configurações da API",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const loadSellers = async () => {
    setIsLoading(true);
    try {
      const response = await authService.getAvailableSellers();
      if (response.success) {
        setSellers(response.data);

        if (response.data.length > 0) {
          setSelectedSeller(response.data[0]);
          loadCommercesBySeller(response.data[0].id);
        }
      } else {
        api.error({
          message: "Erro",
          description: response.message || "Erro ao carregar sellers",
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Erro",
        description: "Não foi possível carregar os sellers",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCommercesBySeller = async (sellerId) => {
    setIsLoading(true);
    try {
      const response = await authService.getSellerWithCommerces(sellerId);
      if (response.success) {
        setCommerces(response.data.commerces || []);
      } else {
        api.error({
          message: "Erro",
          description: response.message || "Erro ao carregar comércios",
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Erro",
        description: "Não foi possível carregar os comércios",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCommerceDetails = async (commerceId) => {
    setIsLoading(true);
    try {
      const response = await authService.getCommerceById(commerceId);
      const commerceData =
        response.success && response.data ? response.data : response;

      const updatedCommerce = {
        ...commerceData,
        callbacks: commerceData.callbacks || {
          credit: "",
          debit: "",
          boleto: "",
          webhook: "",
          securityKey: "",
        },
      };

      setSelectedCommerce(updatedCommerce);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      api.error({
        message: "Erro",
        description: "Não foi possível carregar os detalhes do comércio",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiConfiguration = async () => {
    setIsLoading(true);
    try {
      const response = await authService.updateConfiguration(
        apiConfig.apiEndpoint
      );
      if (response.success) {
        api.success({
          message: "Sucesso",
          description: "Configurações da API atualizadas com sucesso",
          placement: "topRight",
        });
      } else {
        api.error({
          message: "Erro",
          description:
            response.message || "Erro ao atualizar configurações da API",
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Erro",
        description: "Não foi possível atualizar as configurações da API",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCommerce = async (values) => {
    setIsLoading(true);
    try {
      const response = await authService.createCommerce(
        selectedSeller.id,
        values.name,
        values.url
      );

      if (response.success) {
        api.success({
          message: "Sucesso",
          description: "Comércio criado com sucesso",
          placement: "topRight",
        });

        loadCommercesBySeller(selectedSeller.id);
        setIsModalVisible(false);
        form.resetFields();
      } else {
        api.error({
          message: "Erro",
          description: response.message || "Erro ao criar comércio",
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Erro",
        description: "Não foi possível criar o comércio",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCallbacks = async () => {
    if (!selectedCommerce) return;

    const callbacksToUpdate = selectedCommerce.callbacks || {
      credit: "",
      debit: "",
      boleto: "",
      webhook: "",
      securityKey: "",
    };

    setIsLoading(true);
    try {
      const response = await authService.updateCommerceCallbacks(
        selectedCommerce.id,
        callbacksToUpdate
      );

      if (response.success) {
        api.success({
          message: "Sucesso",
          description: "Callbacks atualizados com sucesso",
          placement: "topRight",
        });

        const updatedCallbacks = response.data.callbacks || response.data;

        setSelectedCommerce({
          ...selectedCommerce,
          callbacks: updatedCallbacks,
        });
      } else {
        api.error({
          message: "Erro",
          description: response.message || "Erro ao atualizar callbacks",
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Erro",
        description: "Não foi possível atualizar os callbacks",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].select();
      document.execCommand("copy");
      api.success({
        message: "Sucesso",
        description: "Texto copiado para a área de transferência!",
        placement: "topRight",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const updateCallbackField = (field, value) => {
    setSelectedCommerce({
      ...selectedCommerce,
      callbacks: {
        ...(selectedCommerce.callbacks || {}),
        [field]: value,
      },
    });
  };

  const createNewSeller = async (values) => {
    setIsLoading(true);
    try {
      const response = await authService.createSeller(
        values.name,
        values.description
      );

      if (response.success) {
        api.success({
          message: "Sucesso",
          description: "Seller criado com sucesso",
          placement: "topRight",
        });

        setIsSellerModalVisible(false);
        sellerForm.resetFields();

        loadSellers();
      } else {
        api.error({
          message: "Erro",
          description: response.message || "Erro ao criar seller",
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Erro",
        description: "Não foi possível criar o seller",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ConfigField = ({
    label,
    value,
    refIndex,
    isPassword = false,
    hint,
    onChange,
    readOnly = true,
  }) => (
    <div className="form-control w-full mb-6">
      <label className="flex flex-col space-y-2">
        <div className="flex items-center">
          <span className="text-sm font-medium text-base-content">{label}</span>
          {hint && (
            <div className="tooltip" data-tip={hint}>
              <InformationCircleIcon className="w-4 h-4 ml-2 text-base-content/60" />
            </div>
          )}
        </div>
        <div className="flex items-center rounded-md overflow-hidden border border-base-300 bg-base-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50 transition-all">
          <input
            type={isPassword && !showPassword ? "password" : "text"}
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
            readOnly={readOnly}
            ref={(el) => (inputRefs.current[refIndex] = el)}
          />
          <div className="flex">
            {isPassword && (
              <button
                className="p-2 text-base-content/70 hover:text-base-content transition-colors"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              className="p-2 text-base-content/70 hover:text-base-content transition-colors"
              onClick={() => handleCopy(refIndex)}
              aria-label="Copiar para área de transferência"
            >
              <ClipboardIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </label>
      {label.toLowerCase() !== label && (
        <span className="text-xs text-base-content/60 mt-1">
          {label.toLowerCase()}
        </span>
      )}
    </div>
  );

  const CallbackField = ({ label, placeholder, value, onChange, hint }) => {
    const fieldId = `callback-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="form-control w-full mb-6">
        <label className="flex flex-col space-y-2" htmlFor={fieldId}>
          <div className="flex items-center">
            <span className="text-sm font-medium text-base-content">
              {label}
            </span>
            {hint && (
              <div className="tooltip" data-tip={hint}>
                <InformationCircleIcon className="w-4 h-4 ml-2 text-base-content/60" />
              </div>
            )}
          </div>
          <input
            id={fieldId}
            name={fieldId}
            type="text"
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="px-3 py-2 rounded-md border border-base-300 bg-base-200 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all placeholder:text-base-content/40"
            autoComplete="off"
          />
        </label>
      </div>
    );
  };

  const saveConfiguration = () => {
    if (activeTab === "api") {
      saveApiConfiguration();
    } else if (activeTab === "callback" && selectedCommerce) {
      updateCallbacks();
    }
  };

  const tabs = [
    { id: "api", label: "API", icon: <ChartPieIcon className="w-5 h-5" /> },
    {
      id: "ecommerce",
      label: "E-Commerce",
      icon: <IdentificationIcon className="w-5 h-5" />,
    },
    {
      id: "callback",
      label: "Callbacks",
      icon: <ArrowRightCircleIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 transition-colors duration-200">
      {contextHolder}
      <div className="border-b border-base-200">
        <Container>
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Cog6ToothIcon className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Configurações</h1>
            </div>
            <ThemeToggle />
          </div>
        </Container>
      </div>

      <Container className="py-6">
        {/* Desktop Navigation */}
        <div className="hidden md:flex mb-6 border-b border-base-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary font-medium"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mb-6">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-base-200 text-base-content/70"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* API Tab Content */}
        {activeTab === "api" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-base-200/50 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <ChartPieIcon className="w-5 h-5 mr-2 text-primary" />
                Credenciais do cliente
              </h2>

              <ConfigField
                label="Client ID"
                value={apiConfig.clientId}
                refIndex={0}
                hint="Identificador único do seu cliente na API"
              />

              <ConfigField
                label="Client Secret"
                value={apiConfig.clientSecret}
                refIndex={1}
                isPassword={true}
                hint="Chave secreta para autenticação na API"
              />
            </div>

            <div className="bg-base-200/50 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <ChartPieIcon className="w-5 h-5 mr-2 text-primary" />
                Canal de acesso à API
              </h2>

              <ConfigField
                label="API Endpoint"
                value={apiConfig.apiEndpoint}
                refIndex={2}
                hint="URL base para todas as requisições à API"
                onChange={(value) =>
                  setApiConfig({ ...apiConfig, apiEndpoint: value })
                }
                readOnly={false}
              />
            </div>
          </div>
        )}

        {activeTab === "ecommerce" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-base-200/50 rounded-lg p-6">
              {sellers.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium flex items-center">
                      <IdentificationIcon className="w-5 h-5 mr-2 text-primary" />
                      Identificação no E-Commerce
                    </h2>

                    <select
                      className="select select-bordered select-sm"
                      value={selectedSeller?.id}
                      onChange={(e) => {
                        const seller = sellers.find(
                          (s) => s.id === e.target.value
                        );
                        setSelectedSeller(seller);
                        loadCommercesBySeller(e.target.value);
                      }}
                    >
                      {sellers.map((seller) => (
                        <option key={seller.id} value={seller.id}>
                          {seller.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ConfigField
                    label="Identificador de Seller"
                    value={selectedSeller?.id}
                    refIndex={3}
                    hint="Identificador único do seu seller no PulsePay"
                  />

                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-4">
                      Comércios cadastrados
                    </h3>

                    <div className="overflow-x-auto">
                      {commerces.length > 0 ? (
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr>
                              <th>ID do Comércio</th>
                              <th>Nome</th>
                              <th>URL</th>
                              <th>Status</th>
                              <th>Data de Criação</th>
                              <th>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {commerces.map((commerce) => (
                              <tr key={commerce.id}>
                                <td>{commerce.id}</td>
                                <td>{commerce.name}</td>
                                <td>{commerce.url}</td>
                                <td>
                                  <span className="badge badge-success gap-1">
                                    <CheckCircleIcon className="w-3 h-3" />{" "}
                                    Ativo
                                  </span>
                                </td>
                                <td>{commerce.createdAt}</td>
                                <td>
                                  <div className="flex space-x-2">
                                    <button
                                      className="btn btn-sm btn-ghost"
                                      onClick={() => {
                                        setActiveTab("callback");
                                        loadCommerceDetails(commerce.id);
                                      }}
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-8 bg-base-200/30 rounded-lg">
                          <p className="text-base-content/70">
                            Nenhum comércio cadastrado para este seller.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setIsModalVisible(true)}
                        disabled={isLoading}
                      >
                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                        Adicionar Comércio
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-base-content/70 mb-4">
                    Você ainda não possui sellers cadastrados.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsSellerModalVisible(true)}
                    disabled={isLoading}
                  >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Criar um Seller
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Callback Tab Content */}
        {activeTab === "callback" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {!selectedCommerce ? (
              <div className="bg-base-200/50 rounded-lg p-6 text-center">
                <h2 className="text-lg font-medium mb-4">
                  Selecione um comércio
                </h2>
                <p className="text-base-content/70 mb-6">
                  Para configurar os callbacks, selecione um comércio na aba
                  E-Commerce.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab("ecommerce")}
                >
                  Ir para E-Commerce
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between bg-base-200/70 rounded-lg p-4">
                  <div className="flex items-center">
                    <IdentificationIcon className="w-5 h-5 mr-2 text-primary" />
                    <span className="font-medium">{selectedCommerce.name}</span>
                    <span className="text-base-content/60 ml-2">
                      ({selectedCommerce.id})
                    </span>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedCommerce(null)}
                  >
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    Alterar comércio
                  </button>
                </div>

                <div className="bg-base-200/50 rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4 flex items-center">
                    <ArrowRightCircleIcon className="w-5 h-5 mr-2 text-primary" />
                    URLs de Callback para {selectedCommerce.name}
                  </h2>
                  <p className="text-sm text-base-content/70 mb-6">
                    Configure as URLs que receberão notificações automáticas
                    sobre o status das transações deste comércio.
                  </p>

                  <CallbackField
                    label="Pagamento de crédito"
                    placeholder="https://seu_registro/seu_servico_de_pagamento_de_credito"
                    value={
                      (selectedCommerce?.callbacks &&
                        selectedCommerce?.callbacks.credit) ||
                      ""
                    }
                    onChange={(value) => updateCallbackField("credit", value)}
                    hint="Receberá notificações sobre transações de crédito"
                  />

                  <CallbackField
                    label="Pagamento de débito"
                    placeholder="https://seu_registro/seu_servico_de_pagamento_de_debito"
                    value={
                      (selectedCommerce?.callbacks &&
                        selectedCommerce?.callbacks.debit) ||
                      ""
                    }
                    onChange={(value) => updateCallbackField("debit", value)}
                    hint="Receberá notificações sobre transações de débito"
                  />

                  <CallbackField
                    label="Registro/Baixa do Boleto"
                    placeholder="https://seu_registro/seu_servico_de_boleto"
                    value={
                      (selectedCommerce?.callbacks &&
                        selectedCommerce?.callbacks.boleto) ||
                      ""
                    }
                    onChange={(value) => updateCallbackField("boleto", value)}
                    hint="Receberá notificações sobre registro e pagamento de boletos"
                  />

                  <div className="mt-4 p-3 bg-base-300/50 rounded-md flex items-start">
                    <InformationCircleIcon className="w-5 h-5 text-base-content/70 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-base-content/70">
                      As URLs de callback devem ser públicas e seguras (HTTPS)
                      para receber as notificações do PulsePay.
                    </p>
                  </div>
                </div>

                <div className="bg-base-200/50 rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4 flex items-center">
                    <ArrowRightCircleIcon className="w-5 h-5 mr-2 text-primary" />
                    URL de Webhook para {selectedCommerce.name}
                  </h2>

                  <CallbackField
                    label="URL de Webhook"
                    placeholder="https://seu_site.com/api/webhooks"
                    value={selectedCommerce?.callbacks?.webhook}
                    onChange={(value) => updateCallbackField("webhook", value)}
                    hint="URL para receber todos os eventos da plataforma"
                  />

                  <div className="mt-6">
                    <h3
                      className="text-sm font-medium mb-2"
                      id="security-key-label"
                    >
                      Chave de segurança
                    </h3>
                    <div className="flex items-center">
                      <input
                        id="webhook-security-key"
                        name="webhook-security-key"
                        type={webhookKeyVisible ? "text" : "password"}
                        value={selectedCommerce?.callbacks?.securityKey || ""}
                        onChange={(e) =>
                          updateCallbackField("securityKey", e.target.value)
                        }
                        className="px-3 py-2 rounded-md border border-base-300 bg-base-200 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all"
                        aria-labelledby="security-key-label"
                        autoComplete="new-password"
                      />
                      <button
                        className="btn btn-ghost btn-sm ml-2"
                        onClick={() => setWebhookKeyVisible(!webhookKeyVisible)}
                        type="button"
                        aria-label={
                          webhookKeyVisible ? "Ocultar chave" : "Mostrar chave"
                        }
                      >
                        {webhookKeyVisible ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-base-content/60 mt-1">
                      Esta chave será incluída nos cabeçalhos dos webhooks para
                      verificação de autenticidade
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            className={`btn btn-primary ${isLoading ? "loading" : ""}`}
            onClick={saveConfiguration}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </Container>

      {/* Modal para adicionar novo comércio */}
      <Modal
        title="Adicionar Novo Comércio"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={createCommerce}>
          <Form.Item
            name="name"
            label="Nome do Comércio"
            rules={[
              {
                required: true,
                message: "Por favor, informe o nome do comércio!",
              },
            ]}
          >
            <Input placeholder="Ex: Minha Loja Principal" />
          </Form.Item>

          <Form.Item
            name="url"
            label="URL do Comércio"
            rules={[
              {
                required: true,
                message: "Por favor, informe a URL do comércio!",
              },
              { type: "url", message: "Por favor, insira uma URL válida!" },
            ]}
          >
            <Input placeholder="Ex: https://minhaloja.com.br" />
          </Form.Item>

          <Form.Item className="text-right">
            <button
              type="button"
              className="btn btn-ghost mr-2"
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Comércio"}
            </button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para criar novo seller */}
      <Modal
        title="Criar Novo Seller"
        open={isSellerModalVisible}
        onCancel={() => {
          setIsSellerModalVisible(false);
          sellerForm.resetFields();
        }}
        footer={null}
      >
        <Form form={sellerForm} layout="vertical" onFinish={createNewSeller}>
          <Form.Item
            name="name"
            label="Nome do Seller"
            rules={[
              {
                required: true,
                message: "Por favor, informe o nome do seller!",
              },
            ]}
          >
            <Input placeholder="Ex: Minha Empresa" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição"
            rules={[
              { required: true, message: "Por favor, informe uma descrição!" },
            ]}
          >
            <Input.TextArea
              placeholder="Ex: Empresa de e-commerce especializada em produtos eletrônicos"
              rows={4}
            />
          </Form.Item>

          <Form.Item className="text-right">
            <button
              type="button"
              className="btn btn-ghost mr-2"
              onClick={() => {
                setIsSellerModalVisible(false);
                sellerForm.resetFields();
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Seller"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserConfig;
