// src/pages/Endpoints/components/content/OverviewContent.jsx
import React from "react";
import { AlertCircle } from "lucide-react";

const OverviewContent = ({ t }) => {
  return (
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
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
  );
};

export default OverviewContent;
