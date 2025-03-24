// src/pages/Endpoints/components/content/AuthenticationContent.jsx
import React from "react";

const AuthenticationContent = ({ t }) => {
  return (
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
              {t.authentication.tokenSecurity.validity}
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
              {t.authentication.tokenSecurity.storeSecurely}
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
              {t.authentication.tokenSecurity.renewAutomatically}
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
              {t.authentication.tokenSecurity.neverShare}
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
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          {t.authentication.example.title}
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
          {t.authentication.example.description}
        </p>
        <div className="bg-slate-800 text-slate-300 p-3 rounded-lg overflow-x-auto">
          <pre className="text-xs font-mono whitespace-pre-wrap">
            {`curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/oauth/v2/token \\
-H "Authorization: Basic $(echo -n 'your_client_id:your_client_secret' | base64)" \\
-H "Content-Type: application/json"`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationContent;
