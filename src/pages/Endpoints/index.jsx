// src/pages/Endpoints/index.jsx
import React, { useState } from "react";
import { Search, Globe } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import EndpointsSidebar from "./components/EndpointsSidebar";
import EndpointSection from "./components/EndpointSection";
import SupportSection from "./components/SupportSection";
import { getEndpointsData } from "./utils/endpointData";
import { useEndpointsFilter } from "./hooks/useEndpointsFilter";

const ApiDocumentation = () => {
  const { t, language, setLanguage, languages } = useLanguage();
  const [expandedSection, setExpandedSection] = useState("introduction");
  const [searchTerm, setSearchTerm] = useState("");

  const endpoints = getEndpointsData(t);
  const filteredEndpoints = useEndpointsFilter(endpoints, searchTerm);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header com título e pesquisa */}
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
          {/* Campo de pesquisa */}
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

          {/* Seletor de idioma */}
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
        {/* Sidebar de navegação - visível apenas em telas grandes */}
        <div className="hidden lg:block">
          <EndpointsSidebar
            endpoints={endpoints}
            expandedSection={expandedSection}
            toggleSection={toggleSection}
          />
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3 space-y-8">
          {filteredEndpoints.length > 0 ? (
            <>
              {/* Seções de endpoints */}
              {filteredEndpoints.map((section) => (
                <EndpointSection key={section.id} section={section} t={t} />
              ))}

              {/* Seção de suporte e informações adicionais */}
              <SupportSection t={t} />
            </>
          ) : (
            // Estado vazio - nenhum resultado encontrado
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
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
