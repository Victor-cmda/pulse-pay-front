import React from "react";
import { X, Building, User, Calendar, CheckCircle, Shield, FileText } from "lucide-react";
import { formatDateTime } from "../../utils/formatters";

const BankAccountDetailsModal = ({ account, onClose }) => {
  if (!account) return null;

  const getAccountTypeLabel = (type) => {
    if (type === "TED") return "Transferência Bancária";
    if (type === "PIX") return "Chave PIX";
    return type;
  };

  const getPixKeyTypeLabel = (type) => {
    const types = {
      "CPF": "CPF",
      "CNPJ": "CNPJ",
      "EMAIL": "E-mail",
      "PHONE": "Telefone",
      "RANDOM": "Chave aleatória"
    };
    return types[type] || type;
  };

  const formatBankCode = (code) => {
    return code ? code.padStart(3, "0") : "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <Building className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Detalhes da Conta Bancária
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Basic Info */}
          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-medium rounded-full mb-4">
              ID #{account.id}
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-lg">
                  {account.accountHolderName}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {account.documentNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                <Building className="w-4 h-4 mr-1.5 text-slate-600 dark:text-slate-400" />
                Informações Bancárias
              </h5>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Banco</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {account.bankName} ({formatBankCode(account.bankCode)})
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Tipo de Conta</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {getAccountTypeLabel(account.accountType)}
                  </span>
                </div>

                {account.accountType === "TED" && (
                  <>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Agência</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {account.branchNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Conta</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {account.accountNumber}
                      </span>
                    </div>
                  </>
                )}

                {account.accountType === "PIX" && (
                  <>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Tipo de Chave</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {getPixKeyTypeLabel(account.pixKeyType)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Chave PIX</span>
                      <span className="font-medium text-slate-900 dark:text-white break-all">
                        {account.pixKey}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-1.5 text-slate-600 dark:text-slate-400" />
                Status e Validação
              </h5>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    Pendente de Verificação
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Cadastrada em</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatDateTime(account.createdAt)}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Última Atualização</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatDateTime(account.updatedAt) || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          {account.notes && (
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mb-6">
              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-slate-600 dark:text-slate-400" />
                Observações
              </h5>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {account.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccountDetailsModal;