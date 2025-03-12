import React from "react";
import { formatCurrency } from "../../utils/formatters";
import {
  BarChart,
  CreditCard,
  ArrowDownToLine,
  LinkIcon,
  Activity,
  TrendingUp,
  Users,
  Wallet,
  ShieldCheck,
  AlertCircle,
  CalendarClock,
  Building,
} from "lucide-react";

const DashboardSummary = ({ data, onTabChange }) => {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64 mb-3"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-56"></div>
        </div>
      </div>
    );
  }

  // Formatando data de última atualização
  const formattedDate = data.lastUpdated
    ? new Date(data.lastUpdated).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  // Métricas principais - ajustadas para os dados disponíveis
  const metrics = [
    {
      title: "Total de Contas Bancárias",
      value: data.totalBankAccounts || 0,
      icon: (
        <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      ),
      type: "count",
    },
    {
      title: "Carteiras Registradas",
      value: data.totalWallets || 0,
      icon: (
        <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      ),
      type: "count",
    },
    {
      title: "Saldo do Sistema",
      value: formatCurrency(data.totalSystemBalance || 0),
      icon: <BarChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      type: "currency",
    },
    {
      title: "Última Atualização",
      value: formattedDate,
      icon: (
        <CalendarClock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      ),
      type: "date",
    },
  ];

  // Apenas uma categoria pendente baseada nos dados disponíveis
  const pendingItems = [
    {
      title: "Transações Pendentes",
      count: data.totalPendingTransactions || 0,
      icon: (
        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      ),
      tabName: "transactions",
      description: "Transações aguardando aprovação",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        Visão Geral do Sistema
      </h2>

      {/* Status do Sistema */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-full mr-4">
            <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-medium text-indigo-900 dark:text-indigo-300">
              Status do Sistema
            </h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-400">
              Todos os serviços estão operacionais
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            API Online
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Banco de dados estável
          </span>
        </div>
      </div>

      {/* Métricas */}
      <div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
          Métricas Principais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                  {metric.icon}
                </div>
              </div>
              <h4 className="text-sm text-slate-600 dark:text-slate-400">
                {metric.title}
              </h4>
              <p className="text-2xl font-semibold text-slate-800 dark:text-white mt-1">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Itens Pendentes */}
      <div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
          Itens Pendentes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingItems.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm bg-white dark:bg-slate-800 transition-all duration-200 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md mr-3">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      item.count > 0
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                  >
                    {item.count}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Informação adicional sobre contas bancárias */}
          <div className="group cursor-pointer">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm bg-white dark:bg-slate-800 transition-all duration-200 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md mr-3">
                    <Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white">
                      Contas Bancárias
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total de contas bancárias registradas
                    </p>
                  </div>
                </div>
                <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {data.totalBankAccounts || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
