import React from "react";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

const WalletCard = ({
  wallet,
  setWallet,
  onViewDetails,
  onDeposit,
  onWithdraw,
}) => {
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

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer
        ${
          wallet.isDefault
            ? "border-indigo-300 dark:border-indigo-700"
            : "border-slate-200 dark:border-slate-700"
        }
        ${
          wallet.walletType === 0
            ? "bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800"
            : wallet.walletType === 1
            ? "bg-gradient-to-b from-rose-50 to-white dark:from-rose-900/20 dark:to-slate-800"
            : ""
        }
      `}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              {wallet.walletType === 0 ? (
                <>
                  <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Carteira de Depósito
                </>
              ) : wallet.walletType === 1 ? (
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

              {wallet.isDefault && (
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
            {(wallet.walletType === 0 || wallet.walletType === 2) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeposit(wallet);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
              >
                Depositar
              </button>
            )}

            {(wallet.walletType === 1 || wallet.walletType === 2) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWithdraw(wallet);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Sacar
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(wallet);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
