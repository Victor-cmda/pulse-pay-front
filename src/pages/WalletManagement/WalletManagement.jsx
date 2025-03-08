import React, { useState, useEffect } from "react";
import { notification } from "antd";
import {
  Wallet,
  RefreshCcw,
  User,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
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

  // Carregar sellers quando componente é montado
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

  // Carregar dados das carteiras quando seller é selecionado
  useEffect(() => {
    if (selectedSellerId) {
      loadData();
    }
  }, [selectedSellerId]);

  // Função para carregar dados das carteiras
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
        resetTransactionHistory();
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showErrorNotification("Erro ao carregar dados da carteira", error.message);
    } finally {
      stopLoading();
    }
  };

  // Função para resetar o histórico de transações
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

  // Função para carregar transações de uma carteira
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

  // Função para carregar transações com paginação
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
      showErrorNotification("Erro ao carregar transações", error.message);
    } finally {
      stopLoading();
    }
  };

  // Handler para realização de depósito
  const handleDeposit = async (amount, description, reference) => {
    if (!wallet?.id) {
      showErrorNotification("Erro", "ID da carteira não encontrado");
      return;
    }

    if (
      hasDepositWallet &&
      hasWithdrawalWallet &&
      wallet.walletType !== 0 &&
      wallet.walletType !== 2
    ) {
      showErrorNotification(
        "Carteira incorreta",
        "Por favor, use a carteira de depósito para esta operação"
      );

      const depositWallet = wallets.find((w) => w.walletType === 0);
      if (depositWallet) {
        setWallet(depositWallet);
      }

      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showErrorNotification(
        "Erro",
        "Por favor, insira um valor válido"
      );
      return;
    }

    startLoading("Processando depósito...");
    try {
      const response = await paymentService.deposits(wallet.id, {
        amount: parseFloat(amount),
        description: description || "Depósito de fundos",
        reference: reference || null,
      });

      if (!response.success) {
        throw new Error(response.message || "Erro ao processar depósito");
      }

      showSuccessNotification("Sucesso", "Depósito realizado com sucesso");
      setShowDepositModal(false);
      setDepositAmount("");
      setDepositDescription("");
      setDepositReference("");

      await loadData();
    } catch (error) {
      console.error("Erro ao processar depósito:", error);
      showErrorNotification(
        "Erro",
        error.message || "Erro ao processar depósito"
      );
    } finally {
      stopLoading();
    }
  };

  // Handler para realização de saque
  const handleWithdraw = async (amount, description, reference) => {
    if (!wallet?.id) {
      showErrorNotification("Erro", "ID da carteira não encontrado");
      return;
    }

    if (
      hasDepositWallet &&
      hasWithdrawalWallet &&
      wallet.walletType !== 1 &&
      wallet.walletType !== 2
    ) {
      showErrorNotification(
        "Carteira incorreta",
        "Por favor, use a carteira de saque para esta operação"
      );

      const withdrawWallet = wallets.find((w) => w.walletType === 1);
      if (withdrawWallet) {
        setWallet(withdrawWallet);
      }

      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showErrorNotification(
        "Erro",
        "Por favor, insira um valor válido"
      );
      return;
    }

    if (parseFloat(amount) > (wallet?.availableBalance || 0)) {
      showErrorNotification("Erro", "Saldo insuficiente");
      return;
    }

    startLoading("Processando saque...");
    try {
      const response = await paymentService.withdrawals(wallet.id, {
        amount: parseFloat(amount),
        description: description || "Saque de fundos",
        reference: reference || null,
      });

      if (!response.success) {
        throw new Error(response.message || "Erro ao processar saque");
      }

      showSuccessNotification("Sucesso", "Saque realizado com sucesso");
      setShowTransferModal(false);
      setWithdrawAmount("");
      setWithdrawDescription("");
      setWithdrawReference("");

      await loadData();
    } catch (error) {
      console.error("Erro ao processar saque:", error);
      showErrorNotification(
        "Erro",
        error.message || "Erro ao processar saque"
      );
    } finally {
      stopLoading();
    }
  };

  // Handler para definir carteira como padrão
  const setWalletAsDefault = async (walletId) => {
    startLoading("Definindo carteira padrão...");
    try {
      const response = await paymentService.default(walletId, selectedSellerId);

      if (!response.success) {
        throw new Error(response.message || "Erro ao definir carteira padrão");
      }

      showSuccessNotification(
        "Sucesso",
        "Carteira definida como padrão com sucesso"
      );

      // Recarregar dados
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

  // Handler para trocas de carteira
  const switchToWallet = async (newWallet) => {
    setWallet(newWallet);
    if (newWallet?.id) {
      await loadWalletTransactions(newWallet.id);
    }
    setShowWalletSelector(false);
  };

  // Handler para criar carteiras baseado no tipo
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

  // Função para criar nova carteira
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

  // Função para exibir notificação de erro
  const showErrorNotification = (title, message) => {
    api.error({
      message: title,
      description: message,
      placement: "topRight",
    });
  };

  // Função para exibir notificação de sucesso
  const showSuccessNotification = (title, message) => {
    api.success({
      message: title,
      description: message,
      placement: "topRight",
    });
  };

  // Função auxiliar para obter o label do tipo de carteira
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

  // Verificações para tipo de carteira
  const hasDepositWallet = wallets.some((wallet) => wallet.walletType === 0);
  const hasWithdrawalWallet = wallets.some((wallet) => wallet.walletType === 1);
  const hasGeneralWallet = wallets.some((wallet) => wallet.walletType === 2);

  // Função para determinar a configuração atual das carteiras
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

  // Renderiza o modal de depósito
  const renderDepositModal = () => (
    <dialog
      id="deposit_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showDepositModal}
    >
      <div className="modal-box bg-white dark:bg-slate-800 shadow-xl rounded-lg">
        <DepositModal 
          wallet={wallet}
          onDeposit={handleDeposit}
          onClose={() => setShowDepositModal(false)}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowDepositModal(false)}>close</button>
      </form>
    </dialog>
  );

  // Renderiza o modal de saque
  const renderWithdrawModal = () => (
    <dialog
      id="transfer_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showTransferModal}
    >
      <div className="modal-box bg-white dark:bg-slate-800 shadow-xl rounded-lg">
        <WithdrawModal 
          wallet={wallet}
          onWithdraw={handleWithdraw}
          onClose={() => setShowTransferModal(false)}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowTransferModal(false)}>close</button>
      </form>
    </dialog>
  );

  // Renderiza o modal de seleção de carteira
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
          currentWallet={wallet}
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

  // Renderiza o modal de seleção de tipo de carteira
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

        {/* Seletor de vendedor quando não há um selecionado */}
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

        {/* Estado vazio sem vendedores */}
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

        {wallets.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-slate-800 dark:text-white">
                {getWalletConfiguration()}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wallets.map((walletItem) => (
                <WalletCard
                  key={walletItem.id}
                  wallet={walletItem}
                  onViewDetails={() => switchToWallet(walletItem)}
                  onDeposit={() => {
                    setWallet(walletItem);
                    setShowDepositModal(true);
                  }}
                  onWithdraw={() => {
                    setWallet(walletItem);
                    setShowTransferModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {!wallet && !sellerLoading && selectedSellerId && (
          <EmptyWalletState 
            onCreateWallet={() => setShowWalletTypeSelection(true)}
          />
        )}

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

                <TransactionList 
                  transactions={transactionHistory.transactions}
                  pagination={transactionHistory.pagination}
                  summary={transactionHistory.summary}
                  onPageChange={(page) => loadTransactions(wallet.id, page, pageSize)}
                />
              </div>
            )}

            {activeTab === "details" && (
              <div className="p-6">
                <WalletDetails wallet={wallet} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modais */}
      {wallet && renderDepositModal()}
      {wallet && renderWithdrawModal()}
      {wallets.length > 0 && renderWalletSelectorModal()}
      {renderWalletTypeSelectionModal()}
    </div>
  );
};

export default WalletManagement;