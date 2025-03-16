// src/pages/Endpoints/components/SupportSection.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle, Code, ExternalLink } from "lucide-react";

const SupportSection = ({ t }) => {
  return (
    <>
      {/* Conceitos e Termos */}
      <Card id="concepts">
        <CardHeader>
          <CardTitle>{t.concepts.title}</CardTitle>
          <CardDescription>{t.concepts.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            {/* Lista de conceitos e termos */}
            <div>
              <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.concepts.pix.title}
              </dt>
              <dd className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                {t.concepts.pix.description}
              </dd>
            </div>
            {/* Mais definições... */}
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
            {/* SDK Cards */}
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
            {/* Mais cartões de SDK... */}
          </div>

          {/* SDKs em desenvolvimento */}
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
    </>
  );
};

export default SupportSection;
