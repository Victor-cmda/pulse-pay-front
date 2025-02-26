import React, { useRef, useState } from "react";
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
import { notification } from "antd";
import ThemeToggle from "../../theme/ThemeToggle";

const UserConfig = () => {
  const inputRefs = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("api");
  const [api, contextHolder] = notification.useNotification();
  const [selectedCommerce, setSelectedCommerce] = useState(null);

  // Mock data para comércios e seus callbacks
  const [commerces, setCommerces] = useState([
    {
      id: "loja_id_12345",
      name: "Loja Principal",
      url: "https://www.minhaloja.com.br",
      status: "active",
      createdAt: "15/10/2023",
      callbacks: {
        credit: "https://minhaloja.com.br/api/callbacks/credit",
        debit: "https://minhaloja.com.br/api/callbacks/debit",
        boleto: "https://minhaloja.com.br/api/callbacks/boleto",
        webhook: "https://minhaloja.com.br/api/webhooks",
        securityKey: "f7d3s8h1j5k9l2m6n4p0",
      },
    },
    {
      id: "loja_id_67890",
      name: "Loja Secundária",
      url: "https://www.segunda.minhaloja.com.br",
      status: "active",
      createdAt: "20/11/2023",
      callbacks: {
        credit: "https://segunda.minhaloja.com.br/api/callbacks/credit",
        debit: "https://segunda.minhaloja.com.br/api/callbacks/debit",
        boleto: "https://segunda.minhaloja.com.br/api/callbacks/boleto",
        webhook: "https://segunda.minhaloja.com.br/api/webhooks",
        securityKey: "a2b4c6d8e0f1g3h5i7j9",
      },
    },
  ]);

  const openNotification = () => {
    api.success({
      message: `Sucesso`,
      description: `Texto copiado para a área de transferência!`,
      placement: "topRight",
    });
  };

  const handleCopy = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].select();
      document.execCommand("copy");
      openNotification();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const updateCallbackField = (commerceId, field, value) => {
    setCommerces((prevCommerces) =>
      prevCommerces.map((commerce) =>
        commerce.id === commerceId
          ? {
              ...commerce,
              callbacks: {
                ...commerce.callbacks,
                [field]: value,
              },
            }
          : commerce
      )
    );
  };

  // Componente para campos de configuração
  const ConfigField = ({
    label,
    value,
    refIndex,
    isPassword = false,
    hint,
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
            className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
            readOnly
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

  // Componente para URL de callback
  const CallbackField = ({ label, placeholder, value, onChange, hint }) => (
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
        <input
          type="text"
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          className="px-3 py-2 rounded-md border border-base-300 bg-base-200 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all placeholder:text-base-content/40"
        />
      </label>
    </div>
  );

  // Tabs para navegação
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
                value="c7d9ea7e-51d9-4dce-8bb7-992a35287b1d"
                refIndex={0}
                hint="Identificador único do seu cliente na API"
              />

              <ConfigField
                label="Client Secret"
                value="8f7h3k2j5h6g7f8d9s0a1p2o3i9u8y7t"
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
                value="https://api.pulsepay.com.br/v1"
                refIndex={2}
                hint="URL base para todas as requisições à API"
              />
            </div>
          </div>
        )}

        {/* E-Commerce Tab Content */}
        {activeTab === "ecommerce" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-base-200/50 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <IdentificationIcon className="w-5 h-5 mr-2 text-primary" />
                Identificação no E-Commerce
              </h2>

              <ConfigField
                label="Identificador de Loja"
                value="seller_id_12345"
                refIndex={3}
                hint="Identificador único da sua loja no PulsePay"
              />

              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4">
                  Comércios cadastrados
                </h3>

                <div className="overflow-x-auto">
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
                              <CheckCircleIcon className="w-3 h-3" /> Ativo
                            </span>
                          </td>
                          <td>{commerce.createdAt}</td>
                          <td>
                            <div className="flex space-x-2">
                              <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => {
                                  setSelectedCommerce(commerce);
                                  setActiveTab("callback");
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
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="btn btn-primary btn-sm">
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    Adicionar Comércio
                  </button>
                </div>
              </div>
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
                    value={selectedCommerce?.callbacks?.credit}
                    onChange={(e) =>
                      updateCallbackField(
                        selectedCommerce.id,
                        "credit",
                        e.target.value
                      )
                    }
                    hint="Receberá notificações sobre transações de crédito"
                  />

                  <CallbackField
                    label="Pagamento de débito"
                    placeholder="https://seu_registro/seu_servico_de_pagamento_de_debito"
                    value={selectedCommerce?.callbacks?.debit}
                    onChange={(e) =>
                      updateCallbackField(
                        selectedCommerce.id,
                        "debit",
                        e.target.value
                      )
                    }
                    hint="Receberá notificações sobre transações de débito"
                  />

                  <CallbackField
                    label="Registro/Baixa do Boleto"
                    placeholder="https://seu_registro/seu_servico_de_boleto"
                    value={selectedCommerce?.callbacks?.boleto}
                    onChange={(e) =>
                      updateCallbackField(
                        selectedCommerce.id,
                        "boleto",
                        e.target.value
                      )
                    }
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
                    onChange={(e) =>
                      updateCallbackField(
                        selectedCommerce.id,
                        "webhook",
                        e.target.value
                      )
                    }
                    hint="URL para receber todos os eventos da plataforma"
                  />

                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">
                      Chave de segurança
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="password"
                        value={selectedCommerce?.callbacks?.securityKey || ""}
                        onChange={(e) =>
                          updateCallbackField(
                            selectedCommerce.id,
                            "securityKey",
                            e.target.value
                          )
                        }
                        className="px-3 py-2 rounded-md border border-base-300 bg-base-200 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all"
                      />
                      <button className="btn btn-ghost btn-sm ml-2">
                        <EyeIcon className="w-5 h-5" />
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
          <button className="btn btn-primary">Salvar Configurações</button>
        </div>
      </Container>
    </div>
  );
};

export default UserConfig;
