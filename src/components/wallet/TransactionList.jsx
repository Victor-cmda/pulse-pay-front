import React from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCcw, 
  Info 
} from "lucide-react";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const TransactionList = ({ 
  transactions, 
  pagination, 
  summary, 
  onPageChange 
}) => {
  const getStatusColor = (type) => {
    switch (type?.toLowerCase()) {
      case "credit":
      case "deposit":
        return "text-emerald-500";
      case "pending":
        return "text-amber-500";
      case "debit":
      case "withdraw":
      case "withdrawal":
        return "text-rose-500";
      default:
        return "text-slate-500";
    }
  };

  const getStatusBg = (type) => {
    switch (type?.toLowerCase()) {
      case "credit":
      case "deposit":
        return "bg-emerald-100 dark:bg-emerald-900/20";
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/20";
      case "debit":
      case "withdraw":
      case "withdrawal":
        return "bg-rose-100 dark:bg-rose-900/20";
      default:
        return "bg-slate-100 dark:bg-slate-700/30";
    }
  };

  const getStatusIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "credit":
      case "deposit":
        return <ArrowUpRight className="w-4 h-4" />;
      case "pending":
        return <RefreshCcw className="w-4 h-4" />;
      case "debit":
      case "withdraw":
      case "withdrawal":
        return <ArrowDownRight className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getTransactionLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "credit":
      case "deposit":
        return "Depósito";
      case "pending":
        return "Pendente";
      case "debit":
      case "withdraw":
      case "withdrawal":
        return "Saque";
      default:
        return type || "Desconhecido";
    }
  };

  return (
    <div>
      {/* Resumo de Transações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">
            Total Créditos
          </p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(summary.totalCredits)}
          </p>
        </div>
        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
          <p className="text-sm text-rose-600 dark:text-rose-400 mb-1">
            Total Débitos
          </p>
          <p className="text-xl font-bold text-rose-700 dark:text-rose-400">
            {formatCurrency(summary.totalDebits)}
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Saldo Líquido
          </p>
          <p className="text-xl font-bold text-slate-800 dark:text-white">
            {formatCurrency(summary.netAmount)}
          </p>
        </div>
      </div>

      {/* Lista de Transações */}
      {transactions && transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Tipo
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Descrição
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Data
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="py-3 px-4">
                    <div
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBg(
                        transaction.type
                      )} ${getStatusColor(transaction.type)}`}
                    >
                      {getStatusIcon(transaction.type)}
                      <span className="ml-1.5">
                        {getTransactionLabel(transaction.type)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div
                      className={`px-2.5 py-1 inline-block text-xs rounded-full 
                    ${
                      transaction.status?.toLowerCase() === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : transaction.status?.toLowerCase() === "pending"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : transaction.status?.toLowerCase() === "cancelled"
                        ? "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                    }`}
                    >
                      {transaction.status}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {formatDateTime(transaction.createdAt)}
                  </td>
                  <td
                    className={`py-3 px-4 text-sm font-medium text-right ${getStatusColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type?.toLowerCase() === "debit" ||
                    transaction.type?.toLowerCase() === "withdraw" ||
                    transaction.type?.toLowerCase() === "withdrawal"
                      ? "- "
                      : ""}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <RefreshCcw className="w-10 h-10 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
          <p className="text-slate-600 dark:text-slate-400">
            Nenhuma transação encontrada nos últimos 30 dias.
          </p>
        </div>
      )}

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Mostrando {pagination.currentPage} de {pagination.totalPages} páginas
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage <= 1}
              className={`px-3 py-1 rounded text-sm ${
                pagination.currentPage <= 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              disabled={pagination.currentPage >= pagination.totalPages}
              className={`px-3 py-1 rounded text-sm ${
                pagination.currentPage >= pagination.totalPages
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;