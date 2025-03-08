// src/pages/wallet/WalletTypeSelection.jsx
import React, { useState } from "react";
import {
  Wallet,
  AlertCircle,
  Check,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCcw,
} from "lucide-react";

const WalletTypeSelection = ({ onCreateWallet, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState("combined");

  const handleCreateWallet = async () => {
    if (selectedOption === "combined") {
      await onCreateWallet(2);
    } else {
      await onCreateWallet(0, true);
      await onCreateWallet(1, false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
        <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        Selecionar Tipo de Carteira
      </h2>

      <div className="mb-6">
        <div className="flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>Escolha como deseja configurar suas carteiras digitais</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedOption === "combined"
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-600"
                : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
            }`}
            onClick={() => setSelectedOption("combined")}
          >
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                  <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-medium text-slate-800 dark:text-white">
                  Carteira Única
                </h3>
              </div>
              {selectedOption === "combined" && (
                <div className="w-5 h-5 bg-indigo-500 dark:bg-indigo-400 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-3 mb-4">
              <div className="flex gap-2 items-center mb-2">
                <RefreshCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-800 dark:text-white">
                  Carteira Geral
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mesma carteira para todas as transações (saques e depósitos)
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ideal para operações simples ou quando não há necessidade de
              separar fundos.
            </p>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedOption === "separate"
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-600"
                : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
            }`}
            onClick={() => setSelectedOption("separate")}
          >
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                  <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-medium text-slate-800 dark:text-white">
                  Carteiras Separadas
                </h3>
              </div>
              {selectedOption === "separate" && (
                <div className="w-5 h-5 bg-indigo-500 dark:bg-indigo-400 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                <div className="flex gap-2 items-center mb-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-slate-800 dark:text-white">
                    Carteira de Depósito
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recebe todos os valores de entrada
                </p>
              </div>

              <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                <div className="flex gap-2 items-center mb-2">
                  <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-sm font-medium text-slate-800 dark:text-white">
                    Carteira de Saque
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Utilizada para todas as saídas de dinheiro
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Melhor para controle financeiro avançado e separação de fluxos de
              caixa.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreateWallet}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Criar Carteira{selectedOption === "separate" ? "s" : ""}
        </button>
      </div>
    </div>
  );
};

export default WalletTypeSelection;