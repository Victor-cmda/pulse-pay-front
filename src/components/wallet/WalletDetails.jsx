import React from 'react';
import { Download, Calendar } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

const WalletDetails = ({ wallet }) => {
  const getWalletTypeLabel = (type) => {
    switch (type) {
      case 0: return "Depósito";
      case 1: return "Saque";
      case 2: return "Geral";
      default: return "Desconhecido";
    }
  };

  return (
    <div>
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
  );
};

export default WalletDetails;