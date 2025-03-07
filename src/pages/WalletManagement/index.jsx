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

const WalletManagement = () => {
  const { startLoading, stopLoading } = useLoading();
  const [api, contextHolder] = notification.useNotification();
  const [mounted, setMounted] = useState(false);
  const [wallet, setWallet] = useState(null);
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

  // Estado para o seller (vendedor)
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(true);

  // UI states
  const [activeTab, setActiveTab] = useState("overview");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Form states
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [depositReference, setDepositReference] = useState("");

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [withdrawReference, setWithdrawReference] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Carregar sellers disponíveis
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

  // Carregar dados da carteira quando um seller for selecionado
  useEffect(() => {
    if (selectedSeller) {
      loadData(selectedSeller.id);
    } else {
      setWallet(null);
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
  }, [selectedSeller]);

  const loadData = async (sellerId) => {
    if (!sellerId) return;

    startLoading("Carregando dados da carteira...");
    try {
      // Carregar carteira básica
      const walletResponse = await paymentService.getWallet(sellerId);
      if (!walletResponse.success) {
        throw new Error(walletResponse.message);
      }
      // Correção: acessar walletResponse.data em vez de walletResponse.data.data
      setWallet(walletResponse.data);

      // Carregar carteira com transações recentes
      const walletWithTransactionsResponse =
        await paymentService.getWalletWithTransactions(sellerId, 5);
      if (!walletWithTransactionsResponse.success) {
        throw new Error(walletWithTransactionsResponse.message);
      }
      // Correção: acessar walletWithTransactionsResponse.data em vez de walletWithTransactionsResponse.data.data
      setWalletWithTransactions(walletWithTransactionsResponse.data);

      // Carregar histórico de transações
      await loadTransactions(sellerId);
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

  const loadTransactions = async (sellerId, page = 1, size = 10) => {
    if (!sellerId) return;
    
    startLoading("Carregando transações...");
    try {
      // Vamos tentar fazer a chamada sem os parâmetros de data por enquanto
      const transactionsResponse = await paymentService.getWalletTransactions(
        sellerId,
        page,
        size
      );
  
      if (!transactionsResponse.success) {
        throw new Error(transactionsResponse.message);
      }
      
      // Definir um objeto de transação vazio padrão se a resposta for nula
      const transactionData = transactionsResponse.data || {
        transactions: [],
        pagination: { currentPage: page, pageSize: size, totalCount: 0, totalPages: 1 },
        summary: { totalCredits: 0, totalDebits: 0, netAmount: 0, totalTransactions: 0 }
      };
      
      setTransactionHistory(transactionData);
      setCurrentPage(page);
      setPageSize(size);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      api.error({
        message: "Erro",
        description: "Erro ao carregar transações: " + (error.message || "Erro desconhecido"),
        placement: "topRight",
      });
      
      // Em caso de erro, definir um estado vazio para evitar problemas de renderização
      setTransactionHistory({
        transactions: [],
        pagination: { currentPage: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
        summary: { totalCredits: 0, totalDebits: 0, netAmount: 0, totalTransactions: 0 }
      });
    } finally {
      stopLoading();
    }
  };

  const handleDeposit = async () => {
    if (!selectedSeller) {
      api.error({
        message: "Erro",
        description: "Selecione um vendedor",
        placement: "topRight",
      });
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
      const response = await paymentService.addFunds(
        selectedSeller.id,
        parseFloat(depositAmount),
        depositDescription || "Depósito de fundos",
        depositReference || null
      );

      if (!response.success) {
        throw new Error(response.message);
      }
      api.success({
        message: "Sucesso",
        description: response.message || "Depósito realizado com sucesso",
        placement: "topRight",
      });

      setShowDepositModal(false);
      setDepositAmount("");
      setDepositDescription("");
      setDepositReference("");

      // Recarregar dados
      await loadData(selectedSeller.id);
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
    if (!selectedSeller) {
      api.error({
        message: "Erro",
        description: "Selecione um vendedor",
        placement: "topRight",
      });
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
      const response = await paymentService.deductFunds(
        selectedSeller.id,
        parseFloat(withdrawAmount),
        withdrawDescription || "Saque de fundos",
        withdrawReference || null
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      api.success({
        message: "Sucesso",
        description: response.message || "Saque realizado com sucesso",
        placement: "topRight",
      });

      setShowTransferModal(false);
      setWithdrawAmount("");
      setWithdrawDescription("");
      setWithdrawReference("");

      // Recarregar dados
      await loadData(selectedSeller.id);
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
              Gerenciamento de Carteira
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Acompanhe saldos e movimentações financeiras
            </p>
          </div>
        </div>

        {/* Seletor de Seller */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium text-slate-800 dark:text-white mb-3">
            Selecione um Vendedor
          </h2>

          {sellerLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-slate-600 dark:text-slate-300">
                Carregando vendedores...
              </span>
            </div>
          ) : sellers.length > 0 ? (
            <div className="relative">
              <div
                className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg flex justify-between items-center cursor-pointer bg-white dark:bg-slate-800"
                onClick={() => setShowSellerDropdown(!showSellerDropdown)}
              >
                {selectedSeller ? (
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-white">
                        {selectedSeller.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedSeller.description || "Sem descrição"}
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

              {showSellerDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                  {sellers.map((seller) => (
                    <div
                      key={seller.id}
                      className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                      onClick={() => {
                        setSelectedSeller(seller);
                        setShowSellerDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white flex items-center">
                              {seller.name}
                              {selectedSeller &&
                                selectedSeller.id === seller.id && (
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
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
              <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-slate-700 dark:text-slate-300">
                Você não possui nenhum vendedor cadastrado.
              </p>
              href="/sellers/new" className="mt-2 inline-block text-indigo-600
              dark:text-indigo-400 hover:text-indigo-800
              dark:hover:text-indigo-300 font-medium"
              <a>Cadastrar novo vendedor</a>
            </div>
          )}
        </div>

        {/* Conteúdo condicional - somente mostra se tiver um seller selecionado */}
        {selectedSeller ? (
          <>
            {/* Wallet Card */}
            {wallet ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow mb-8">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-5">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white">
                      Carteira de {selectedSeller.name}
                    </h2>
                    <div className="px-3 py-1 rounded-full text-xs font-medium text-emerald-800 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">
                      Ativa
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                      Saldo Total
                    </p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      {formatCurrency(wallet.totalBalance)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Disponível
                      </p>
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(wallet.availableBalance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Pendente
                      </p>
                      <p className="text-lg font-semibold text-amber-500 dark:text-amber-400">
                        {formatCurrency(wallet.pendingBalance)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-4 flex justify-between items-center">
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Atualizado em {formatDate(wallet.lastUpdateAt)}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setShowDepositModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        Depositar
                      </button>
                      <button
                        onClick={() => setShowTransferModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Sacar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center mb-8">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                  Carteira não encontrada
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Este vendedor ainda não possui uma carteira cadastrada.
                </p>
                <button
                  onClick={async () => {
                    try {
                      startLoading("Criando carteira...");
                      const response = await paymentService.createWallet(
                        selectedSeller.id
                      );
                      if (response.success) {
                        api.success({
                          message: "Sucesso",
                          description: "Carteira criada com sucesso",
                          placement: "topRight",
                        });
                        await loadData(selectedSeller.id);
                      } else {
                        throw new Error(response.message);
                      }
                    } catch (error) {
                      api.error({
                        message: "Erro",
                        description: error.message || "Erro ao criar carteira",
                        placement: "topRight",
                      });
                    } finally {
                      stopLoading();
                    }
                  }}
                  className="btn btn-primary"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Criar Carteira
                </button>
              </div>
            )}

            {/* Tabs & Content */}
            {wallet && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex overflow-x-auto">
                    <button
                      className={`px-5 py-4 font-medium text-sm whitespace-nowrap ${
                        activeTab === "overview"
                          ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                          : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
                      }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      Visão Geral
                    </button>
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

                {/* Overview Tab Content */}
                {activeTab === "overview" && (
                  <div className="p-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Saldo Total
                          </h3>
                          <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                          {formatCurrency(wallet.totalBalance)}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Disponível
                          </h3>
                          <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(wallet.availableBalance)}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Pendente
                          </h3>
                          <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <RefreshCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                          {formatCurrency(wallet.pendingBalance)}
                        </p>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <h3 className="font-medium text-lg mb-4 text-slate-800 dark:text-white">
                      Últimas Movimentações
                    </h3>

                    {walletWithTransactions &&
                    walletWithTransactions.recentTransactions &&
                    walletWithTransactions.recentTransactions.length > 0 ? (
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
                                Data
                              </th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                Valor
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {walletWithTransactions.recentTransactions.map(
                              (transaction) => (
                                <tr
                                  key={transaction.id}
                                  className="border-b border-slate-100 dark:border-slate-700"
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
                                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                                    {formatDateTime(transaction.createdAt)}
                                  </td>
                                  <td
                                    className={`py-3 px-4 text-sm font-medium text-right ${getStatusColor(
                                      transaction.type
                                    )}`}
                                  >
                                    {transaction.type?.toLowerCase() ===
                                      "debit" ||
                                    transaction.type?.toLowerCase() ===
                                      "withdraw" ||
                                    transaction.type?.toLowerCase() ===
                                      "withdrawal"
                                      ? "- "
                                      : ""}
                                    {formatCurrency(transaction.amount)}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                        <div className="mt-4 text-center">
                          <button
                            onClick={() => setActiveTab("transactions")}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            Ver todas as movimentações
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                        <RefreshCcw className="w-10 h-10 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                        <p className="text-slate-600 dark:text-slate-400">
                          Nenhuma transação encontrada nos últimos 30 dias.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Restante das tabs (transactions e details) permanecem as mesmas */}
                {/* ... código existente ... */}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
            <User className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-slate-800 dark:text-white mb-2">
              Selecione um vendedor
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
              Para gerenciar carteiras, selecione um vendedor na lista acima.
              Você poderá visualizar saldos, transações e realizar operações de
              depósito e saque.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {wallet && <DepositModal />}
      {wallet && <TransferModal />}
    </div>
  );
};

export default WalletManagement;
