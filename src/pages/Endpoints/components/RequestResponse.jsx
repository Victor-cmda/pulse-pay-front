// src/pages/Endpoints/components/RequestResponse.jsx
import React from "react";

const RequestResponse = ({ endpoint, t }) => {
  return (
    <>
      {/* Parâmetros */}
      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 text-slate-800 dark:text-white">
            {t.apiEndpoints.parameters}
          </h4>
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="text-xs text-slate-500 dark:text-slate-400 text-left">
                  <th className="px-4 py-2 font-medium">Nome</th>
                  <th className="px-4 py-2 font-medium">Localização</th>
                  <th className="px-4 py-2 font-medium">Tipo</th>
                  <th className="px-4 py-2 font-medium">Obrigatório</th>
                  <th className="px-4 py-2 font-medium">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {endpoint.parameters.map((param, index) => (
                  <tr key={index} className="text-sm">
                    <td className="px-4 py-2 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                      {param.name}
                    </td>
                    <td className="px-4 py-2">{param.in}</td>
                    <td className="px-4 py-2">{param.type}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Headers */}
      {endpoint.headers && endpoint.headers.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 text-slate-800 dark:text-white">
            {t.apiEndpoints.headers}
          </h4>
          {/* Similar table structure as above */}
          {/* ... */}
        </div>
      )}

      {/* Body Parameters */}
      {endpoint.body && (
        <div>
          <h4 className="text-sm font-medium mb-3 text-slate-800 dark:text-white">
            {t.apiEndpoints.body}
          </h4>
          {/* Similar table structure as above */}
          {/* ... */}
        </div>
      )}

      {/* Request Example */}
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

      {/* Responses */}
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
                    response.status >= 200 && response.status < 300
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : response.status >= 400 && response.status < 500
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
              {response.example && typeof response.example !== "string" && (
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg overflow-x-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap text-slate-800 dark:text-slate-300">
                    {JSON.stringify(response.example, null, 2)}
                  </pre>
                </div>
              )}
              {response.example && typeof response.example === "string" && (
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
    </>
  );
};

export default RequestResponse;
