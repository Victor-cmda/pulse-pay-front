import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Building,
  Wallet,
  PlusCircle,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Info,
  AlertCircle,
  Clock,
  ShieldCheck,
  User,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { paymentService } from "../../services/PaymentService";
import { authService } from "../../services/AuthService";
import { notification } from "antd";

const BankAccountManagement = () => {
  // Estado para o seller (vendedor)
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(true);

  // Estado para contas bancárias
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [api, contextHolder] = notification.useNotification();

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
  }, []);

  // Carregar contas bancárias quando um seller for selecionado
  useEffect(() => {
    const loadBankAccounts = async () => {
      if (selectedSeller) {
        try {
          setLoading(true);
          // Usamos o ID do seller para carregar as contas bancárias
          const response = await paymentService.getSellerBankAccounts(
            selectedSeller.id
          );
          if (response.success) {
            setBankAccounts(response.data || []);
          } else {
            console.error(
              "Erro ao carregar contas bancárias:",
              response.message
            );
            setBankAccounts([]);
          }
        } catch (error) {
          console.error("Erro ao carregar contas bancárias:", error);
          setBankAccounts([]);
        } finally {
          setLoading(false);
        }
      } else {
        setBankAccounts([]);
        setSelectedAccount(null);
      }
    };

    loadBankAccounts();
  }, [selectedSeller]);

  // Filtra contas bancárias com base na aba ativa
  const getFilteredAccounts = () => {
    if (activeTab === "all") return bankAccounts;
    if (activeTab === "ted")
      return bankAccounts.filter((account) => account.accountType === "TED");
    if (activeTab === "pix")
      return bankAccounts.filter((account) => account.accountType === "PIX");
    if (activeTab === "verified")
      return bankAccounts.filter((account) => account.isVerified);
    if (activeTab === "pending")
      return bankAccounts.filter((account) => !account.isVerified);
    return bankAccounts;
  };

  // Paginação
  const filteredAccounts = getFilteredAccounts();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccounts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAccounts.length / itemsPerPage)
  );

  // Excluir conta bancária
  const deleteAccount = async (id) => {
    try {
      const response = await paymentService.deleteBankAccount(id);

      if (response.success) {
        // Atualiza a lista removendo a conta excluída
        setBankAccounts((prevAccounts) =>
          prevAccounts.filter((account) => account.id !== id)
        );

        // Se a conta selecionada foi excluída, limpa a seleção
        if (selectedAccount && selectedAccount.id === id) {
          setSelectedAccount(null);
        }

        api.success({
          message: "Sucesso",
          description: response.message,
          placement: "topRight",
        });
      } else {
        api.error({
          message: "Erro",
          description: response.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Erro",
        description: "Erro ao excluir conta bancária. Tente novamente mais tarde.",
        placement: "topRight",
      });
    }
  };

  // // Verificar conta bancária
  // const verifyBankAccount = async (id) => {
  //   try {
  //     const response = await paymentService.verifyBankAccount(id);

  //     if (response.success) {
  //       // Atualiza a conta na lista
  //       setBankAccounts((prevAccounts) =>
  //         prevAccounts.map((account) =>
  //           account.id === id ? { ...account, isVerified: true } : account
  //         )
  //       );

  //       // Atualiza a conta selecionada se for a verificada
  //       if (selectedAccount && selectedAccount.id === id) {
  //         setSelectedAccount({
  //           ...selectedAccount,
  //           isVerified: true,
  //         });
  //       }

  //       api.success({
  //         message: "Sucesso",
  //         description: response.message,
  //         placement: "topRight",
  //       });
  //     } else {
  //       api.error({
  //         message: "Erro",
  //         description: response.message,
  //         placement: "topRight",
  //       });
  //     }
  //   } catch (error) {
  //     api.error({
  //       message: "Erro",
  //       description: "Erro ao verificar conta bancária. Tente novamente mais tarde.",
  //       placement: "topRight",
  //     });
  //   }
  // };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Renderizar ícone para o tipo de conta
  const renderAccountTypeIcon = (accountType) => {
    switch (accountType) {
      case "TED":
        return <Building className="w-5 h-5 text-blue-500" />;
      case "PIX":
        return <Wallet className="w-5 h-5 text-green-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatBankCode = (code) => {
    return code.padStart(3, "0");
  };

  const formatAccountType = (type) => {
    switch (type) {
      case "TED":
        return "Transferência Bancária";
      case "PIX":
        return "Chave PIX";
      default:
        return type;
    }
  };

  const formatPixKeyType = (type) => {
    switch (type) {
      case "CPF":
        return "CPF";
      case "CNPJ":
        return "CNPJ";
      case "EMAIL":
        return "E-mail";
      case "PHONE":
        return "Telefone";
      case "RANDOM":
        return "Chave aleatória";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-6 pb-16">
      {contextHolder}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
            Gerenciamento de Contas Bancárias
          </h1>

          {selectedSeller && (
            <Link
              to={`/bank/new?sellerId=${selectedSeller.id}`}
              className="btn btn-primary"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Nova Conta Bancária
            </Link>
          )}
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
                          <User
                            className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"
                          />
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
              <Link
                to="/configuration"
                className="mt-2 inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                Cadastrar novo vendedor
              </Link>
            </div>
          )}
        </div>

        {selectedSeller ? (
          <>
            {/* Abas de filtro */}
            <div className="flex overflow-x-auto hide-scrollbar mb-6 pb-2">
              <button
                className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${activeTab === "all"
                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                onClick={() => {
                  setActiveTab("all");
                  setCurrentPage(1);
                }}
              >
                Todas
              </button>
              <button
                className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${activeTab === "ted"
                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                onClick={() => {
                  setActiveTab("ted");
                  setCurrentPage(1);
                }}
              >
                Contas TED
              </button>
              <button
                className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${activeTab === "pix"
                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                onClick={() => {
                  setActiveTab("pix");
                  setCurrentPage(1);
                }}
              >
                Chaves PIX
              </button>
              <button
                className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${activeTab === "verified"
                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                onClick={() => {
                  setActiveTab("verified");
                  setCurrentPage(1);
                }}
              >
                Verificadas
              </button>
              <button
                className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${activeTab === "pending"
                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                onClick={() => {
                  setActiveTab("pending");
                  setCurrentPage(1);
                }}
              >
                Pendentes
              </button>
            </div>

            {loading ? (
              // Estado de carregamento
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300">
                  Carregando contas bancárias...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de contas bancárias */}
                <div className="lg:col-span-2">
                  {currentItems.length > 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                      <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {currentItems.map((account) => (
                          <div
                            key={account.id}
                            className={`flex p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${selectedAccount?.id === account.id
                              ? "border-l-4 border-indigo-600 dark:border-indigo-500"
                              : ""
                              }`}
                            onClick={() => setSelectedAccount(account)}
                          >
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                {renderAccountTypeIcon(account.accountType)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                                  {account.bankName} -{" "}
                                  {formatBankCode(account.bankCode)}
                                </h3>
                                <div className="flex items-center">
                                  {account.isVerified ? (
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                      Verificada
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                      Pendente
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1 mb-1">
                                {formatAccountType(account.accountType)}
                                {account.accountType === "TED" && (
                                  <span>
                                    {" "}
                                    • Agência: {account.branchNumber} • Conta:{" "}
                                    {account.accountNumber}
                                  </span>
                                )}
                                {account.accountType === "PIX" && (
                                  <span>
                                    {" "}
                                    • Tipo:{" "}
                                    {formatPixKeyType(account.pixKeyType)}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Atualizado em{" "}
                                {
                                  formatDate(account.lastUpdatedAt).split(
                                    " às"
                                  )[0]
                                }
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Paginação */}
                      {totalPages > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Página {currentPage} de {totalPages}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              className={`btn btn-sm btn-circle ${currentPage === 1 ? "btn-disabled" : "btn-ghost"
                                }`}
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              className={`btn btn-sm btn-circle ${currentPage === totalPages
                                ? "btn-disabled"
                                : "btn-ghost"
                                }`}
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(totalPages, prev + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
                      <CreditCard className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                        Nenhuma conta bancária encontrada
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">
                        {activeTab === "all"
                          ? "Você não tem contas bancárias cadastradas."
                          : activeTab === "ted"
                            ? "Você não tem contas bancárias do tipo TED."
                            : activeTab === "pix"
                              ? "Você não tem chaves PIX cadastradas."
                              : activeTab === "verified"
                                ? "Você não tem contas bancárias verificadas."
                                : "Você não tem contas bancárias pendentes de verificação."}
                      </p>
                      <Link
                        to={`/bank/new?sellerId=${selectedSeller.id}`}
                        className="btn btn-primary"
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        Adicionar Conta Bancária
                      </Link>
                    </div>
                  )}
                </div>

                {/* Painel de detalhes */}
                <div className="lg:col-span-1">
                  {selectedAccount ? (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3">
                            {renderAccountTypeIcon(selectedAccount.accountType)}
                          </div>
                          <h3 className="text-lg font-medium text-slate-800 dark:text-white">
                            {selectedAccount.bankName}
                          </h3>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/bank/edit/${selectedAccount.id}`}
                            className="text-slate-400 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400 transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                            onClick={() => deleteAccount(selectedAccount.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        {selectedAccount.isVerified ? (
                          <div className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm">
                            <ShieldCheck className="w-4 h-4 mr-1" />
                            <span>Conta Verificada</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span>Verificação Pendente</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 mb-6">
                        <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Código do Banco
                          </div>
                          <div className="text-slate-800 dark:text-white">
                            {formatBankCode(selectedAccount.bankCode)} -{" "}
                            {selectedAccount.bankName}
                          </div>
                        </div>

                        <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Tipo de Conta
                          </div>
                          <div className="text-slate-800 dark:text-white">
                            {formatAccountType(selectedAccount.accountType)}
                          </div>
                        </div>

                        {selectedAccount.accountType === "TED" && (
                          <>
                            <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Agência
                              </div>
                              <div className="text-slate-800 dark:text-white">
                                {selectedAccount.branchNumber}
                              </div>
                            </div>
                            <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Conta
                              </div>
                              <div className="text-slate-800 dark:text-white">
                                {selectedAccount.accountNumber}
                              </div>
                            </div>
                          </>
                        )}

                        {selectedAccount.accountType === "PIX" && (
                          <>
                            <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Tipo de Chave PIX
                              </div>
                              <div className="text-slate-800 dark:text-white">
                                {formatPixKeyType(selectedAccount.pixKeyType)}
                              </div>
                            </div>
                            <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Chave PIX
                              </div>
                              <div className="text-slate-800 dark:text-white break-all">
                                {selectedAccount.pixKey}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Titular da Conta
                          </div>
                          <div className="text-slate-800 dark:text-white">
                            {selectedAccount.accountHolderName}
                          </div>
                        </div>

                        <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            CNPJ
                          </div>
                          <div className="text-slate-800 dark:text-white">
                            {selectedAccount.documentNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          Cadastrada em {formatDate(selectedAccount.createdAt)}
                        </span>
                      </div>

                      {!selectedAccount.isVerified && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                Verificação pendente
                              </h4>
                              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                Esta conta bancária precisa ser verificada antes
                                de receber pagamentos.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* {!selectedAccount.isVerified && (
                        <button
                          className="btn btn-primary w-full"
                          onClick={() => verifyBankAccount(selectedAccount.id)}
                        >
                          <ShieldCheck className="w-4 h-4 mr-1" />
                          Verificar Conta Bancária
                        </button>
                      )} */}

                      {selectedAccount.isVerified && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <div className="flex items-start">
                            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                                Conta verificada
                              </h4>
                              <p className="text-xs text-green-700 dark:text-green-400">
                                Esta conta bancária está verificada e pronta
                                para receber pagamentos.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
                      <Info className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                        Selecione uma conta
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        Clique em uma conta bancária para ver seus detalhes.
                      </p>
                    </div>
                  )}
                </div>
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
              Para gerenciar contas bancárias, selecione um vendedor na
              lista acima. Você poderá adicionar, editar e verificar contas
              bancárias para recebimento de pagamentos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankAccountManagement;