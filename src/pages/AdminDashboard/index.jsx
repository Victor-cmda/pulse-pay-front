import React, { useState, useEffect } from "react";
import { useLoading } from "../../context/LoadingContext";
import { paymentService } from "../../services/PaymentService";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import {
  DashboardSummary,
  PendingTransactionsTable,
  BankAccountsTable,
  WithdrawalsTable,
  PixPaymentsTable,
} from "../../components/Admin";
import {
  LineChart,
  Activity,
  CreditCard,
  FileText,
  RefreshCw,
  BarChart,
  ArrowDownToLine,
  LinkIcon,
  AlertTriangle,
  Wallet,
  Download,
} from "lucide-react";

const AdminDashboard = () => {
  const { startLoading, stopLoading } = useLoading();
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Dados para cada seção
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [pendingBankAccounts, setPendingBankAccounts] = useState([]);
  const [pendingWithdraws, setPendingWithdraws] = useState([]);
  const [pendingPixPayments, setPendingPixPayments] = useState([]);

  // Carregar dados do dashboard ao iniciar
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    startLoading("Carregando dados do dashboard...");
    try {
      const response = await paymentService.getDashboardSummary();
      if (response.success) {
        setDashboardData(response.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Erro ao carregar resumo do dashboard:", error);
    } finally {
      stopLoading();
      setIsLoading(false);
    }
  };

  // Carrega dados com base na aba ativa
  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const fetchTabData = async () => {
    if (activeTab === "overview") return;

    startLoading(`Carregando dados de ${getTabName(activeTab)}...`);

    try {
      switch (activeTab) {
        case "transactions":
          const txResponse = await paymentService.getPendingTransactions();
          if (txResponse.success) {
            // Certifique-se de acessar o array dentro de data
            setPendingTransactions(txResponse.data || []);
          }
          break;

        case "bankAccounts":
          const baResponse = await paymentService.getUnverifiedBankAccounts();
          if (baResponse.success) {
            debugger;
            setPendingBankAccounts(baResponse.data || []);
          }
          break;

        case "withdraws":
          const wdResponse = await paymentService.getPendingWithdraws();
          if (wdResponse.success) {
            setPendingWithdraws(wdResponse.data || []);
          }
          break;

        case "pixPayments":
          const pixResponse = await paymentService.getPendingPixPayments();
          if (pixResponse.success) {
            setPendingPixPayments(pixResponse.data || []);
          }
          break;
      }
    } catch (error) {
      console.error(
        `Erro ao carregar dados de ${getTabName(activeTab)}:`,
        error
      );
    } finally {
      stopLoading();
      setIsLoading(false);
    }
  };

  const getTabName = (tab) => {
    const tabNames = {
      overview: "visão geral",
      transactions: "transações pendentes",
      bankAccounts: "contas bancárias",
      withdraws: "saques",
      pixPayments: "pagamentos PIX",
    };
    return tabNames[tab] || tab;
  };

  // Handlers para ações (aprovar/rejeitar)
  const handleApproveTransaction = async (id) => {
    startLoading("Aprovando transação...");
    try {
      const response = await paymentService.approveTransaction(id);
      if (response.success) {
        setPendingTransactions(
          pendingTransactions.filter((tx) => tx.id !== id)
        );
      }
    } catch (error) {
      console.error("Erro ao aprovar transação:", error);
    } finally {
      stopLoading();
    }
  };

  const handleRejectTransaction = async (
    id,
    reason = "Rejeitada pelo administrador"
  ) => {
    startLoading("Rejeitando transação...");
    try {
      const response = await paymentService.rejectTransaction(id, reason);
      if (response.success) {
        setPendingTransactions(
          pendingTransactions.filter((tx) => tx.id !== id)
        );
      }
    } catch (error) {
      console.error("Erro ao rejeitar transação:", error);
    } finally {
      stopLoading();
    }
  };

  const handleApproveBankAccount = async (id) => {
    startLoading("Verificando conta bancária...");
    try {
      const response = await paymentService.verifyBankAccountAdmin(id);
      if (response.success) {
        setPendingBankAccounts(
          pendingBankAccounts.filter((acc) => acc.id !== id)
        );
      }
    } catch (error) {
      console.error("Erro ao verificar conta bancária:", error);
    } finally {
      stopLoading();
    }
  };

  const handleRejectBankAccount = async (
    id,
    reason = "Rejeitada pelo administrador"
  ) => {
    startLoading("Rejeitando conta bancária...");
    try {
      const response = await paymentService.rejectBankAccount(id, reason);
      if (response.success) {
        setPendingBankAccounts(
          pendingBankAccounts.filter((acc) => acc.id !== id)
        );
      }
    } catch (error) {
      console.error("Erro ao rejeitar conta bancária:", error);
    } finally {
      stopLoading();
    }
  };

  const handleApproveWithdraw = async (id) => {
    startLoading("Aprovando solicitação de saque...");
    try {
      const response = await paymentService.approveWithdraw(id);
      if (response.success) {
        setPendingWithdraws(
          pendingWithdraws.filter((withdraw) => withdraw.id !== id)
        );
      }
    } catch (error) {
      console.error("Erro ao aprovar solicitação de saque:", error);
    } finally {
      stopLoading();
    }
  };

  const handleRejectWithdraw = async (
    id,
    reason = "Rejeitada pelo administrador"
  ) => {
    startLoading("Rejeitando solicitação de saque...");
    try {
      const response = await paymentService.rejectWithdraw(id, reason);
      if (response.success) {
        setPendingWithdraws(
          pendingWithdraws.filter((withdraw) => withdraw.id !== id)
        );
      }
    } catch (error) {
      console.error("Erro ao rejeitar solicitação de saque:", error);
    } finally {
      stopLoading();
    }
  };

  const handleConfirmPixPayment = async (id) => {
    startLoading("Confirmando pagamento PIX...");
    try {
      const response = await paymentService.confirmPixPayment(id);
      if (response.success) {
        setPendingPixPayments(
          pendingPixPayments.filter((payment) => payment.id !== id)
        );
      }
    } catch (error) {
      console.error("Erro ao confirmar pagamento PIX:", error);
    } finally {
      stopLoading();
    }
  };

  const handleRejectPixPayment = async (
    id,
    reason = "Rejeitado pelo administrador"
  ) => {
    startLoading("Rejeitando pagamento PIX...");
    try {
      const response = await paymentService.rejectPixPayment(id, reason);
      if (response.success) {
        setPendingPixPayments(
          pendingPixPayments.filter((payment) => payment.id !== id)
        );
      }
    } catch (error) {
      console.error("Erro ao rejeitar pagamento PIX:", error);
    } finally {
      stopLoading();
    }
  };

  const navItems = [
    {
      id: "overview",
      label: "Visão Geral",
      icon: <BarChart className="w-4 h-4" />,
    },
    {
      id: "transactions",
      label: "Transações",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: "bankAccounts",
      label: "Contas Bancárias",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: "withdraws",
      label: "Saques",
      icon: <ArrowDownToLine className="w-4 h-4" />,
    },
    {
      id: "pixPayments",
      label: "Pagamentos PIX",
      icon: <LinkIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Painel Administrativo
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Gerencie todas as operações pendentes do sistema em um único lugar
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <button
              onClick={fetchTabData}
              className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors mr-2"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        {/* Alert for pending items */}
        {dashboardData &&
          (dashboardData.pendingTransactions > 0 ||
            dashboardData.pendingBankAccounts > 0 ||
            dashboardData.pendingWithdraws > 0 ||
            dashboardData.pendingPixPayments > 0) && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 mb-6 flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">
                  Ações pendentes
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Há itens pendentes que requerem sua atenção. Analise-os nas
                  respectivas seções.
                </p>
              </div>
            </div>
          )}

        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:block mb-6">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex -mb-px">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-4 px-6 flex items-center font-medium text-sm transition-colors border-b-2 ${
                    activeTab === item.id
                      ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-500"
                      : "border-transparent text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                  {dashboardData &&
                    item.id !== "overview" &&
                    dashboardData[
                      `pending${
                        item.id.charAt(0).toUpperCase() + item.id.slice(1)
                      }`
                    ] > 0 && (
                      <span className="ml-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-400 text-xs font-medium px-2 py-0.5 rounded-full">
                        {
                          dashboardData[
                            `pending${
                              item.id.charAt(0).toUpperCase() + item.id.slice(1)
                            }`
                          ]
                        }
                      </span>
                    )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Navigation Tabs - Mobile */}
        <div className="md:hidden mb-6">
          <select
            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {navItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}{" "}
                {dashboardData &&
                item.id !== "overview" &&
                dashboardData[
                  `pending${item.id.charAt(0).toUpperCase() + item.id.slice(1)}`
                ] > 0
                  ? `(${
                      dashboardData[
                        `pending${
                          item.id.charAt(0).toUpperCase() + item.id.slice(1)
                        }`
                      ]
                    })`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Last updated info */}
        {lastUpdated && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center">
            <span>Última atualização: {lastUpdated.toLocaleTimeString()}</span>
            <button
              onClick={fetchTabData}
              className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-3 h-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>
          </div>
        )}

        {/* Conteúdo da aba atual */}
        <div className="tab-content bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Carregando dados...
              </p>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <DashboardSummary
                  data={dashboardData}
                  onTabChange={setActiveTab}
                />
              )}

              {activeTab === "transactions" && (
                <PendingTransactionsTable
                  transactions={pendingTransactions}
                  onApprove={handleApproveTransaction}
                  onReject={handleRejectTransaction}
                />
              )}

              {activeTab === "bankAccounts" && (
                <BankAccountsTable
                  accounts={pendingBankAccounts}
                  onApprove={handleApproveBankAccount}
                  onReject={handleRejectBankAccount}
                />
              )}

              {activeTab === "withdraws" && (
                <WithdrawalsTable
                  withdraws={pendingWithdraws}
                  onApprove={handleApproveWithdraw}
                  onReject={handleRejectWithdraw}
                />
              )}

              {activeTab === "pixPayments" && (
                <PixPaymentsTable
                  payments={pendingPixPayments}
                  onConfirm={handleConfirmPixPayment}
                  onReject={handleRejectPixPayment}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
