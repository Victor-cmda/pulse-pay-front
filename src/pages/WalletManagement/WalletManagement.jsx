import React, { useState, useEffect } from "react";
import {
  Wallet,
  RefreshCcw,
  User,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  ArrowRight,
  PiggyBank,
} from "lucide-react";
import { notification } from "antd";
import { paymentService } from "../../services/PaymentService";
import { authService } from "../../services/AuthService";
import { useLoading } from "../../context/LoadingContext";
import { WalletTypeSelection } from "./index";
import {
  WalletCard,
  WalletSelector,
  WalletDetails,
  DepositModal,
  WithdrawModal,
  TransactionList,
  EmptyWalletState,
  SellerSelector,
} from "../../components/wallet";

const WalletManagement = () => {
  const { startLoading, stopLoading } = useLoading();
  const [api, contextHolder] = notification.useNotification();
  const [mounted, setMounted] = useState(false);

  // Seller state
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState(null);

  // Wallet state
  const [activeWallet, setActiveWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [walletWithTransactions, setWalletWithTransactions] = useState(null);

  // Categorized wallets by type
  const [depositWallet, setDepositWallet] = useState(null);
  const [withdrawalWallet, setWithdrawalWallet] = useState(null);
  const [generalWallet, setGeneralWallet] = useState(null);

  // Transaction state
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

  // UI state
  const [activeTab, setActiveTab] = useState("transactions");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showWalletTypeSelection, setShowWalletTypeSelection] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    sourceWallet: null,
    destinationWallet: null,
    amount: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load sellers when component is mounted
  useEffect(() => {
    const loadSellers = async () => {
      try {
        setSellerLoading(true);
        const sellersResponse = await authService.getAvailableSellers();

        if (sellersResponse.success && sellersResponse.data) {
          setSellers(sellersResponse.data || []);
        } else {
          console.error("Error loading sellers:", sellersResponse.message);
          setSellers([]);
        }
      } catch (error) {
        console.error("Error loading sellers:", error);
        setSellers([]);
      } finally {
        setSellerLoading(false);
      }
    };

    loadSellers();
    setMounted(true);
  }, []);

  // Load wallet data when seller is selected
  useEffect(() => {
    if (selectedSellerId) {
      loadData();
    }
  }, [selectedSellerId]);

  // Function to categorize wallets by type
  const categorizeWallets = (walletsList) => {
    let deposit = null;
    let withdrawal = null;
    let general = null;

    walletsList.forEach((wallet) => {
      if (wallet.walletType === 0) {
        deposit = wallet;
      } else if (wallet.walletType === 1) {
        withdrawal = wallet;
      } else if (wallet.walletType === 2) {
        general = wallet;
      }
    });

    setDepositWallet(deposit);
    setWithdrawalWallet(withdrawal);
    setGeneralWallet(general);
  };

  // Load wallet data
  const loadData = async () => {
    if (!selectedSellerId) return;

    startLoading("Carregando dados da carteira...");
    try {
      const walletsResponse = await paymentService.getSellerWallets(
        selectedSellerId
      );

      if (!walletsResponse.success) {
        throw new Error(
          walletsResponse.message || "Erro ao carregar carteiras"
        );
      }

      const carteiras = walletsResponse.data;

      if (Array.isArray(carteiras) && carteiras.length > 0) {
        setWallets(carteiras);

        // Categorize wallets
        categorizeWallets(carteiras);

        // Set default active wallet based on available wallets
        const defaultWallet =
          carteiras.find((w) => w.isDefault) || carteiras[0];
        setActiveWallet(defaultWallet);

        if (defaultWallet?.id) {
          await loadWalletTransactions(defaultWallet.id);
        }
      } else {
        setActiveWallet(null);
        setWallets([]);
        setWalletWithTransactions(null);
        resetTransactionHistory();
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showErrorNotification(
        "Erro ao carregar dados da carteira",
        error.message
      );
    } finally {
      stopLoading();
    }
  };

  // Reset transaction history
  const resetTransactionHistory = () => {
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
  };

  // Load wallet transactions
  const loadWalletTransactions = async (walletId) => {
    try {
      const walletWithTransactionsResponse =
        await paymentService.getWalletWithTransactions(walletId, 5);

      if (
        walletWithTransactionsResponse.success &&
        walletWithTransactionsResponse.data
      ) {
        setWalletWithTransactions(walletWithTransactionsResponse.data);
      }

      await loadTransactions(walletId);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  // Load transactions with pagination
  const loadTransactions = async (walletId, page = 1, size = 10) => {
    startLoading("Carregando transações...");
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const response = await paymentService.getWalletTransactions(
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
      console.error("Error loading transactions:", error);
      showErrorNotification("Erro ao carregar transações", error.message);
    } finally {
      stopLoading();
    }
  };

  // Get the wallet label based on type
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

  // Check if wallet is valid for deposits
  const canDepositToWallet = (wallet) => {
    return wallet && (wallet.walletType === 0 || wallet.walletType === 2);
  };

  // Check if wallet is valid for withdrawals
  const canWithdrawFromWallet = (wallet) => {
    return wallet && (wallet.walletType === 1 || wallet.walletType === 2);
  };

  // Handle deposit process - exclusively via PIX
  const handleDeposit = async (amount, description, reference) => {
    if (!activeWallet?.id) {
      showErrorNotification("Erro", "ID da carteira não encontrado");
      return null;
    }

    // Verify wallet type for deposits
    if (!canDepositToWallet(activeWallet)) {
      showErrorNotification(
        "Carteira incorreta",
        "Por favor, use a carteira de depósito para esta operação"
      );

      // Try to set the appropriate wallet
      if (depositWallet) {
        setActiveWallet(depositWallet);
      } else if (generalWallet) {
        setActiveWallet(generalWallet);
      }

      return null;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showErrorNotification("Erro", "Por favor, insira um valor válido");
      return null;
    }

    startLoading("Gerando QR Code PIX...");
    try {
      const depositRequest = {
        sellerId: selectedSellerId,
        walletId: activeWallet.id,
        amount: parseFloat(amount),
      };

      const response = await paymentService.createDeposit(depositRequest);

      if (!response.success) {
        throw new Error(response.message || "Erro ao processar depósito");
      }

      showSuccessNotification(
        "QR Code gerado",
        "Escaneie o QR Code para concluir o pagamento"
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao processar depósito:", error);
      showErrorNotification(
        "Erro",
        error.message || "Erro ao processar depósito"
      );
      return null;
    } finally {
      stopLoading();
    }
  };

  const handleWithdraw = async (amount, description, reference) => {
    if (!activeWallet?.id) {
      showErrorNotification("Erro", "ID da carteira não encontrado");
      return;
    }

    if (!canWithdrawFromWallet(activeWallet)) {
      showErrorNotification(
        "Carteira incorreta",
        "Por favor, use a carteira de saque para esta operação"
      );

      if (withdrawalWallet) {
        setActiveWallet(withdrawalWallet);
      } else if (generalWallet) {
        setActiveWallet(generalWallet);
      }

      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showErrorNotification("Erro", "Por favor, insira um valor válido");
      return;
    }

    if (parseFloat(amount) > (activeWallet?.availableBalance || 0)) {
      showErrorNotification("Erro", "Saldo insuficiente");
      return;
    }

    startLoading("Processando saque...");
    try {
      const response = await paymentService.withdrawFunds(activeWallet.id, {
        amount: parseFloat(amount),
        description: description || "Saque de fundos",
        reference: reference || null,
      });

      if (!response.success) {
        throw new Error(response.message || "Erro ao processar saque");
      }

      showSuccessNotification("Sucesso", "Saque realizado com sucesso");
      setShowWithdrawModal(false);

      await loadData();
    } catch (error) {
      console.error("Erro ao processar saque:", error);
      showErrorNotification("Erro", error.message || "Erro ao processar saque");
    } finally {
      stopLoading();
    }
  };

  const handleTransfer = async () => {
    const { sourceWallet, destinationWallet, amount, description } =
      transferData;

    if (!sourceWallet || !destinationWallet) {
      showErrorNotification(
        "Erro",
        "Selecione as carteiras de origem e destino"
      );
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showErrorNotification("Erro", "Por favor, insira um valor válido");
      return;
    }

    if (parseFloat(amount) > (sourceWallet?.availableBalance || 0)) {
      showErrorNotification("Erro", "Saldo insuficiente na carteira de origem");
      return;
    }

    startLoading("Processando transferência entre carteiras...");
    try {
      const response = await paymentService.transferFunds(
        sourceWallet.id,
        destinationWallet.id,
        {
          amount: parseFloat(amount),
          description: description || "Transferência entre carteiras",
        }
      );

      if (!response.success) {
        throw new Error(
          response.message || "Erro ao transferir entre carteiras"
        );
      }

      showSuccessNotification("Sucesso", "Transferência realizada com sucesso");
      setShowTransferModal(false);
      setTransferData({
        sourceWallet: null,
        destinationWallet: null,
        amount: "",
        description: "",
      });

      await loadData();
    } catch (error) {
      console.error("Erro ao transferir fundos:", error);
      showErrorNotification(
        "Erro",
        error.message || "Erro ao transferir fundos"
      );
    } finally {
      stopLoading();
    }
  };

  const setWalletAsDefault = async (walletId) => {
    startLoading("Definindo carteira padrão...");
    try {
      const response = await paymentService.setDefaultWallet(
        walletId,
        selectedSellerId
      );

      if (!response.success) {
        throw new Error(response.message || "Erro ao definir carteira padrão");
      }

      showSuccessNotification(
        "Sucesso",
        "Carteira definida como padrão com sucesso"
      );

      await loadData();
    } catch (error) {
      console.error("Erro ao definir carteira padrão:", error);
      showErrorNotification(
        "Erro",
        error.message || "Erro ao definir carteira padrão"
      );
    } finally {
      stopLoading();
      setShowWalletSelector(false);
    }
  };

  const switchToWallet = async (newWallet) => {
    setActiveWallet(newWallet);
    if (newWallet?.id) {
      await loadWalletTransactions(newWallet.id);
    }
    setShowWalletSelector(false);
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

  const createWallet = async (walletType, isDefault = true) => {
    try {
      startLoading(`Criando carteira de ${getWalletTypeLabel(walletType)}...`);
      const response = await paymentService.createWallet({
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

      showSuccessNotification(
        "Sucesso",
        `Carteira de ${getWalletTypeLabel(walletType)} criada com sucesso`
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao criar carteira:", error);
      showErrorNotification(
        "Erro",
        error.message ||
          `Erro ao criar carteira de ${getWalletTypeLabel(walletType)}`
      );
      throw error;
    }
  };

  const showErrorNotification = (title, message) => {
    api.error({
      message: title,
      description: message,
      placement: "topRight",
    });
  };

  const showSuccessNotification = (title, message) => {
    api.success({
      message: title,
      description: message,
      placement: "topRight",
    });
  };

  const hasDepositWallet = Boolean(depositWallet);
  const hasWithdrawalWallet = Boolean(withdrawalWallet);
  const hasGeneralWallet = Boolean(generalWallet);

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

  const prepareTransfer = () => {
    let source = null;
    let destination = null;

    if (depositWallet && withdrawalWallet) {
      source = depositWallet;
      destination = withdrawalWallet;
    } else if (generalWallet) {
      source = generalWallet;
      destination = generalWallet;
    }

    setTransferData({
      ...transferData,
      sourceWallet: source,
      destinationWallet: destination,
    });

    setShowTransferModal(true);
  };

  // Render deposit modal
  const renderDepositModal = () => (
    <dialog
      id="deposit_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showDepositModal}
    >
      <div className="modal-box bg-white dark:bg-slate-800 shadow-xl rounded-lg">
        <DepositModal
          wallet={activeWallet}
          onDeposit={handleDeposit}
          onClose={() => setShowDepositModal(false)}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowDepositModal(false)}>close</button>
      </form>
    </dialog>
  );

  const renderWithdrawModal = () => (
    <dialog
      id="withdraw_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showWithdrawModal}
    >
      <div className="modal-box bg-white dark:bg-slate-800 shadow-xl rounded-lg">
        <WithdrawModal
          wallet={activeWallet}
          onWithdraw={handleWithdraw}
          onClose={() => setShowWithdrawModal(false)}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowWithdrawModal(false)}>close</button>
      </form>
    </dialog>
  );

  const renderWalletSelectorModal = () => (
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
        <WalletSelector
          wallets={wallets}
          currentWallet={activeWallet}
          onSelectWallet={switchToWallet}
          onSetDefault={setWalletAsDefault}
          onClose={() => setShowWalletSelector(false)}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowWalletSelector(false)}>close</button>
      </form>
    </dialog>
  );

  const renderWalletTypeSelectionModal = () => (
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

  const renderTransferModal = () => (
    <dialog
      id="transfer_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showTransferModal}
    >
      <div className="modal-box bg-white dark:bg-slate-800 shadow-xl rounded-lg">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Transferir Entre Carteiras
        </h3>

        <div className="space-y-6">
          <div className="flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Transferência entre carteiras</p>
              <p className="text-sm">
                Transferir saldo de uma carteira para outra. Ideal para
                movimentar saldo da carteira de depósito para a carteira de
                saque.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Carteira de Origem
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 py-3 px-4 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                value={transferData.sourceWallet?.id || ""}
                onChange={(e) => {
                  const wallet = wallets.find((w) => w.id === e.target.value);
                  setTransferData({ ...transferData, sourceWallet: wallet });
                }}
              >
                <option value="">Selecione a carteira de origem</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    Carteira de {getWalletTypeLabel(wallet.walletType)} - Saldo:
                    R${wallet.availableBalance.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Carteira de Destino
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 py-3 px-4 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                value={transferData.destinationWallet?.id || ""}
                onChange={(e) => {
                  const wallet = wallets.find((w) => w.id === e.target.value);
                  setTransferData({
                    ...transferData,
                    destinationWallet: wallet,
                  });
                }}
              >
                <option value="">Selecione a carteira de destino</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    Carteira de {getWalletTypeLabel(wallet.walletType)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor a Transferir
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={transferData.amount}
                  onChange={(e) =>
                    setTransferData({ ...transferData, amount: e.target.value })
                  }
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
                value={transferData.description}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    description: e.target.value,
                  })
                }
                placeholder="Ex: Transferência para pagamentos"
                className="w-full rounded-lg border border-slate-300 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="modal-action mt-8 flex gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
            onClick={() => setShowTransferModal(false)}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 transition-colors"
            onClick={handleTransfer}
            disabled={
              !transferData.sourceWallet ||
              !transferData.destinationWallet ||
              !transferData.amount
            }
          >
            <ArrowRight className="w-4 h-4" />
            Transferir Fundos
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowTransferModal(false)}>close</button>
      </form>
    </dialog>
  );

  const renderWalletSummary = () => {
    if (wallets.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-slate-800 dark:text-white flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {getWalletConfiguration()}
          </h2>

          {wallets.length > 1 && (
            <button
              onClick={prepareTransfer}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30 transition-colors flex items-center gap-1"
            >
              <ArrowRight className="w-3 h-3" />
              Transferir Entre Carteiras
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hasDepositWallet && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-900 overflow-hidden">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-900/50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                    <ArrowUpRight className="w-5 h-5" />
                    Carteira de Depósito
                  </h3>
                  {depositWallet.isDefault && (
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded dark:bg-emerald-900/40 dark:text-emerald-300">
                      Padrão
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-500">
                  Recebe todos os pagamentos e depósitos
                </p>
              </div>

              <div className="p-5">
                <div className="mb-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Saldo Total
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {depositWallet.totalBalance.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Disponível
                    </p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      R$ {depositWallet.availableBalance.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Pendente
                    </p>
                    <p className="text-lg font-semibold text-amber-500 dark:text-amber-400">
                      R$ {depositWallet.pendingBalance.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setActiveWallet(depositWallet);
                      setShowDepositModal(true);
                    }}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Depositar via PIX
                  </button>
                  <button
                    onClick={() => {
                      setActiveWallet(depositWallet);
                      loadWalletTransactions(depositWallet.id);
                    }}
                    className="py-2 px-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasWithdrawalWallet && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-rose-200 dark:border-rose-900 overflow-hidden">
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-200 dark:border-rose-900/50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-rose-800 dark:text-rose-400 flex items-center gap-2">
                    <ArrowDownRight className="w-5 h-5" />
                    Carteira de Saque
                  </h3>
                  {withdrawalWallet.isDefault && (
                    <span className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded dark:bg-rose-900/40 dark:text-rose-300">
                      Padrão
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 text-rose-700 dark:text-rose-500">
                  Utilizada para saques e reembolsos
                </p>
              </div>

              <div className="p-5">
                <div className="mb-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Saldo Total
                  </p>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    R$ {withdrawalWallet.totalBalance.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Disponível
                    </p>
                    <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                      R$ {withdrawalWallet.availableBalance.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Pendente
                    </p>
                    <p className="text-lg font-semibold text-amber-500 dark:text-amber-400">
                      R$ {withdrawalWallet.pendingBalance.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setActiveWallet(withdrawalWallet);
                      setShowWithdrawModal(true);
                    }}
                    className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
                    disabled={withdrawalWallet.availableBalance <= 0}
                  >
                    Sacar
                  </button>
                  <button
                    onClick={() => {
                      setActiveWallet(withdrawalWallet);
                      loadWalletTransactions(withdrawalWallet.id);
                    }}
                    className="py-2 px-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasGeneralWallet && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-900 overflow-hidden">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-900/50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-indigo-800 dark:text-indigo-400 flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Carteira Geral
                  </h3>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded dark:bg-indigo-900/40 dark:text-indigo-300">
                    Carteira Única
                  </span>
                </div>
                <p className="text-xs mt-1 text-indigo-700 dark:text-indigo-500">
                  Gerencia todos os depósitos e saques
                </p>
              </div>

              <div className="p-5">
                <div className="mb-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Saldo Total
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    R$ {generalWallet.totalBalance.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Disponível
                    </p>
                    <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      R$ {generalWallet.availableBalance.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Pendente
                    </p>
                    <p className="text-lg font-semibold text-amber-500 dark:text-amber-400">
                      R$ {generalWallet.pendingBalance.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setActiveWallet(generalWallet);
                      setShowDepositModal(true);
                    }}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Depositar via PIX
                  </button>
                  <button
                    onClick={() => {
                      setActiveWallet(generalWallet);
                      setShowWithdrawModal(true);
                    }}
                    className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
                    disabled={generalWallet.availableBalance <= 0}
                  >
                    Sacar
                  </button>
                  <button
                    onClick={() => {
                      setActiveWallet(generalWallet);
                      loadWalletTransactions(generalWallet.id);
                    }}
                    className="py-2 px-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[94vh] bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      {contextHolder}
      <div
        className={`container mx-auto px-4 py-8 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
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

            <SellerSelector
              sellers={sellers}
              selectedSellerId={selectedSellerId}
              onSelectSeller={setSelectedSellerId}
              loading={sellerLoading}
            />
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

        {renderWalletSummary()}

        {!activeWallet && !sellerLoading && selectedSellerId && (
          <EmptyWalletState
            onCreateWallet={() => setShowWalletTypeSelection(true)}
          />
        )}

        {activeWallet && (
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

            {activeTab === "transactions" && (
              <div className="p-6">
                <h3 className="font-medium text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                  {activeWallet.walletType === 0 ? (
                    <>
                      <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Transações da Carteira de Depósito
                    </>
                  ) : activeWallet.walletType === 1 ? (
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

                <TransactionList
                  transactions={transactionHistory.transactions}
                  pagination={transactionHistory.pagination}
                  summary={transactionHistory.summary}
                  onPageChange={(page) =>
                    loadTransactions(activeWallet.id, page, pageSize)
                  }
                />
              </div>
            )}

            {activeTab === "details" && (
              <div className="p-6">
                <WalletDetails wallet={activeWallet} />

                {/* Wallet type specific info */}
                {activeWallet.walletType === 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-emerald-800 dark:text-emerald-400 mb-1">
                          Carteira de Depósito
                        </h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-500">
                          Esta carteira é destinada a receber pagamentos e
                          depósitos. Para realizar saques, você pode transferir
                          o saldo para sua carteira de saque.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeWallet.walletType === 1 && (
                  <div className="mt-4 p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-rose-800 dark:text-rose-400 mb-1">
                          Carteira de Saque
                        </h4>
                        <p className="text-sm text-rose-700 dark:text-rose-500">
                          Esta carteira é destinada a realizar saques e
                          reembolsos. Para obter mais fundos, transfira da sua
                          carteira de depósito.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeWallet && renderDepositModal()}
      {activeWallet && renderWithdrawModal()}
      {wallets.length > 0 && renderWalletSelectorModal()}
      {renderWalletTypeSelectionModal()}
      {renderTransferModal()}
    </div>
  );
};

export default WalletManagement;
