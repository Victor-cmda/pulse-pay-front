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

const AdminDashboard = () => {
  const { startLoading, stopLoading } = useLoading();
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Dados para cada seção
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [pendingBankAccounts, setPendingBankAccounts] = useState([]);
  const [pendingWithdraws, setPendingWithdraws] = useState([]);
  const [pendingPixPayments, setPendingPixPayments] = useState([]);

  // Carregar dados do dashboard ao iniciar
  useEffect(() => {
    const fetchDashboardData = async () => {
      startLoading("Carregando dados do dashboard...");
      try {
        const response = await paymentService.getDashboardSummary();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar resumo do dashboard:", error);
      } finally {
        stopLoading();
      }
    };

    fetchDashboardData();
  }, []);

  // Carrega dados com base na aba ativa
  useEffect(() => {
    const fetchTabData = async () => {
      if (activeTab === "overview") return;

      startLoading(`Carregando dados de ${getTabName(activeTab)}...`);

      try {
        switch (activeTab) {
          case "transactions":
            const txResponse = await paymentService.getPendingTransactions();
            if (txResponse.success) {
              setPendingTransactions(txResponse.data || []);
            }
            break;

          case "bankAccounts":
            const baResponse = await paymentService.getUnverifiedBankAccounts();
            if (baResponse.success) {
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
      }
    };

    fetchTabData();
  }, [activeTab]);

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
        Painel Administrativo
      </h1>

      {/* Tabs de navegação */}
      <div className="tabs tabs-boxed">
        <a
          className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Visão Geral
        </a>
        <a
          className={`tab ${activeTab === "transactions" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("transactions")}
        >
          Transações
        </a>
        <a
          className={`tab ${activeTab === "bankAccounts" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("bankAccounts")}
        >
          Contas Bancárias
        </a>
        <a
          className={`tab ${activeTab === "withdraws" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("withdraws")}
        >
          Saques
        </a>
        <a
          className={`tab ${activeTab === "pixPayments" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("pixPayments")}
        >
          Pagamentos PIX
        </a>
      </div>

      {/* Conteúdo da aba atual */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <DashboardSummary data={dashboardData} onTabChange={setActiveTab} />
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
      </div>
    </div>
  );
};

export default AdminDashboard;
