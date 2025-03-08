import React, { useState } from "react";
import { ExternalLink, Info, AlertCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const WithdrawModal = ({ wallet, onWithdraw, onClose }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");

  return (
    <>
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={reference}
              onChange={(e) => setReference(e.target.value)}
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
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
          onClick={() => onWithdraw(amount, description, reference)}
        >
          Confirmar Saque
        </button>
      </div>
    </>
  );
};

export default WithdrawModal;