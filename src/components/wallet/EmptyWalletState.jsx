import React from 'react';
import { Wallet, AlertCircle } from 'lucide-react';

const EmptyWalletState = ({ onCreateWallet }) => {
  return (
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
          onClick={onCreateWallet}
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
  );
};

export default EmptyWalletState;