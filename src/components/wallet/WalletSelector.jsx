import React, { useState } from "react";
import { Wallet, Check } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const WalletSelector = ({
  wallets,
  currentWallet,
  onSelectWallet,
  onSetDefault,
  onClose,
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
    <div className="space-y-4">
      {wallets.map((walletItem) => (
        <div
          key={walletItem.id}
          className={`p-4 rounded-lg border ${
            currentWallet?.id === walletItem.id
              ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-700"
              : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
          } cursor-pointer transition-colors`}
          onClick={() => onSelectWallet(walletItem)}
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
                onSetDefault(walletItem.id);
              }}
              className="mt-3 w-full text-center text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 py-1.5"
            >
              Definir como Padrão
            </button>
          )}
        </div>
      ))}

      <div className="modal-action mt-8 flex gap-3 justify-end">
        <button
          className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default WalletSelector;
