import React, { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  AlertCircle,
  ChevronRight,
  RefreshCcw,
  Calendar,
  Info,
  ExternalLink,
  Clock,
  User,
  ChevronDown,
  Check,
} from "lucide-react";
import { paymentService } from "../../services/PaymentService";
import { authService } from "../../services/AuthService";
import { useLoading } from "../../context/LoadingContext";
import { notification } from "antd";
import WalletTypeSelection from "../WalletTypeSelection/WalletTypeSelection ";

const WalletManagement = () => {
  const { startLoading, stopLoading } = useLoading();
  const [api, contextHolder] = notification.useNotification();
  const [mounted, setMounted] = useState(false);

  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState(null);

  const [wallet, setWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [walletWithTransactions, setWalletWithTransactions] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState({
    transactions: [],
    pagination: { currentPage: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
    summary: {
      totalCredits: 0,
      totalDebits: 0,
      netAmount: 0,
      totalTransactions: 0,
    },
  });

  const [activeTab, setActiveTab] = useState("transactions");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showWalletTypeSelection, setShowWalletTypeSelection] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [depositReference, setDepositReference] = useState("");

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [withdrawReference, setWithdrawReference] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const loadSellers = async () => {
      try {
        setSellerLoading(true);
        const sellersResponse = await authService.getAvailableSellers();

        if (sellersResponse.success && sellersResponse.data) {
          setSellers(sellersResponse.data || []);
        } else {
          console.error("Erro ao carregar sellers:", sellersResponse.message);
          setSellers([]);
        }
      } catch (error) {
        console.error("Erro ao carregar sellers:", error);
        setSellers([]);
      } finally {
        setSellerLoading(false);
      }
    };

    loadSellers();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedSellerId) {
      loadData();
    }
  }, [selectedSellerId]);

  const loadData = async () => {
    if (!selectedSellerId) return;

    startLoading("Carregando dados da carteira...");
    try {
      const walletsResponse = await paymentService.seller(selectedSellerId);

      if (!walletsResponse.success) {
        throw new Error(
          walletsResponse.message || "Erro ao carregar carteiras"
        );
      }

      const carteiras = walletsResponse.data;

      if (Array.isArray(carteiras) && carteiras.length > 0) {
        setWallets(carteiras);

        const defaultWallet =
          carteiras.find((w) => w.isDefault) || carteiras[0];
        setWallet(defaultWallet);

        if (defaultWallet?.id) {
          await loadWalletTransactions(defaultWallet.id);
        }
      } else {
        setWallet(null);
        setWallets([]);
        setWalletWithTransactions(null);
        setTransactionHistory({
          transactions: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
          },
          summary: {
            totalCredits: 0,
            totalDebits: 0,
            netAmount: 0,
            totalTransactions: 0,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      api.error({
        message: "Erro",
        description: error.message || "Erro ao carregar dados da carteira",
        placement: "topRight",
      });
    } finally {
      stopLoading();
    }
  };

  const loadWalletTransactions = async (walletId) => {
    try {
      const walletWithTransactionsResponse =
        await paymentService.withTransactions(walletId, 5);

      if (
        walletWithTransactionsResponse.success &&
        walletWithTransactionsResponse.data
      ) {
        setWalletWithTransactions(walletWithTransactionsResponse.data);
      }

      await loadTransactions(walletId);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };

  const loadTransactions = async (walletId, page = 1, size = 10) => {
    startLoading("Carregando transações...");
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const response = await paymentService.transactions(
        walletId,
        thirtyDaysAgo,
        now,
        page,
        size
      );

      if (response.success && response.data) {
        const transactions = response.data;

        let totalCredits = 0;
        let totalDebits = 0;

        transactions.forEach((tx) => {
          if (tx.type === "Credit" || tx.type === "Deposit") {
            totalCredits += tx.amount;
          } else if (
            tx.type === "Debit" ||
            tx.type === "Withdraw" ||
            tx.type === "Withdrawal"
          ) {
            totalDebits += tx.amount;
          }
        });

        const historyData = {
          transactions: transactions,
          pagination: {
            currentPage: page,
            pageSize: size,
            totalCount: transactions.length,
            totalPages: Math.ceil(transactions.length / size),
          },
          summary: {
            totalCredits,
            totalDebits,
            netAmount: totalCredits - totalDebits,
            totalTransactions: transactions.length,
          },
        };

        setTransactionHistory(historyData);
        setCurrentPage(page);
        setPageSize(size);
      }
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      api.error({
        message: "Erro",
        description: error.message || "Erro ao carregar transações",
        placement: "topRight",
      });
    } finally {
      stopLoading();
    }
  };

  const handleDeposit = async () => {
    if (!wallet?.id) {
      api.error({
        message: "Erro",
        description: "ID da carteira não encontrado",
        placement: "topRight",
      });
      return;
    }

    if (
      hasDepositWallet &&
      hasWithdrawalWallet &&
      wallet.walletType !== 0 &&
      wallet.walletType !== 2
    ) {
      api.error({
        message: "Carteira incorreta",
        description: "Por favor, use a carteira de depósito para esta operação",
        placement: "topRight",
      });

      const depositWallet = wallets.find((w) => w.walletType === 0);
      if (depositWallet) {
        setWallet(depositWallet);
      }

      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      api.error({
        message: "Erro",
        description: "Por favor, insira um valor válido",
        placement: "topRight",
      });
      return;
    }

    startLoading("Processando depósito...");
    try {
      const response = await paymentService.deposits(wallet.id, {
        amount: parseFloat(depositAmount),
        description: depositDescription || "Depósito de fundos",
        reference: depositReference || null,
      });

      if (!response.success) {
        throw new Error(response.message || "Erro ao processar depósito");
      }

      api.success({
        message: "Sucesso",
        description: "Depósito realizado com sucesso",
        placement: "topRight",
      });

      setShowDepositModal(false);
      setDepositAmount("");
      setDepositDescription("");
      setDepositReference("");

      await loadData();
    } catch (error) {
      console.error("Erro ao processar depósito:", error);

      api.error({
        message: "Erro",
        description: error.message || "Erro ao processar depósito",
        placement: "topRight",
      });
    } finally {
      stopLoading();
    }
  };

  const handleWithdraw = async () => {
    if (!wallet?.id) {
      api.error({
        message: "Erro",
        description: "ID da carteira não encontrado",
        placement: "topRight",
      });
      return;
    }

    if (
      hasDepositWallet &&
      hasWithdrawalWallet &&
      wallet.walletType !== 1 &&
      wallet.walletType !== 2
    ) {
      api.error({
        message: "Carteira incorreta",
        description: "Por favor, use a carteira de saque para esta operação",
        placement: "topRight",
      });

      const withdrawWallet = wallets.find((w) => w.walletType === 1);
      if (withdrawWallet) {
        setWallet(withdrawWallet);
      }

      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      api.error({
        message: "Erro",
        description: "Por favor, insira um valor válido",
        placement: "topRight",
      });
      return;
    }

    if (parseFloat(withdrawAmount) > (wallet?.availableBalance || 0)) {
      api.error({
        message: "Erro",
        description: "Saldo insuficiente",
        placement: "topRight",
      });
      return;
    }

    startLoading("Processando saque...");
    try {
      const response = await paymentService.withdrawals(wallet.id, {
        amount: parseFloat(withdrawAmount),
        description: withdrawDescription || "Saque de fundos",
        reference: withdrawReference || null,
      });

      if (!response.success) {
        throw new Error(response.message || "Erro ao processar saque");
      }

      api.success({
        message: "Sucesso",
        description: "Saque realizado com sucesso",
        placement: "topRight",
      });

      setShowTransferModal(false);
      setWithdrawAmount("");
      setWithdrawDescription("");
      setWithdrawReference("");

      await loadData();
    } catch (error) {
      console.error("Erro ao processar saque:", error);
      api.error({
        message: "Erro",
        description: error.message || "Erro ao processar saque",
        placement: "topRight",
      });
    } finally {
      stopLoading();
    }
  };

  const setWalletAsDefault = async (walletId) => {
    startLoading("Definindo carteira padrão...");
    try {
      const response = await paymentService.default(walletId, selectedSellerId);

      if (!response.success) {
        throw new Error(response.message || "Erro ao definir carteira padrão");
      }

      api.success({
        message: "Sucesso",
        description: "Carteira definida como padrão com sucesso",
        placement: "topRight",
      });

      // Recarregar dados
      await loadData();
    } catch (error) {
      console.error("Erro ao definir carteira padrão:", error);
      api.error({
        message: "Erro",
        description: error.message || "Erro ao definir carteira padrão",
        placement: "topRight",
      });
    } finally {
      stopLoading();
      setShowWalletSelector(false);
    }
  };

  const switchToWallet = async (newWallet) => {
    setWallet(newWallet);
    if (newWallet?.id) {
      await loadWalletTransactions(newWallet.id);
    }
    setShowWalletSelector(false);
  };

  // Criar novas carteiras baseadas na seleção de tipo
  const createWallet = async (walletType, isDefault = true) => {
    try {
      startLoading(`Criando carteira de ${getWalletTypeLabel(walletType)}...`);
      const response = await paymentService.walletsPOST({
        sellerId: selectedSellerId,
        walletType: walletType,
        isDefault: isDefault,
      });

      if (!response.success) {
        throw new Error(
          response.message ||
            `Erro ao criar carteira de ${getWalletTypeLabel(walletType)}`
        );
      }

      api.success({
        message: "Sucesso",
        description: `Carteira de ${getWalletTypeLabel(
          walletType
        )} criada com sucesso`,
        placement: "topRight",
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao criar carteira:", error);
      api.error({
        message: "Erro",
        description:
          error.message ||
          `Erro ao criar carteira de ${getWalletTypeLabel(walletType)}`,
        placement: "topRight",
      });
      throw error;
    }
  };

  const handleCreateWalletByType = async (type, isDefault = true) => {
    try {
      await createWallet(type, isDefault);
      await loadData();
      setShowWalletTypeSelection(false);
    } catch (error) {
      console.error("Erro ao criar carteira:", error);
    } finally {
      stopLoading();
    }
  };

  // Funções auxiliares de formatação
  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Funções auxiliares para visualização de transações
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
        return "bg-emerald-100";
      case "pending":
        return "bg-amber-100";
      case "debit":
      case "withdraw":
      case "withdrawal":
        return "bg-rose-100";
      default:
        return "bg-slate-100";
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

  const getWalletTypeLabel = (type) => {
    switch (type) {
      case 0:
        return "Depósito";
      case 1:
        return "Saque";
      case 2:
        return "Geral";
      default:
        return "Desconhecido";
    }
  };

  const hasDepositWallet = wallets.some((wallet) => wallet.walletType === 0);
  const hasWithdrawalWallet = wallets.some((wallet) => wallet.walletType === 1);
  const hasGeneralWallet = wallets.some((wallet) => wallet.walletType === 2);

  const getWalletConfiguration = () => {
    if (hasGeneralWallet) {
      return "Configuração com Carteira Única";
    } else if (hasDepositWallet && hasWithdrawalWallet) {
      return "Configuração com Carteiras Separadas";
    } else if (wallets.length > 0) {
      return "Configuração Personalizada";
    } else {
      return "Sem Carteiras";
    }
  };

  const DepositModal = () => (
    <dialog
      id="deposit_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showDepositModal}
    >
      <div className="modal-box bg-white dark:bg-slate-800 shadow-xl rounded-lg">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-600" />
          Realizar Depósito
        </h3>
        <div className="space-y-6">
          <div className="flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Informe os detalhes do depósito</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor do Depósito
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 dark:text-slate-400">R$</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={depositDescription}
                onChange={(e) => setDepositDescription(e.target.value)}
                placeholder="Ex: Depósito mensal"
                className="w-full rounded-lg border border-slate-300 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Referência (opcional)
              </label>
              <input
                type="text"
                value={depositReference}
                onChange={(e) => setDepositReference(e.target.value)}
                placeholder="Ex: Invoice #12345"
                // Continuação do código WalletManagement

                className="w-full rounded-lg border border-slate-300 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>
        </div>
        <div className="modal-action mt-8 flex gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setShowDepositModal(false)}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 transition-colors"
            onClick={handleDeposit}
          >
            <Download className="w-4 h-4" />
            Confirmar Depósito
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowDepositModal(false)}>close</button>
      </form>
    </dialog>
  );

  const TransferModal = () => (
    <dialog
      id="transfer_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showTransferModal}
    >
      <div className="modal-box bg-white dark:bg-slate-800 shadow-xl rounded-lg">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-indigo-600" />
          Realizar Saque
        </h3>
        <div className="space-y-6">
          <div className="flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Saldo disponível para saque:{" "}
              {formatCurrency(wallet?.availableBalance || 0)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor do Saque
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0,00"
                  max={wallet?.availableBalance || 0}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 dark:text-slate-400">R$</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={withdrawDescription}
                onChange={(e) => setWithdrawDescription(e.target.value)}
                placeholder="Ex: Saque mensal"
                className="w-full rounded-lg border border-slate-300 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Referência (opcional)
              </label>
              <input
                type="text"
                value={withdrawReference}
                onChange={(e) => setWithdrawReference(e.target.value)}
                placeholder="Ex: Pagamento #12345"
                className="w-full rounded-lg border border-slate-300 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Certifique-se de que os dados estão corretos antes de confirmar
            </span>
          </div>
        </div>
        <div className="modal-action mt-8 flex gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setShowTransferModal(false)}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
            onClick={handleWithdraw}
          >
            Confirmar Saque
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowTransferModal(false)}>close</button>
      </form>
    </dialog>
  );

  // Modal para seleção de tipo de carteira
  const WalletTypeSelectionModal = () => (
    <dialog
      id="wallet_type_selection_modal"
      className="modal modal-middle"
      open={showWalletTypeSelection}
    >
      <div className="modal-box bg-white dark:bg-slate-800 shadow-xl rounded-lg max-w-3xl">
        <WalletTypeSelection
          onCreateWallet={handleCreateWalletByType}
          onCancel={() => setShowWalletTypeSelection(false)}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowWalletTypeSelection(false)}>close</button>
      </form>
    </dialog>
  );

  const SellerSelector = () => {
    if (sellers.length === 0) return null;

    // Estado para controlar o dropdown
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Vendedor
        </label>
        <div className="relative">
          <div
            className={`p-3 border ${
              !selectedSellerId
                ? "border-red-300 dark:border-red-600"
                : "border-slate-300 dark:border-slate-600"
            } rounded-lg flex justify-between items-center cursor-pointer bg-white dark:bg-slate-800`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedSellerId ? (
              <div className="flex items-center">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-white">
                    {sellers.find((s) => s.id === selectedSellerId)?.name ||
                      selectedSellerId}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {sellers.find((s) => s.id === selectedSellerId)
                      ?.description || "Sem descrição"}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                Selecione um vendedor...
              </span>
            )}
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </div>

          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {sellerLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-slate-600 dark:text-slate-300">
                    Carregando vendedores...
                  </span>
                </div>
              ) : sellers.length > 0 ? (
                sellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => {
                      setSelectedSellerId(seller.id);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white flex items-center">
                            {seller.name || seller.id}
                            {selectedSellerId === seller.id && (
                              <Check className="w-4 h-4 text-green-500 ml-2" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {seller.description || "Sem descrição"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                  Nenhum vendedor encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const WalletSelectorModal = () => (
    <dialog
      id="wallet_selector_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showWalletSelector}
    >
      <div className="modal-box bg-white dark:bg-slate-800 shadow-xl rounded-lg">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-indigo-600" />
          Selecionar Carteira
        </h3>
        <div className="space-y-4">
          {wallets.map((walletItem) => (
            <div
              key={walletItem.id}
              className={`p-4 rounded-lg border ${
                wallet?.id === walletItem.id
                  ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-700"
                  : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
              } cursor-pointer transition-colors`}
              onClick={() => switchToWallet(walletItem)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-slate-800 dark:text-white">
                    Carteira {getWalletTypeLabel(walletItem.walletType)}
                  </span>
                </div>
                {walletItem.isDefault && (
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded dark:bg-indigo-900/40 dark:text-indigo-300">
                    Padrão
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Disponível
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {formatCurrency(walletItem.availableBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {formatCurrency(walletItem.totalBalance)}
                  </p>
                </div>
              </div>

              {!walletItem.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWalletAsDefault(walletItem.id);
                  }}
                  className="mt-3 w-full text-center text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 py-1.5"
                >
                  Definir como Padrão
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="modal-action mt-8 flex gap-3 justify-end">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setShowWalletSelector(false)}
          >
            Fechar
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowWalletSelector(false)}>close</button>
      </form>
    </dialog>
  );

  return (
    <div className="min-h-[94vh] bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      {contextHolder}
      <div
        className={`container mx-auto px-4 py-8 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
              <Wallet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Minha Carteira
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Acompanhe seu saldo e movimentações financeiras
            </p>
          </div>
          <div className="flex space-x-2">
            {wallets.length > 1 && (
              <button
                onClick={() => setShowWalletSelector(true)}
                className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 transition-colors"
                title="Selecionar carteira"
              >
                <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </button>
            )}
            <button
              onClick={loadData}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
              title="Atualizar dados"
            >
              <RefreshCcw className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {!sellerLoading && sellers.length > 0 && !selectedSellerId && (
          <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
              Selecione um Vendedor
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Por favor, selecione um vendedor para visualizar suas carteiras.
            </p>

            <SellerSelector />
          </div>
        )}

        {!sellerLoading && sellers.length === 0 && (
          <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
              Nenhum vendedor encontrado
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Não encontramos nenhum vendedor associado à sua conta. Entre em
              contato com o suporte para mais informações.
            </p>

            <a
              href="/support"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
            >
              Falar com o Suporte
            </a>
          </div>
        )}

        {/* Wallet Cards */}
        {/* Wallet Cards */}
        {wallets.length > 0 && (
          <div className="mb-8">
            {/* Título da seção com indicação do tipo de configuração */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-slate-800 dark:text-white">
                {getWalletConfiguration()}
              </h2>
            </div>

            {/* Grid para mostrar as carteiras */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mostrar carteiras de acordo com a configuração */}
              {wallets.map((walletItem) => (
                <div
                  key={walletItem.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer
            ${
              wallet?.id === walletItem.id
                ? "border-indigo-300 dark:border-indigo-700"
                : "border-slate-200 dark:border-slate-700"
            }
            ${
              walletItem.walletType === 0
                ? "bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800"
                : walletItem.walletType === 1
                ? "bg-gradient-to-b from-rose-50 to-white dark:from-rose-900/20 dark:to-slate-800"
                : ""
            }
          `}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                          {walletItem.walletType === 0 ? (
                            <>
                              <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              Carteira de Depósito
                            </>
                          ) : walletItem.walletType === 1 ? (
                            <>
                              <ArrowDownRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                              Carteira de Saque
                            </>
                          ) : (
                            <>
                              <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              Carteira Geral
                            </>
                          )}

                          {walletItem.isDefault && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded dark:bg-indigo-900/40 dark:text-indigo-300 ml-2">
                              Padrão
                            </span>
                          )}
                        </h2>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium text-emerald-800 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Ativa
                      </div>
                    </div>

                    <div className="mb-5">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        Saldo Total
                      </p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {formatCurrency(walletItem.totalBalance)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Disponível
                        </p>
                        <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(walletItem.availableBalance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Pendente
                        </p>
                        <p className="text-lg font-semibold text-amber-500 dark:text-amber-400">
                          {formatCurrency(walletItem.pendingBalance)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-4 flex justify-between items-center">
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3 mr-1" />
                        Atualizado em {formatDate(walletItem.lastUpdateAt)}
                      </div>
                      <div className="flex space-x-1">
                        {/* Mostrar botões específicos por tipo de carteira */}
                        {walletItem.walletType === 0 ||
                        walletItem.walletType === 2 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setWallet(walletItem);
                              setShowDepositModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
                          >
                            Depositar
                          </button>
                        ) : null}

                        {walletItem.walletType === 1 ||
                        walletItem.walletType === 2 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setWallet(walletItem);
                              setShowTransferModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                          >
                            Sacar
                          </button>
                        ) : null}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            switchToWallet(walletItem);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detalhes e Transações da Carteira Selecionada */}
        {wallet && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-8">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <div className="flex overflow-x-auto">
                <button
                  className={`px-5 py-4 font-medium text-sm whitespace-nowrap ${
                    activeTab === "transactions"
                      ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                      : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                  onClick={() => setActiveTab("transactions")}
                >
                  Movimentações
                </button>
                <button
                  className={`px-5 py-4 font-medium text-sm whitespace-nowrap ${
                    activeTab === "details"
                      ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                      : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Detalhes da Carteira
                </button>
              </div>
            </div>

            {/* Conteúdo da aba de transações */}
            {activeTab === "transactions" && (
              <div className="p-6">
                <h3 className="font-medium text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                  {wallet.walletType === 0 ? (
                    <>
                      <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Transações da Carteira de Depósito
                    </>
                  ) : wallet.walletType === 1 ? (
                    <>
                      <ArrowDownRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      Transações da Carteira de Saque
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      Transações da Carteira Geral
                    </>
                  )}
                </h3>

                {/* Resumo de Transações */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">
                      Total Créditos
                    </p>
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(transactionHistory.summary.totalCredits)}
                    </p>
                  </div>
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                    <p className="text-sm text-rose-600 dark:text-rose-400 mb-1">
                      Total Débitos
                    </p>
                    <p className="text-xl font-bold text-rose-700 dark:text-rose-400">
                      {formatCurrency(transactionHistory.summary.totalDebits)}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Saldo Líquido
                    </p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">
                      {formatCurrency(transactionHistory.summary.netAmount)}
                    </p>
                  </div>
                </div>

                {/* Lista de Transações */}
                {transactionHistory.transactions &&
                transactionHistory.transactions.length > 0 ? (
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
                        {transactionHistory.transactions.map((transaction) => (
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
                              : transaction.status?.toLowerCase() ===
                                "cancelled"
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
                {transactionHistory.pagination &&
                  transactionHistory.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Mostrando {transactionHistory.pagination.currentPage} de{" "}
                        {transactionHistory.pagination.totalPages} páginas
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            loadTransactions(
                              wallet.id,
                              Math.max(1, currentPage - 1),
                              pageSize
                            )
                          }
                          disabled={currentPage <= 1}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage <= 1
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                          }`}
                        >
                          Anterior
                        </button>
                        <button
                          onClick={() =>
                            loadTransactions(
                              wallet.id,
                              Math.min(
                                transactionHistory.pagination.totalPages,
                                currentPage + 1
                              ),
                              pageSize
                            )
                          }
                          disabled={
                            currentPage >=
                            transactionHistory.pagination.totalPages
                          }
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage >=
                            transactionHistory.pagination.totalPages
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
            )}

            {/* Conteúdo da aba de detalhes */}
            {activeTab === "details" && (
              <div className="p-6">
                <h3 className="font-medium text-lg mb-6 text-slate-800 dark:text-white">
                  Detalhes da Carteira
                </h3>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-5 mb-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        ID da Carteira:
                      </span>
                      <span className="font-mono text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                        {wallet.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        ID do Vendedor:
                      </span>
                      <span className="font-mono text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                        {wallet.sellerId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        Tipo de Carteira:
                      </span>
                      <span className="font-medium">
                        {getWalletTypeLabel(wallet.walletType)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        Data de Criação:
                      </span>
                      <span className="font-medium">
                        {formatDate(wallet.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        Última Atualização:
                      </span>
                      <span className="font-medium">
                        {formatDateTime(wallet.lastUpdateAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-600 pt-4 mt-4">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Saldo Total
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(wallet.totalBalance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Disponível
                      </p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(wallet.availableBalance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Pendente
                      </p>
                      <p className="font-semibold text-amber-500 dark:text-amber-400">
                        {formatCurrency(wallet.pendingBalance)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Demonstrativo mensal disponível para download</span>
                  </div>
                  <button className="mt-2 w-full px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium flex items-center justify-center gap-2 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 transition-colors">
                    <Download className="w-4 h-4" />
                    Baixar Extrato
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State (quando não houver carteira) */}
        {!wallet && !sellerLoading && selectedSellerId && (
          <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
              Carteira não encontrada
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Não foi possível encontrar uma carteira para este vendedor. Você
              pode criar uma nova configuração de carteira.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowWalletTypeSelection(true)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Configurar Carteiras
              </button>

              <a
                href="/support"
                className="px-4 py-2 rounded-lg border
                border-slate-300 hover:bg-slate-50 text-slate-700 font-medium
                dark:border-slate-600 dark:text-slate-300
                dark:hover:bg-slate-700 transition-colors"
              >
                Falar com o Suporte
              </a>
            </div>
          </div>
        )}

        {/* Tabs & Content */}
        {wallet && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Aqui continuaria o código com todas as abas de conteúdo */}
          </div>
        )}
      </div>

      {/* Modals */}
      {wallet && <DepositModal />}
      {wallet && <TransferModal />}
      {wallets.length > 0 && <WalletSelectorModal />}
      <WalletTypeSelectionModal />
    </div>
  );
};

export default WalletManagement;
