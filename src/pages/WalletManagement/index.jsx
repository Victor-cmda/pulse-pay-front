import React, { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  AlertCircle,
  ChevronRight,
  RefreshCcw,
  BanknoteIcon,
  Clock,
  Calendar,
  Info,
  ExternalLink,
} from "lucide-react";

const WalletManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Dados mockados com base no DTO fornecido
  const [wallets] = useState([
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      sellerId: "a7be15c3-3168-4283-8c49-39beb37f1111",
      availableBalance: 13280.5,
      pendingBalance: 2500.0,
      totalBalance: 15780.5,
      lastUpdateAt: "2024-02-23T14:30:25Z",
      createdAt: "2023-11-15T09:00:00Z",
      name: "Carteira Principal",
      account: {
        bank: "341 - Itaú",
        agency: "1234",
        account: "12345-6",
        type: "Conta Corrente",
      },
      transactions: [
        {
          id: 1,
          type: "deposit",
          amount: 1500.0,
          description: "Depósito via PIX",
          date: "2024-02-23T14:30:25Z",
          status: "completed",
          transaction_id: "PIX78945612378",
        },
        {
          id: 2,
          type: "pending",
          amount: 2500.0,
          description: "Valor pendente para liquidação",
          date: "2024-02-22T09:15:00Z",
          status: "pending",
          transaction_id: "BLQ45612378945",
        },
        {
          id: 3,
          type: "withdrawal",
          amount: 3000.0,
          description: "Transferência para conta bancária",
          date: "2024-02-20T11:23:45Z",
          status: "completed",
          transaction_id: "TRF78912345678",
        },
      ],
    },
    {
      id: "661f9511-f39c-52e5-b827-557766551111",
      sellerId: "a7be15c3-3168-4283-8c49-39beb37f1111",
      availableBalance: 45000.0,
      pendingBalance: 0.0,
      totalBalance: 45000.0,
      lastUpdateAt: "2024-02-20T10:15:30Z",
      createdAt: "2023-12-20T14:30:00Z",
      name: "Carteira Secundária",
      account: {
        bank: "341 - Itaú",
        agency: "1234",
        account: "12345-7",
        type: "Conta Corrente",
      },
      transactions: [],
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (type) => {
    switch (type) {
      case "deposit":
        return "text-emerald-500";
      case "pending":
        return "text-amber-500";
      case "withdrawal":
        return "text-rose-500";
      default:
        return "text-slate-500";
    }
  };

  const getStatusBg = (type) => {
    switch (type) {
      case "deposit":
        return "bg-emerald-100";
      case "pending":
        return "bg-amber-100";
      case "withdrawal":
        return "bg-rose-100";
      default:
        return "bg-slate-100";
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="w-4 h-4" />;
      case "pending":
        return <RefreshCcw className="w-4 h-4" />;
      case "withdrawal":
        return <ArrowDownRight className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
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
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Os depósitos são processados via PIX ou TED</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium mb-4 text-lg">Dados para Depósito</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Banco:
                </span>
                <span className="font-medium">
                  {selectedWallet?.account.bank}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Agência:
                </span>
                <span className="font-medium">
                  {selectedWallet?.account.agency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Conta:
                </span>
                <span className="font-medium">
                  {selectedWallet?.account.account}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Tipo:
                </span>
                <span className="font-medium">
                  {selectedWallet?.account.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  CNPJ:
                </span>
                <span className="font-medium">XX.XXX.XXX/0001-XX</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>O valor será creditado após a confirmação do depósito</span>
          </div>
        </div>
        <div className="modal-action mt-8 flex gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setShowDepositModal(false)}
          >
            Fechar
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Baixar Dados
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
          Solicitar Transferência
        </h3>
        <form className="space-y-6">
          <div className="flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Saldo disponível para transferência:{" "}
              {formatCurrency(selectedWallet?.availableBalance || 0)}
            </span>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-slate-700 dark:text-slate-300">
              Valor da Transferência
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0,00"
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400">R$</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>A transferência será processada em até 1 dia útil</span>
          </div>
        </form>
        <div className="modal-action mt-8 flex gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setShowTransferModal(false)}
          >
            Cancelar
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
            Solicitar Transferência
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
              Minhas Carteiras
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Acompanhe seus saldos e movimentações financeiras
            </p>
          </div>
          {/* Nota: Botão de "Nova Carteira" foi removido conforme solicitado */}
        </div>

        {/* Wallets Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <h2 className="font-bold text-lg text-slate-800 dark:text-white">
                    {wallet.name}
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
                      onClick={() => {
                        setSelectedWallet(wallet);
                        setShowDepositModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      Depositar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWallet(wallet);
                        setShowTransferModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Transferir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wallet Details */}
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
                Detalhes da Conta
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="p-6">
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
                    {formatCurrency(
                      wallets.reduce(
                        (total, wallet) => total + wallet.totalBalance,
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Total Disponível
                    </h3>
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(
                      wallets.reduce(
                        (total, wallet) => total + wallet.availableBalance,
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Total Pendente
                    </h3>
                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <RefreshCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                    {formatCurrency(
                      wallets.reduce(
                        (total, wallet) => total + wallet.pendingBalance,
                        0
                      )
                    )}
                  </p>
                </div>
              </div>

              <h3 className="font-medium text-lg mb-4 text-slate-800 dark:text-white">
                Últimas Movimentações
              </h3>
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
                    {wallets
                      .flatMap((wallet) => wallet.transactions)
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 5)
                      .map((transaction) => (
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
                                {transaction.type === "deposit"
                                  ? "Depósito"
                                  : transaction.type === "pending"
                                  ? "Pendente"
                                  : "Saque"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">
                            {transaction.description}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {formatDateTime(transaction.date)}
                          </td>
                          <td
                            className={`py-3 px-4 text-sm font-medium text-right ${getStatusColor(
                              transaction.type
                            )}`}
                          >
                            {transaction.type === "withdrawal" ? "- " : ""}
                            {formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
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
          )}

          {activeTab === "transactions" && (
            <div className="p-6">
              <h3 className="font-medium text-lg mb-4 text-slate-800 dark:text-white">
                Histórico de Movimentações
              </h3>
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
                        Carteira
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        ID Transação
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallets
                      .flatMap((wallet) =>
                        wallet.transactions.map((transaction) => ({
                          ...transaction,
                          walletName: wallet.name,
                        }))
                      )
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((transaction) => (
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
                                {transaction.type === "deposit"
                                  ? "Depósito"
                                  : transaction.type === "pending"
                                  ? "Pendente"
                                  : "Saque"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">
                            {transaction.description}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {transaction.walletName}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {formatDateTime(transaction.date)}
                          </td>
                          <td className="py-3 px-4 text-xs font-mono text-slate-500 dark:text-slate-500">
                            {transaction.transaction_id}
                          </td>
                          <td
                            className={`py-3 px-4 text-sm font-medium text-right ${getStatusColor(
                              transaction.type
                            )}`}
                          >
                            {transaction.type === "withdrawal" ? "- " : ""}
                            {formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-5"
                  >
                    <h3 className="font-medium text-lg mb-4 text-slate-800 dark:text-white">
                      {wallet.name}
                    </h3>

                    <div className="space-y-4 mb-6">
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
                          Banco:
                        </span>
                        <span className="font-medium">
                          {wallet.account.bank}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">
                          Agência:
                        </span>
                        <span className="font-medium">
                          {wallet.account.agency}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">
                          Agência:
                        </span>
                        <span className="font-medium">
                          {wallet.account.agency}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">
                          Conta:
                        </span>
                        <span className="font-medium">
                          {wallet.account.account}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">
                          Tipo:
                        </span>
                        <span className="font-medium">
                          {wallet.account.type}
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

                    <div className="border-t border-slate-200 dark:border-slate-600 pt-4 mt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Total
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

                    <div className="mt-6 flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedWallet(wallet);
                          setShowDepositModal(true);
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                      >
                        Depositar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedWallet(wallet);
                          setShowTransferModal(true);
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                      >
                        Transferir
                      </button>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Demonstrativo mensal disponível para download
                        </span>
                      </div>
                      <button className="mt-2 w-full px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium flex items-center justify-center gap-2 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 transition-colors">
                        <Download className="w-4 h-4" />
                        Baixar Extrato
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State (quando não houver carteiras) */}
          {wallets.length === 0 && (
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                Nenhuma carteira encontrada
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Você ainda não tem carteiras cadastradas no sistema. Entre em
                contato com o suporte para mais informações.
              </p>
              <a
                href="#contato"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Falar com o Suporte
              </a>
            </div>
          )}
          {selectedWallet && <DepositModal />}
          {selectedWallet && <TransferModal />}
        </div>
      </div>
    </div>
  );
};

export default WalletManagement;
