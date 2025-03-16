// src/pages/Endpoints/components/EndpointsSidebar.jsx
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const EndpointsSidebar = ({ endpoints, expandedSection, toggleSection }) => {
  return (
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
  );
};

export default EndpointsSidebar;
