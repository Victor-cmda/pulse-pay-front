// src/pages/Endpoints/components/content/GettingStartedContent.jsx
import React from "react";
import { AlertCircle } from "lucide-react";

const GettingStartedContent = ({ t }) => {
  return (
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
              {t.gettingStartedSteps.requestCredentials.title}
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {t.gettingStartedSteps.requestCredentials.content}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
            2
          </div>
          <div>
            <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
              {t.gettingStartedSteps.testSandbox.title}
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {t.gettingStartedSteps.testSandbox.content}
            </p>
            <div className="mt-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                {t.gettingStartedSteps.testSandbox.sandboxUrl}{" "}
                <code>https://pulsepay.technocenterinformatica.com.br/sandbox</code>
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
              {t.gettingStartedSteps.authenticate.title}
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {t.gettingStartedSteps.authenticate.content}
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
              {t.gettingStartedSteps.integrate.content}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
            5
          </div>
          <div>
            <h4 className="text-md font-medium text-slate-900 dark:text-white mb-1">
              {t.gettingStartedSteps.goToProduction.title}
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {t.gettingStartedSteps.goToProduction.content}
            </p>
            <div className="mt-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                {t.gettingStartedSteps.goToProduction.productionUrl}{" "}
                <code>https://pulsepay.technocenterinformatica.com.br/sandbox</code>
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
  );
};

export default GettingStartedContent;
