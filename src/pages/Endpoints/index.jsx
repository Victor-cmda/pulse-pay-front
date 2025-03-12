import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  ExternalLink,
  Globe,
  Key,
  Lock,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ApiDocumentation = () => {
  const [expandedSection, setExpandedSection] = useState("introduction");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Você pode adicionar feedback visual aqui
  };

  const endpoints = [
    {
      id: "introduction",
      title: "Introdução",
      description: "Visão geral da API e como começar",
      endpoints: [
        {
          id: "overview",
          method: "",
          path: "Visão Geral",
          description: "Informações gerais sobre a API PulsePay",
          content: true,
        },
        {
          id: "getting-started",
          method: "",
          path: "Começando",
          description: "Guia passo a passo para começar a utilizar a API",
          content: true,
        },
        {
          id: "authentication-overview",
          method: "",
          path: "Autenticação",
          description: "Visão geral do processo de autenticação",
          content: true,
        },
      ],
    },
    {
      id: "authentication",
      title: "Autenticação",
      description: "Obtenha tokens de acesso para autenticação nas APIs",
      endpoints: [
        {
          id: "generateToken",
          method: "POST",
          path: "/oauth/v2/token",
          description:
            "Gera um token de acesso OAuth 2.0 através de credenciais do cliente",
          authentication: "Basic Auth (Client ID e Client Secret)",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                "Basic authentication com Client ID e Client Secret codificados em Base64",
            },
          ],
          responses: [
            {
              status: 200,
              description: "Token gerado com sucesso",
              example: {
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                token_type: "Bearer",
                expires_in: 3600,
              },
            },
            {
              status: 401,
              description: "Credenciais inválidas ou ausentes",
              example: { message: "Invalid credentials" },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/oauth/v2/token \\
-H "Authorization: Basic eW91cl9jbGllbnRfaWQ6eW91cl9jbGllbnRfc2VjcmV0" \\
-H "Content-Type: application/json"`,
        },
      ],
    },
    {
      id: "payments",
      title: "Pagamentos",
      description: "Endpoints para geração e consulta de pagamentos",
      endpoints: [
        {
          id: "pixPayment",
          method: "POST",
          path: "/pix",
          description: "Gera um pagamento via PIX",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "amount",
                type: "number",
                required: true,
                description: "Valor do pagamento",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description: "Descrição do pagamento",
              },
              {
                name: "expirationDate",
                type: "string",
                required: false,
                description:
                  "Data de expiração do pagamento (formato ISO 8601)",
              },
              {
                name: "callbackUrl",
                type: "string",
                required: false,
                description:
                  "URL para receber notificações de status do pagamento",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description: "Pagamento processado com sucesso",
              example: {
                message: "Pagamento processado com sucesso",
                details: {
                  paymentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  qrCode:
                    "00020101021226890014br.gov.bcb.pix2557brcode.example.com/pix/v2/cobv/9d36b84fc70b428ca84f8cc95e9ac3a4...",
                },
              },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: { error: "Invalid request parameters" },
            },
            {
              status: 401,
              description: "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/pix \\
-H "Authorization: Bearer your_access_token" \\
-H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
-H "Content-Type: application/json" \\
-d '{
  "amount": 100.50,
  "description": "Pagamento de serviço",
  "expirationDate": "2023-12-31T23:59:59Z",
  "callbackUrl": "https://your-callback-url.com/notifications"
}'`,
        },
        {
          id: "boletoPayment",
          method: "POST",
          path: "/boleto",
          description: "Gera um pagamento via boleto bancário",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "amount",
                type: "number",
                required: true,
                description: "Valor do boleto",
              },
              {
                name: "dueDate",
                type: "string",
                required: true,
                description: "Data de vencimento do boleto (formato ISO 8601)",
              },
              {
                name: "customer",
                type: "object",
                required: true,
                description: "Dados do cliente",
                properties: [
                  {
                    name: "name",
                    type: "string",
                    required: true,
                    description: "Nome completo do cliente",
                  },
                  {
                    name: "document",
                    type: "string",
                    required: true,
                    description: "CPF ou CNPJ do cliente",
                  },
                  {
                    name: "email",
                    type: "string",
                    required: false,
                    description: "E-mail do cliente",
                  },
                  {
                    name: "address",
                    type: "object",
                    required: false,
                    description: "Endereço do cliente",
                  },
                ],
              },
              {
                name: "description",
                type: "string",
                required: true,
                description: "Descrição do pagamento",
              },
              {
                name: "callbackUrl",
                type: "string",
                required: false,
                description:
                  "URL para receber notificações de status do pagamento",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description: "Boleto gerado com sucesso",
              example: {
                message: "Pagamento processado com sucesso",
                details: {
                  boletoId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  boletoUrl:
                    "https://api.example.com/boleto/3fa85f64-5717-4562-b3fc-2c963f66afa6/pdf",
                  barCode: "23790123016789123456789123456789123456789123",
                },
              },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: { error: "Invalid request parameters" },
            },
            {
              status: 401,
              description: "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/boleto \\
-H "Authorization: Bearer your_access_token" \\
-H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
-H "Content-Type: application/json" \\
-d '{
  "amount": 150.99,
  "dueDate": "2023-12-31",
  "customer": {
    "name": "João Silva",
    "document": "12345678900",
    "email": "joao@example.com",
    "address": {
      "street": "Rua Exemplo",
      "number": "123",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567"
    }
  },
  "description": "Fatura mensal",
  "callbackUrl": "https://your-callback-url.com/notifications"
}'`,
        },
        {
          id: "boletoPdf",
          method: "GET",
          path: "/boleto/{id}/pdf",
          description: "Obtém o arquivo PDF de um boleto bancário",
          authentication: "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "string",
              description: "ID do boleto a ser recuperado",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description: "PDF do boleto",
              example: "Arquivo PDF binário",
            },
            {
              status: 404,
              description: "Boleto não encontrado",
              example: { error: "Boleto not found" },
            },
            {
              status: 401,
              description: "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample: `curl -X GET https://api.example.com/boleto/3fa85f64-5717-4562-b3fc-2c963f66afa6/pdf \\
-H "Authorization: Bearer your_access_token" \\
-H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
--output boleto.pdf`,
        },
      ],
    },
    {
      id: "pixOperations",
      title: "Operações PIX",
      description: "Validação e gerenciamento de operações com chaves PIX",
      endpoints: [
        {
          id: "validatePixKey",
          method: "POST",
          path: "/validate",
          description: "Valida uma chave PIX",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "pixKey",
                type: "string",
                required: true,
                description: "Chave PIX a ser validada",
              },
              {
                name: "pixKeyType",
                type: "string",
                required: true,
                description:
                  "Tipo da chave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description: "Chave PIX validada com sucesso",
              example: {
                success: true,
                data: {
                  isValid: true,
                  accountHolderName: "João Silva",
                  bankName: "Banco Exemplo",
                  bankCode: "123",
                },
              },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: { success: false, message: "Chave PIX inválida" },
            },
            {
              status: 401,
              description: "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/validate \\
-H "Authorization: Bearer your_access_token" \\
-H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
-H "Content-Type: application/json" \\
-d '{
  "pixKey": "12345678900",
  "pixKeyType": "CPF"
}'`,
        },
        {
          id: "createPayment",
          method: "POST",
          path: "/payment",
          description: "Cria um pagamento PIX para uma chave PIX",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "pixKey",
                type: "string",
                required: true,
                description: "Chave PIX do destinatário",
              },
              {
                name: "pixKeyType",
                type: "string",
                required: true,
                description:
                  "Tipo da chave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
              },
              {
                name: "amount",
                type: "number",
                required: true,
                description: "Valor do pagamento",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description: "Descrição do pagamento",
              },
              {
                name: "recipientName",
                type: "string",
                required: false,
                description:
                  "Nome do destinatário (opcional, será preenchido automaticamente se a chave for válida)",
              },
            ],
          },
          responses: [
            {
              status: 201,
              description: "Pagamento criado com sucesso",
              example: {
                success: true,
                data: {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  pixKey: "12345678900",
                  pixKeyType: "CPF",
                  amount: 100.0,
                  status: "PENDING",
                  createdAt: "2023-04-10T15:30:45Z",
                },
              },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: {
                success: false,
                message: "Parâmetros de solicitação inválidos",
              },
            },
            {
              status: 401,
              description: "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
            {
              status: 409,
              description: "Conflito",
              example: {
                success: false,
                message: "Já existe um pagamento com essas características",
              },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/payment \\
-H "Authorization: Bearer your_access_token" \\
-H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
-H "Content-Type: application/json" \\
-d '{
  "pixKey": "12345678900",
  "pixKeyType": "CPF",
  "amount": 100.0,
  "description": "Pagamento para João Silva"
}'`,
        },
        {
          id: "getPayment",
          method: "GET",
          path: "/{id}",
          description: "Consulta detalhes de um pagamento PIX",
          authentication: "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "string",
              description: "ID do pagamento no formato GUID",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description: "Detalhes do pagamento",
              example: {
                success: true,
                data: {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  pixKey: "12345678900",
                  pixKeyType: "CPF",
                  amount: 100.0,
                  status: "COMPLETED",
                  createdAt: "2023-04-10T15:30:45Z",
                  completedAt: "2023-04-10T15:35:22Z",
                },
              },
            },
            {
              status: 404,
              description: "Pagamento não encontrado",
              example: { success: false, message: "Pagamento não encontrado" },
            },
            {
              status: 401,
              description: "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample: `curl -X GET https://api.example.com/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
-H "Authorization: Bearer your_access_token" \\
-H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
      ],
    },
  ];

  // Filtra os endpoints com base no termo de pesquisa
  const filteredEndpoints = endpoints
    .map((section) => {
      const filteredEndpointsInSection = section.endpoints.filter(
        (endpoint) =>
          endpoint.content || // Sempre inclui itens de conteúdo na busca
          endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
          endpoint.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          endpoint.method.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        ...section,
        endpoints: filteredEndpointsInSection,
        visible: filteredEndpointsInSection.length > 0,
      };
    })
    .filter((section) => section.visible);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Documentação da API
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Guia completo para integrar com nossas APIs de pagamentos
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar endpoints..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com menu lateral */}
        <div className="hidden lg:block">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sticky top-4">
            <h3 className="text-md font-semibold mb-4 text-slate-800 dark:text-white">
              Conteúdo
            </h3>
            <ul className="space-y-1">
              {endpoints.map((section) => (
                <li key={section.id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      expandedSection === section.id
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center">
                      {expandedSection === section.id ? (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-2" />
                      )}
                      {section.title}
                    </div>
                  </button>

                  {expandedSection === section.id && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {section.endpoints.map((endpoint) => (
                        <li key={endpoint.id}>
                          <a
                            href={`#${endpoint.id}`}
                            className="block px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400"
                          >
                            {endpoint.content ? (
                              // Para itens informativos (sem método HTTP)
                              <span>{endpoint.path}</span>
                            ) : (
                              // Para endpoints reais da API
                              <>
                                <span className="inline-block w-14 px-2 py-0.5 text-xs font-medium rounded-full mr-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
                                  {endpoint.method}
                                </span>
                                {endpoint.path}
                              </>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3 space-y-8">
          {/* Renderização do conteúdo principal e endpoints */}
          {filteredEndpoints.length > 0 ? (
            filteredEndpoints.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-10">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                  {section.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {section.description}
                </p>

                <div className="space-y-6">
                  {section.endpoints.map((endpoint) => {
                    // Renderização condicional baseada no tipo de endpoint
                    if (endpoint.content) {
                      // Renderiza itens de conteúdo informativo
                      return (
                        <Card
                          key={endpoint.id}
                          id={endpoint.id}
                          className="scroll-mt-20 mb-6"
                        >
                          <CardHeader>
                            <CardTitle>{endpoint.path}</CardTitle>
                            <CardDescription>
                              {endpoint.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {/* Conteúdo específico para cada seção de introdução */}
                            {endpoint.id === "overview" && (
                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                    O que é a API PulsePay?
                                  </h3>
                                  <p className="text-slate-700 dark:text-slate-300">
                                    A API PulsePay é uma solução completa para
                                    processamento de pagamentos que permite
                                    integrar múltiplas formas de pagamento ao
                                    seu sistema, site ou aplicativo. Nossa API é
                                    RESTful, usa JSON para formatação de dados e
                                    segue padrões modernos de autenticação OAuth
                                    2.0.
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-emerald-600 dark:text-emerald-400"
                                      >
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                      </svg>
                                    </div>
                                    <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">
                                      Fácil Integração
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                      Design intuitivo que permite implementação
                                      rápida em qualquer plataforma ou linguagem
                                      de programação.
                                    </p>
                                  </div>

                                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-blue-600 dark:text-blue-400"
                                      >
                                        <rect
                                          x="3"
                                          y="11"
                                          width="18"
                                          height="11"
                                          rx="2"
                                          ry="2"
                                        ></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                      </svg>
                                    </div>
                                    <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">
                                      Segurança Avançada
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                      Transações protegidas com criptografia,
                                      autenticação OAuth e conformidade com
                                      padrões PCI.
                                    </p>
                                  </div>

                                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-purple-600 dark:text-purple-400"
                                      >
                                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                        <polyline points="2 17 12 22 22 17"></polyline>
                                        <polyline points="2 12 12 17 22 12"></polyline>
                                      </svg>
                                    </div>
                                    <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">
                                      Múltiplos Métodos
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                      Suporte a diversos métodos de pagamento,
                                      incluindo PIX, boletos bancários e
                                      transferências.
                                    </p>
                                  </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                    Principais recursos
                                  </h3>
                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                    <li className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      Geração de pagamentos PIX instantâneos
                                    </li>
                                    <li className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      Emissão de boletos bancários
                                    </li>
                                    <li className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      Validação de chaves PIX
                                    </li>
                                    <li className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      Notificações de status de pagamento em
                                      tempo real
                                    </li>
                                    <li className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      Consulta de status de transações
                                    </li>
                                    <li className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      Ambiente de sandbox para testes
                                    </li>
                                  </ul>
                                </div>

                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                  <h4 className="text-md font-medium text-indigo-900 dark:text-indigo-300 mb-2">
                                    Precisa de ajuda?
                                  </h4>
                                  <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-3">
                                    Nossa equipe de suporte está disponível para
                                    ajudá-lo com qualquer dúvida sobre a
                                    integração.
                                  </p>
                                  <button className="inline-flex items-center text-sm font-medium text-white dark:text-indigo-900 bg-indigo-600 dark:bg-indigo-400 hover:bg-indigo-700 dark:hover:bg-indigo-300 transition-colors px-3 py-1.5 rounded-md">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1.5"
                                    >
                                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    Falar com o Suporte
                                  </button>
                                </div>
                              </div>
                            )}

                            {endpoint.id === "getting-started" && (
                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                    Começando a usar
                                  </h3>
                                  <p className="text-slate-700 dark:text-slate-300">
                                    Este guia ajudará você a configurar e
                                    começar a usar a API PulsePay para processar
                                    pagamentos em sua aplicação.
                                  </p>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                                      1
                                    </div>
                                    <div>
                                      <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
                                        Solicite suas credenciais
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        Entre em contato com nosso time
                                        comercial para obter seu Client ID e
                                        Client Secret. Estas credenciais são
                                        necessárias para autenticar suas
                                        solicitações à API.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                                      2
                                    </div>
                                    <div>
                                      <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
                                        Faça testes no ambiente Sandbox
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        Use nossas APIs de teste para validar
                                        sua integração antes de ir para
                                        produção. O ambiente sandbox permite
                                        simular transações sem processá-las
                                        realmente.
                                      </p>
                                      <div className="mt-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                                          URL Sandbox:{" "}
                                          <code>
                                            https://sandbox.pulsepay.com.br
                                          </code>
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                                      3
                                    </div>
                                    <div>
                                      <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
                                        Autentique-se
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        Use o endpoint{" "}
                                        <code>/oauth/v2/token</code> para gerar
                                        um token de acesso. O token JWT gerado
                                        deve ser incluído em todas as
                                        solicitações subsequentes.
                                      </p>
                                      <div className="mt-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                                          Authorization: Bearer {"{token}"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                                      4
                                    </div>
                                    <div>
                                      <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
                                        Integre com sua aplicação
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        Siga a documentação de referência para
                                        implementar os endpoints necessários.
                                        Você pode começar com fluxos simples
                                        como geração de PIX ou boletos.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                                      5
                                    </div>
                                    <div>
                                      <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
                                        Vá para produção
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        Após completar seus testes, atualize
                                        suas credenciais para o ambiente de
                                        produção. Certifique-se de que todas as
                                        implementações foram testadas
                                        adequadamente.
                                      </p>
                                      <div className="mt-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                                          URL Produção:{" "}
                                          <code>
                                            https://api.pulsepay.com.br
                                          </code>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
                                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                                    SDKs em Desenvolvimento
                                  </h4>
                                  <div className="flex items-start space-x-3">
                                    <div className="mt-1 text-amber-500 dark:text-amber-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line
                                          x1="12"
                                          y1="9"
                                          x2="12"
                                          y2="13"
                                        ></line>
                                        <line
                                          x1="12"
                                          y1="17"
                                          x2="12.01"
                                          y2="17"
                                        ></line>
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                        Nossas bibliotecas SDK e plugins para
                                        integração estão atualmente em
                                        desenvolvimento.
                                      </p>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        Estamos trabalhando para disponibilizar
                                        SDKs para as principais linguagens de
                                        programação e plugins para plataformas
                                        de e-commerce populares. Enquanto isso,
                                        você pode utilizar diretamente nossa API
                                        REST com as instruções desta
                                        documentação.
                                      </p>
                                      <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                                        Acompanhe nossas atualizações para saber
                                        quando os SDKs estarão disponíveis.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {endpoint.id === "authentication-overview" && (
                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                    Visão Geral da Autenticação
                                  </h3>
                                  <p className="text-slate-700 dark:text-slate-300">
                                    A API PulsePay utiliza o padrão OAuth 2.0
                                    para autenticação, garantindo segurança nas
                                    interações com os endpoints. Você precisará
                                    obter um token de acesso JWT que deverá ser
                                    incluído em todas as requisições.
                                  </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                                    Fluxo de Autenticação
                                  </h4>
                                  <ol className="space-y-3">
                                    <li className="flex items-start">
                                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-3">
                                        1
                                      </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        Envie suas credenciais (Client ID e
                                        Client Secret) para o endpoint{" "}
                                        <code>/oauth/v2/token</code> usando
                                        autenticação Basic.
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-3">
                                        2
                                      </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        Receba um token JWT válido que será
                                        usado para autenticar as requisições
                                        subsequentes.
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-3">
                                        3
                                      </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        Inclua o token no cabeçalho{" "}
                                        <code>Authorization</code> de todas as
                                        requisições no formato{" "}
                                        <code>Bearer {"{token}"}</code>.
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-3">
                                        4
                                      </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        Inclua o ID do vendedor no cabeçalho{" "}
                                        <code>SellerId</code> em todas as
                                        requisições.
                                      </span>
                                    </li>
                                  </ol>
                                </div>

                                <div>
                                  <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">
                                    Segurança do Token
                                  </h4>
                                  <ul className="space-y-2">
                                    <li className="flex items-start">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        O token JWT tem validade de 1 hora
                                        (3.600 segundos).
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        Armazene de forma segura seu Client ID e
                                        Client Secret.
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        Renove o token automaticamente antes que
                                        expire para evitar falhas nas
                                        requisições.
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        Nunca compartilhe seus tokens ou
                                        credenciais em código do lado do
                                        cliente.
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-2"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <line
                                        x1="12"
                                        y1="16"
                                        x2="12"
                                        y2="12"
                                      ></line>
                                      <line
                                        x1="12"
                                        y1="8"
                                        x2="12.01"
                                        y2="8"
                                      ></line>
                                    </svg>
                                    Exemplo de Autenticação
                                  </h4>
                                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                                    Veja um exemplo de como obter o token de
                                    autenticação:
                                  </p>
                                  <div className="bg-slate-800 text-slate-300 p-3 rounded-lg overflow-x-auto">
                                    <pre className="text-xs font-mono whitespace-pre-wrap">
                                      {`curl -X POST https://api.pulsepay.com.br/oauth/v2/token \\
-H "Authorization: Basic $(echo -n 'your_client_id:your_client_secret' | base64)" \\
-H "Content-Type: application/json"`}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    } else {
                      // Renderiza endpoints técnicos da API
                      return (
                        <Card
                          key={endpoint.id}
                          id={endpoint.id}
                          className="scroll-mt-20 border-l-4 border-l-indigo-500"
                        >
                          <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <CardTitle className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-bold rounded-md ${
                                    endpoint.method === "GET"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                      : endpoint.method === "POST"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : endpoint.method === "PUT"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                      : endpoint.method === "DELETE"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                      : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                  }`}
                                >
                                  {endpoint.method}
                                </span>
                                <span className="font-mono">
                                  {endpoint.path}
                                </span>
                              </CardTitle>

                              <div className="flex items-center gap-2">
                                <div className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md">
                                  {endpoint.authentication}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(endpoint.requestExample)
                                  }
                                  className="h-7 px-2"
                                >
                                  <Copy className="h-3.5 w-3.5 mr-1" />
                                  <span className="text-xs">Copiar</span>
                                </Button>
                              </div>
                            </div>
                            <CardDescription>
                              {endpoint.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-6">
                            {/* Parâmetros */}
                            {endpoint.parameters &&
                              endpoint.parameters.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-3 text-slate-800 dark:text-white">
                                    Parâmetros de URL
                                  </h4>
                                  <div className="overflow-auto">
                                    <table className="w-full border-collapse">
                                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr className="text-xs text-slate-500 dark:text-slate-400 text-left">
                                          <th className="px-4 py-2 font-medium">
                                            Nome
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            Localização
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            Tipo
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            Obrigatório
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            Descrição
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {endpoint.parameters.map(
                                          (param, index) => (
                                            <tr key={index} className="text-sm">
                                              <td className="px-4 py-2 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                                                {param.name}
                                              </td>
                                              <td className="px-4 py-2">
                                                {param.in}
                                              </td>
                                              <td className="px-4 py-2">
                                                {param.type}
                                              </td>
                                              <td className="px-4 py-2">
                                                {param.required ? (
                                                  <span className="text-green-600 dark:text-green-400">
                                                    Sim
                                                  </span>
                                                ) : (
                                                  <span className="text-slate-500 dark:text-slate-400">
                                                    Não
                                                  </span>
                                                )}
                                              </td>
                                              <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                                                {param.description}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                            {/* Headers */}
                            {endpoint.headers &&
                              endpoint.headers.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-3 text-slate-800 dark:text-white">
                                    Headers
                                  </h4>
                                  <div className="overflow-auto">
                                    <table className="w-full border-collapse">
                                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr className="text-xs text-slate-500 dark:text-slate-400 text-left">
                                          <th className="px-4 py-2 font-medium">
                                            Nome
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            Obrigatório
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            Tipo
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            Descrição
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {endpoint.headers.map(
                                          (header, index) => (
                                            <tr key={index} className="text-sm">
                                              <td className="px-4 py-2 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                                                {header.name}
                                              </td>
                                              <td className="px-4 py-2">
                                                {header.required ? (
                                                  <span className="text-green-600 dark:text-green-400">
                                                    Sim
                                                  </span>
                                                ) : (
                                                  <span className="text-slate-500 dark:text-slate-400">
                                                    Não
                                                  </span>
                                                )}
                                              </td>
                                              <td className="px-4 py-2">
                                                {header.type}
                                              </td>
                                              <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                                                {header.description}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                            {/* Body Parameters */}
                            {endpoint.body && (
                              <div>
                                <h4 className="text-sm font-medium mb-3 text-slate-800 dark:text-white">
                                  Body
                                </h4>
                                <div className="overflow-auto">
                                  <table className="w-full border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                      <tr className="text-xs text-slate-500 dark:text-slate-400 text-left">
                                        <th className="px-4 py-2 font-medium">
                                          Nome
                                        </th>
                                        <th className="px-4 py-2 font-medium">
                                          Tipo
                                        </th>
                                        <th className="px-4 py-2 font-medium">
                                          Obrigatório
                                        </th>
                                        <th className="px-4 py-2 font-medium">
                                          Descrição
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                      {endpoint.body.properties.map(
                                        (prop, index) => (
                                          <tr key={index} className="text-sm">
                                            <td className="px-4 py-2 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                                              {prop.name}
                                            </td>
                                            <td className="px-4 py-2">
                                              {prop.type}
                                            </td>
                                            <td className="px-4 py-2">
                                              {prop.required ? (
                                                <span className="text-green-600 dark:text-green-400">
                                                  Sim
                                                </span>
                                              ) : (
                                                <span className="text-slate-500 dark:text-slate-400">
                                                  Não
                                                </span>
                                              )}
                                            </td>
                                            <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                                              {prop.description}
                                              {prop.properties && (
                                                <div className="mt-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                                                  <h6 className="text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">
                                                    Propriedades:
                                                  </h6>
                                                  <ul className="space-y-1">
                                                    {prop.properties.map(
                                                      (subProp, subIndex) => (
                                                        <li
                                                          key={subIndex}
                                                          className="text-xs"
                                                        >
                                                          <span className="font-mono text-indigo-700 dark:text-indigo-400">
                                                            {subProp.name}
                                                          </span>
                                                          <span className="text-slate-500 dark:text-slate-400">
                                                            {" "}
                                                            ({subProp.type})
                                                          </span>
                                                          {subProp.required && (
                                                            <span className="text-amber-600 dark:text-amber-400">
                                                              {" "}
                                                              *
                                                            </span>
                                                          )}
                                                          <span className="text-slate-700 dark:text-slate-300">
                                                            {" "}
                                                            -{" "}
                                                            {
                                                              subProp.description
                                                            }
                                                          </span>
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Exemplo de Requisição */}
                            <div>
                              <h4 className="text-sm font-medium mb-3 text-slate-800 dark:text-white">
                                Exemplo de Requisição
                              </h4>
                              <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto">
                                <pre className="text-xs font-mono whitespace-pre-wrap">
                                  {endpoint.requestExample}
                                </pre>
                              </div>
                            </div>

                            {/* Respostas */}
                            <div>
                              <h4 className="text-sm font-medium mb-3 text-slate-800 dark:text-white">
                                Respostas
                              </h4>
                              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {endpoint.responses.map((response, index) => (
                                  <div key={index} className="py-3">
                                    <div className="flex items-center mb-2">
                                      <span
                                        className={`inline-block px-2 py-1 text-xs font-medium rounded-md mr-2 ${
                                          response.status >= 200 &&
                                          response.status < 300
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : response.status >= 400 &&
                                              response.status < 500
                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                      >
                                        {response.status}
                                      </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {response.description}
                                      </span>
                                    </div>
                                    {response.example &&
                                      typeof response.example !== "string" && (
                                        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg overflow-x-auto">
                                          <pre className="text-xs font-mono whitespace-pre-wrap text-slate-800 dark:text-slate-300">
                                            {JSON.stringify(
                                              response.example,
                                              null,
                                              2
                                            )}
                                          </pre>
                                        </div>
                                      )}
                                    {response.example &&
                                      typeof response.example === "string" && (
                                        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg overflow-x-auto">
                                          <p className="text-xs text-slate-800 dark:text-slate-300">
                                            {response.example}
                                          </p>
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                Nenhum endpoint encontrado
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Não encontramos nenhum endpoint com os critérios de busca
                atuais.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Seção de conceitos e termos */}
          <Card id="concepts">
            <CardHeader>
              <CardTitle>Conceitos e Termos</CardTitle>
              <CardDescription>
                Termos e conceitos importantes para entender a API de pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    PIX
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    Sistema de pagamentos instantâneos desenvolvido pelo Banco
                    Central do Brasil. Permite transferências e pagamentos em
                    segundos, a qualquer hora do dia, todos os dias do ano.
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    Boleto Bancário
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    Método de pagamento brasileiro onde o cliente recebe um
                    documento com código de barras que pode ser pago em bancos,
                    correspondentes bancários, caixas eletrônicos ou internet
                    banking.
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    Chave PIX
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    Identificador usado para receber pagamentos PIX. Pode ser
                    CPF/CNPJ, e-mail, número de telefone ou uma chave aleatória.
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    OAuth 2.0
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    Protocolo de autorização que permite que aplicativos
                    obtenham acesso limitado a contas de usuários em um serviço
                    HTTP. Nossa API utiliza tokens JWT para autenticação.
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    Bearer Token
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    Tipo de token de acesso OAuth 2.0 onde o portador (bearer)
                    do token tem acesso aos recursos protegidos.
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    SellerId
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    Identificador único do vendedor ou lojista na plataforma.
                    Este valor deve ser enviado em todas as requisições no
                    cabeçalho.
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* SDKs e Integrações */}
          <Card id="sdks">
            <CardHeader>
              <CardTitle>SDKs e Integrações</CardTitle>
              <CardDescription>
                Bibliotecas e ferramentas para facilitar a integração com nossa
                API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="#"
                  className="block p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    SDK para C#
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Biblioteca oficial para integração com .NET Core e .NET
                    Framework
                  </p>
                  <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ver documentação
                  </div>
                </a>

                <a
                  href="#"
                  className="block p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    SDK para PHP
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Biblioteca oficial para integração com PHP 7.4+
                  </p>
                  <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ver documentação
                  </div>
                </a>

                <a
                  href="#"
                  className="block p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    SDK para JavaScript
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Biblioteca oficial para Node.js e browsers
                  </p>
                  <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ver documentação
                  </div>
                </a>
              </div>

              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  SDKs em Desenvolvimento
                </h4>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-amber-500 dark:text-amber-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      Nossas bibliotecas SDK e plugins para integração estão
                      atualmente em desenvolvimento.
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Estamos trabalhando para disponibilizar SDKs para as
                      principais linguagens de programação e plugins para
                      plataformas de e-commerce populares. Enquanto isso, você
                      pode utilizar diretamente nossa API REST com as instruções
                      desta documentação.
                    </p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                      Acompanhe nossas atualizações para saber quando os SDKs
                      estarão disponíveis.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suporte e Contato */}
          <Card id="support">
            <CardHeader>
              <CardTitle>Suporte e Contato</CardTitle>
              <CardDescription>
                Obtenha ajuda com a integração e uso de nossa API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                    Suporte Técnico
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                    Nossa equipe de suporte técnico está disponível para ajudar
                    com questões de integração e problemas técnicos.
                  </p>
                  <a
                    href="mailto:suporte@pulsepay.com.br"
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-medium"
                  >
                    suporte@pulsepay.com.br
                  </a>
                </div>

                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                    Documentação Completa
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                    Acesse nossa documentação completa, incluindo guias passo a
                    passo e tutoriais detalhados.
                  </p>
                  <a
                    href="#"
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-medium"
                  >
                    docs.pulsepay.com.br
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
