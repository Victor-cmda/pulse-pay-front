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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "../../context/LanguageContext";

const ApiDocumentation = () => {
  const { t, language, setLanguage, languages } = useLanguage();
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
      title: t.introduction.title,
      description: t.introduction.description,
      endpoints: [
        {
          id: "overview",
          method: "",
          path: t.introduction.overview.path,
          description: t.introduction.overview.description,
          content: true,
        },
        {
          id: "getting-started",
          method: "",
          path: t.introduction.gettingStarted.path,
          description: t.introduction.gettingStarted.description,
          content: true,
        },
        {
          id: "authentication-overview",
          method: "",
          path: t.introduction.authentication.path,
          description: t.introduction.authentication.description,
          content: true,
        },
      ],
    },
    {
      id: "authentication",
      title: t.authentication.title,
      description: t.authentication.description,
      endpoints: [
        {
          id: "generateToken",
          method: "POST",
          path: "/oauth/v2/token",
          description: t.authentication.steps.step1,
          authentication: t.authentication.title,
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: t.authentication.steps.step1,
            },
          ],
          responses: [
            {
              status: 200,
              description: t.apiEndpoints.responses,
              example: {
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                token_type: "Bearer",
                expires_in: 3600,
              },
            },
            {
              status: 401,
              description: t.authentication.steps.step2,
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
      title: t.concepts.pix.title,
      description: t.mainFeatures.pixPayments,
      endpoints: [
        {
          id: "pixPayment",
          method: "POST",
          path: "/pix",
          description: t.mainFeatures.pixPayments,
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: t.authentication.steps.step3,
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: t.concepts.sellerId.description,
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
                description: t.apiEndpoints.body,
              },
              {
                name: "description",
                type: "string",
                required: true,
                description: t.apiEndpoints.body,
              },
              {
                name: "expirationDate",
                type: "string",
                required: false,
                description: "ISO 8601",
              },
              {
                name: "callbackUrl",
                type: "string",
                required: false,
                description: t.mainFeatures.paymentNotifications,
              },
            ],
          },
          responses: [
            {
              status: 200,
              description: t.apiEndpoints.responses,
              example: {
                message: t.apiEndpoints.responses,
                details: {
                  paymentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  qrCode:
                    "00020101021226890014br.gov.bcb.pix2557brcode.example.com/pix/v2/cobv/9d36b84fc70b428ca84f8cc95e9ac3a4...",
                },
              },
            },
            {
              status: 400,
              description: t.apiEndpoints.responses,
              example: { error: "Invalid request parameters" },
            },
            {
              status: 401,
              description: t.authentication.steps.step2,
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/pix \\
-H "Authorization: Bearer your_access_token" \\
-H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
-H "Content-Type: application/json" \\
-d '{
  "amount": 100.50,
  "description": "${t.mainFeatures.pixPayments}",
  "expirationDate": "2023-12-31T23:59:59Z",
  "callbackUrl": "https://your-callback-url.com/notifications"
}'`,
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
          (endpoint.method &&
            endpoint.method.toLowerCase().includes(searchTerm.toLowerCase()))
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
            {t.header.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {t.header.subtitle}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={t.common.search}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <Globe className="h-5 w-5" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {languages.map((lang) => (
                <li key={lang.value}>
                  <button
                    onClick={() => setLanguage(lang.value)}
                    className={`flex items-center ${
                      language === lang.value ? "active font-medium" : ""
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com menu lateral */}
        <div className="hidden lg:block">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sticky top-4">
            <h3 className="text-md font-semibold mb-4 text-slate-800 dark:text-white">
              {t.common.content}
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
                                    {t.introduction.overview.title}
                                  </h3>
                                  <p className="text-slate-700 dark:text-slate-300">
                                    {t.introduction.overview.content}
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
                                      {t.features.easyIntegration.title}
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                      {t.features.easyIntegration.content}
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
                                      {t.features.advancedSecurity.title}
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                      {t.features.advancedSecurity.content}
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
                                      {t.features.multipleMethods.title}
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                      {t.features.multipleMethods.content}
                                    </p>
                                  </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                    {t.mainFeatures.title}
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
                                      {t.mainFeatures.pixPayments}
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
                                      {t.mainFeatures.bankSlips}
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
                                      {t.mainFeatures.pixKeyValidation}
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
                                      {t.mainFeatures.paymentNotifications}
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
                                      {t.mainFeatures.transactionStatus}
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
                                      {t.mainFeatures.sandboxEnvironment}
                                    </li>
                                  </ul>
                                </div>

                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                  <h4 className="text-md font-medium text-indigo-900 dark:text-indigo-300 mb-2">
                                    {t.common.needHelp}
                                  </h4>
                                  <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-3">
                                    {t.support.technicalSupport.description}
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
                                    {t.common.talkToSupport}
                                  </button>
                                </div>
                              </div>
                            )}

                            {endpoint.id === "getting-started" && (
                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                    {t.introduction.gettingStarted.title}
                                  </h3>
                                  <p className="text-slate-700 dark:text-slate-300">
                                    {t.introduction.gettingStarted.content}
                                  </p>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                                      1
                                    </div>
                                    <div>
                                      <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
                                        {
                                          t.gettingStartedSteps
                                            .requestCredentials.title
                                        }
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {
                                          t.gettingStartedSteps
                                            .requestCredentials.content
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                                      2
                                    </div>
                                    <div>
                                      <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
                                        {
                                          t.gettingStartedSteps.testSandbox
                                            .title
                                        }
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {
                                          t.gettingStartedSteps.testSandbox
                                            .content
                                        }
                                      </p>
                                      <div className="mt-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                                          {
                                            t.gettingStartedSteps.testSandbox
                                              .sandboxUrl
                                          }{" "}
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
                                        {
                                          t.gettingStartedSteps.authenticate
                                            .title
                                        }
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {
                                          t.gettingStartedSteps.authenticate
                                            .content
                                        }
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
                                        {t.gettingStartedSteps.integrate.title}
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {
                                          t.gettingStartedSteps.integrate
                                            .content
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                                      5
                                    </div>
                                    <div>
                                      <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
                                        {
                                          t.gettingStartedSteps.goToProduction
                                            .title
                                        }
                                      </h4>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {
                                          t.gettingStartedSteps.goToProduction
                                            .content
                                        }
                                      </p>
                                      <div className="mt-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                                          {
                                            t.gettingStartedSteps.goToProduction
                                              .productionUrl
                                          }{" "}
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
                                    {t.sdksInDevelopment.title}
                                  </h4>
                                  <div className="flex items-start space-x-3">
                                    <div className="mt-1 text-amber-500 dark:text-amber-400">
                                      <AlertCircle size={20} />
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                        {t.sdksInDevelopment.message}
                                      </p>
                                      <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {t.sdksInDevelopment.additionalInfo}
                                      </p>
                                      <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                                        {t.sdksInDevelopment.updates}
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
                                    {t.introduction.authentication.title}
                                  </h3>
                                  <p className="text-slate-700 dark:text-slate-300">
                                    {t.introduction.authentication.content}
                                  </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                                    {t.authentication.title}
                                  </h4>
                                  <ol className="space-y-3">
                                    <li className="flex items-start">
                                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-3">
                                        1
                                      </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {t.authentication.steps.step1}
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-3">
                                        2
                                      </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {t.authentication.steps.step2}
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-3">
                                        3
                                      </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {t.authentication.steps.step3}
                                      </span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-3">
                                        4
                                      </span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {t.authentication.steps.step4}
                                      </span>
                                    </li>
                                  </ol>
                                </div>

                                <div>
                                  <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">
                                    {t.authentication.tokenSecurity.title}
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
                                        {
                                          t.authentication.tokenSecurity
                                            .validity
                                        }
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
                                        {
                                          t.authentication.tokenSecurity
                                            .storeSecurely
                                        }
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
                                        {
                                          t.authentication.tokenSecurity
                                            .renewAutomatically
                                        }
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
                                        {
                                          t.authentication.tokenSecurity
                                            .neverShare
                                        }
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
                                    {t.authentication.example.title}
                                  </h4>
                                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                                    {t.authentication.example.description}
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
                                  <span className="text-xs">
                                    {t.common.copy}
                                  </span>
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
                                    {t.apiEndpoints.parameters}
                                  </h4>
                                  <div className="overflow-auto">
                                    <table className="w-full border-collapse">
                                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr className="text-xs text-slate-500 dark:text-slate-400 text-left">
                                          <th className="px-4 py-2 font-medium">
                                            {t.common.search}
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            {t.common.content}
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            {t.apiEndpoints.body}
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            {t.apiEndpoints.required}
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            {t.apiEndpoints.responses}
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
                                                    {t.apiEndpoints.required}
                                                  </span>
                                                ) : (
                                                  <span className="text-slate-500 dark:text-slate-400">
                                                    {t.apiEndpoints.notRequired}
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
                                    {t.apiEndpoints.headers}
                                  </h4>
                                  <div className="overflow-auto">
                                    <table className="w-full border-collapse">
                                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr className="text-xs text-slate-500 dark:text-slate-400 text-left">
                                          <th className="px-4 py-2 font-medium">
                                            {t.common.search}
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            {t.apiEndpoints.required}
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            {t.apiEndpoints.body}
                                          </th>
                                          <th className="px-4 py-2 font-medium">
                                            {t.apiEndpoints.responses}
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
                                                    {t.apiEndpoints.required}
                                                  </span>
                                                ) : (
                                                  <span className="text-slate-500 dark:text-slate-400">
                                                    {t.apiEndpoints.notRequired}
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
                                  {t.apiEndpoints.body}
                                </h4>
                                <div className="overflow-auto">
                                  <table className="w-full border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                      <tr className="text-xs text-slate-500 dark:text-slate-400 text-left">
                                        <th className="px-4 py-2 font-medium">
                                          {t.common.search}
                                        </th>
                                        <th className="px-4 py-2 font-medium">
                                          {t.apiEndpoints.body}
                                        </th>
                                        <th className="px-4 py-2 font-medium">
                                          {t.apiEndpoints.required}
                                        </th>
                                        <th className="px-4 py-2 font-medium">
                                          {t.apiEndpoints.responses}
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
                                                  {t.apiEndpoints.required}
                                                </span>
                                              ) : (
                                                <span className="text-slate-500 dark:text-slate-400">
                                                  {t.apiEndpoints.notRequired}
                                                </span>
                                              )}
                                            </td>
                                            <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                                              {prop.description}
                                              {prop.properties && (
                                                <div className="mt-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                                                  <h6 className="text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">
                                                    {t.apiEndpoints.properties}
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
                                {t.apiEndpoints.requestExample}
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
                                {t.apiEndpoints.responses}
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
                {t.common.noEndpointsFound}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {t.common.noEndpointsFoundDesc}
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                {t.common.clearFilters}
              </button>
            </div>
          )}

          {/* Seção de conceitos e termos */}
          <Card id="concepts">
            <CardHeader>
              <CardTitle>{t.concepts.title}</CardTitle>
              <CardDescription>{t.concepts.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.concepts.pix.title}
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {t.concepts.pix.description}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.concepts.bankSlip.title}
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {t.concepts.bankSlip.description}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.concepts.pixKey.title}
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {t.concepts.pixKey.description}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.concepts.oauth.title}
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {t.concepts.oauth.description}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.concepts.bearerToken.title}
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {t.concepts.bearerToken.description}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.concepts.sellerId.title}
                  </dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {t.concepts.sellerId.description}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* SDKs e Integrações */}
          <Card id="sdks">
            <CardHeader>
              <CardTitle>{t.sdks.title}</CardTitle>
              <CardDescription>{t.sdks.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="#"
                  className="block p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    {t.sdks.csharp.title}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {t.sdks.csharp.description}
                  </p>
                  <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {t.sdks.csharp.link}
                  </div>
                </a>

                <a
                  href="#"
                  className="block p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    {t.sdks.php.title}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {t.sdks.php.description}
                  </p>
                  <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {t.sdks.php.link}
                  </div>
                </a>

                <a
                  href="#"
                  className="block p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    {t.sdks.javascript.title}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {t.sdks.javascript.description}
                  </p>
                  <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {t.sdks.javascript.link}
                  </div>
                </a>
              </div>

              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  {t.sdksInDevelopment.title}
                </h4>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-amber-500 dark:text-amber-400">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      {t.sdksInDevelopment.message}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {t.sdksInDevelopment.additionalInfo}
                    </p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                      {t.sdksInDevelopment.updates}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suporte e Contato */}
          <Card id="support">
            <CardHeader>
              <CardTitle>{t.support.title}</CardTitle>
              <CardDescription>{t.support.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                    {t.support.technicalSupport.title}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                    {t.support.technicalSupport.description}
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
                    {t.support.completeDocumentation.title}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                    {t.support.completeDocumentation.description}
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
