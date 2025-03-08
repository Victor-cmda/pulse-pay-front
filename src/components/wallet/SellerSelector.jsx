import React, { useState } from 'react';
import { User, Check, ChevronDown } from 'lucide-react';

const SellerSelector = ({ sellers, selectedSellerId, onSelectSeller, loading }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Vendedor
      </label>
      <div className="relative">
        <div
          className={`p-3 border ${
            !selectedSellerId
              ? "border-red-300 dark:border-red-600"
              : "border-slate-300 dark:border-slate-600"
          } rounded-lg flex justify-between items-center cursor-pointer bg-white dark:bg-slate-800`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedSellerId ? (
            <div className="flex items-center">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <div>
                <div className="font-medium text-slate-800 dark:text-white">
                  {sellers.find((s) => s.id === selectedSellerId)?.name ||
                    selectedSellerId}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {sellers.find((s) => s.id === selectedSellerId)
                    ?.description || "Sem descrição"}
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

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-slate-600 dark:text-slate-300">
                  Carregando vendedores...
                </span>
              </div>
            ) : sellers.length > 0 ? (
              sellers.map((seller) => (
                <div
                  key={seller.id}
                  className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => {
                    onSelectSeller(seller.id);
                    setShowDropdown(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white flex items-center">
                          {seller.name || seller.id}
                          {selectedSellerId === seller.id && (
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
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                Nenhum vendedor encontrado
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSelector;