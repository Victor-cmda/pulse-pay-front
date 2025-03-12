import React, { useState } from "react";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import {
  Check,
  X,
  AlertCircle,
  Search,
  ArrowDownRight,
  Play,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  Clock,
  Wallet,
  CreditCard,
  Building,
} from "lucide-react";

const WithdrawalsTable = ({ withdraws, onApprove, onReject, onProcess }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAmount: "",
    maxAmount: "",
    status: "all",
    withdrawMethod: "all",
  });

  const itemsPerPage = 10;

  const getWithdrawMethodLabel = (method) => {
    const methods = {
      BANK_TRANSFER: "Transferência Bancária",
      PIX: "PIX",
      TED: "TED",
      DOC: "DOC",
    };
    return methods[method] || method;
  };

  const getStatusStyle = (status) => {
    const styles = {
      PENDING:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      APPROVED:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      PROCESSING:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      COMPLETED:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };

    return (
      styles[status] ||
      "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
    );
  };

  const applyFilters = (data) => {
    return data.filter((item) => {
      // Filtro de pesquisa
      const matchesSearch =
        item.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sellerId
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.bankName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de valor mínimo
      const matchesMinAmount =
        filters.minAmount === "" ||
        (item.amount && item.amount >= parseFloat(filters.minAmount));

      // Filtro de valor máximo
      const matchesMaxAmount =
        filters.maxAmount === "" ||
        (item.amount && item.amount <= parseFloat(filters.maxAmount));

      // Filtro de status
      const matchesStatus =
        filters.status === "all" ||
        (item.status &&
          item.status.toLowerCase() === filters.status.toLowerCase());

      // Filtro de método de saque
      const matchesMethod =
        filters.withdrawMethod === "all" ||
        (item.withdrawMethod &&
          item.withdrawMethod.toLowerCase() ===
            filters.withdrawMethod.toLowerCase());

      return (
        matchesSearch &&
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesStatus &&
        matchesMethod
      );
    });
  };

  const resetFilters = () => {
    setFilters({
      minAmount: "",
      maxAmount: "",
      status: "all",
      withdrawMethod: "all",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleRejectWithReason = (id) => {
    const reason = prompt("Por favor, informe o motivo da rejeição:");
    if (reason !== null) {
      onReject(id, reason);
    }
  };

  const filteredWithdraws = applyFilters(withdraws || []);
  const totalPages = Math.ceil(filteredWithdraws.length / itemsPerPage);
  const paginatedData = filteredWithdraws.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!withdraws) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-64"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-6 w-80"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-slate-200 dark:bg-slate-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (withdraws.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          Solicitações de Saque Pendentes
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Saques solicitados que aguardam aprovação e processamento
        </p>

        <div className="py-12 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <Check className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            Tudo em ordem!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Não há solicitações de saque pendentes no momento. Todas as
            solicitações foram processadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
        Solicitações de Saque Pendentes
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Saques solicitados que aguardam aprovação e processamento
      </p>

      {/* Filtros e Pesquisa */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar saques..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 mr-1" />
            Filtros
          </button>
          <button className="flex items-center px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros expandidos */}
      {showFilters && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Valor Mínimo
              </label>
              <input
                type="number"
                placeholder="R$ 0,00"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters({ ...filters, minAmount: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Valor Máximo
              </label>
              <input
                type="number"
                placeholder="R$ 10.000,00"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters({ ...filters, maxAmount: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="processing">Em processamento</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Método
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                value={filters.withdrawMethod}
                onChange={(e) =>
                  setFilters({ ...filters, withdrawMethod: e.target.value })
                }
              >
                <option value="all">Todos</option>
                <option value="pix">PIX</option>
                <option value="bank_transfer">Transferência Bancária</option>
                <option value="ted">TED</option>
                <option value="doc">DOC</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Resultados da Pesquisa */}
      {filteredWithdraws.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <AlertCircle className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            Nenhuma solicitação encontrada
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
            Não encontramos nenhuma solicitação de saque com os critérios de
            busca atuais.
          </p>
          <button
            onClick={resetFilters}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Destino
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedData.map((withdraw) => (
                  <tr
                    key={withdraw.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                      #{withdraw.id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mr-2">
                          <Wallet className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {withdraw.sellerName || "Vendedor"}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            ID: {withdraw.sellerId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(withdraw.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {getWithdrawMethodLabel(withdraw.withdrawMethod)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {withdraw.bankAccountId ? (
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-1" />
                          <div className="flex flex-col">
                            <span>{withdraw.bankName || "Banco"}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {withdraw.accountNumber
                                ? `Conta: ${withdraw.accountNumber}`
                                : ""}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Chave PIX ou outro método
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-1" />
                        {formatDateTime(withdraw.requestedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-1">
                      {withdraw.status !== "APPROVED" && (
                        <button
                          className="inline-flex items-center p-1.5 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                          onClick={() => onApprove(withdraw.id)}
                          title="Aprovar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      {withdraw.status === "APPROVED" && (
                        <button
                          className="inline-flex items-center p-1.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => onProcess(withdraw.id)}
                          title="Processar"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        className="inline-flex items-center p-1.5 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => handleRejectWithReason(withdraw.id)}
                        title="Rejeitar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 px-2">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Mostrando{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredWithdraws.length
                  )}
                </span>{" "}
                de{" "}
                <span className="font-medium">{filteredWithdraws.length}</span>{" "}
                resultados
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Lógica para mostrar páginas próximas à atual
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-md ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white font-medium"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WithdrawalsTable;
