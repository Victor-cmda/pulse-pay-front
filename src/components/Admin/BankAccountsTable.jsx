import React, { useState } from "react";
import { formatDateTime } from "../../utils/formatters";
import { 
  Check, 
  X, 
  AlertCircle, 
  Search, 
  Building,
  User,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  FileCheck,
  ShieldCheck,
  Eye
} from "lucide-react";
import BankAccountDetailsModal from "./BankAccountDetailsModal ";

const BankAccountsTable = ({ accounts, onApprove, onReject }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    bankName: "",
    accountType: "all",
    verificationStatus: "pending"
  });
  
  // Estado para controlar a exibição do modal de detalhes
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  const itemsPerPage = 10;

  const formatBankCode = (code) => {
    return code ? code.padStart(3, "0") : "";
  };

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

  const applyFilters = (data) => {
    return data.filter(item => {
      // Filtro de pesquisa
      const matchesSearch = 
        item.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accountHolderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de banco
      const matchesBankName = filters.bankName === "" || 
        (item.bankName && item.bankName.toLowerCase().includes(filters.bankName.toLowerCase()));
      
      // Filtro de tipo de conta
      const matchesAccountType = filters.accountType === "all" || 
        (item.accountType && item.accountType.toLowerCase() === filters.accountType.toLowerCase());
      
      // No caso de contas bancárias, presumimos que todas são pendentes
      const matchesVerificationStatus = true;
      
      return matchesSearch && matchesBankName && matchesAccountType && matchesVerificationStatus;
    });
  };

  const resetFilters = () => {
    setFilters({
      bankName: "",
      accountType: "all",
      verificationStatus: "pending"
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleRejectWithReason = (id) => {
    const reason = prompt("Por favor, informe o motivo da rejeição:");
    if (reason !== null) {
      onReject(id, reason);
    }
  };
  
  // Função para abrir o modal de detalhes da conta
  const showAccountDetails = (account) => {
    setSelectedAccount(account);
  };
  
  // Função para fechar o modal de detalhes
  const closeAccountDetails = () => {
    setSelectedAccount(null);
  };

  const filteredAccounts = applyFilters(accounts || []);
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedData = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!accounts) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-56"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-6 w-80"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Contas Bancárias Pendentes</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Contas bancárias que aguardam verificação manual</p>
        
        <div className="py-12 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <FileCheck className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">Tudo em ordem!</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Não há contas bancárias pendentes de verificação no momento. Todas as contas foram processadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Contas Bancárias Pendentes</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">Contas bancárias que aguardam verificação manual</p>

      {/* Filtros e Pesquisa */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar contas bancárias..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 mr-1" />
            Filtros
          </button>
          <button className="flex items-center px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </button>
        </div>
      </div>
      
      {/* Filtros expandidos */}
      {showFilters && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Banco</label>
              <input
                type="text"
                placeholder="Digite o nome do banco"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                value={filters.bankName}
                onChange={(e) => setFilters({...filters, bankName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Conta</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                value={filters.accountType}
                onChange={(e) => setFilters({...filters, accountType: e.target.value})}
              >
                <option value="all">Todos</option>
                <option value="TED">Transferência Bancária</option>
                <option value="PIX">Chave PIX</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                value={filters.verificationStatus}
                onChange={(e) => setFilters({...filters, verificationStatus: e.target.value})}
                disabled
              >
                <option value="pending">Pendentes</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Resultados da Pesquisa */}
      {filteredAccounts.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <AlertCircle className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">Nenhuma conta bancária encontrada</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
            Não encontramos nenhuma conta bancária pendente com os critérios de busca atuais.
          </p>
          <button 
            onClick={resetFilters}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Banco
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Titular
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Detalhes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Cadastrada em
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedData.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                      #{account.id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-white">{account.bankName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {formatBankCode(account.bankCode)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mr-2">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{account.accountHolderName}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{account.documentNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {getAccountTypeLabel(account.accountType)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {account.accountType === "TED" && (
                        <div className="flex flex-col">
                          <span>Agência: {account.branchNumber}</span>
                          <span>Conta: {account.accountNumber}</span>
                        </div>
                      )}
                      {account.accountType === "PIX" && (
                        <div className="flex flex-col">
                          <span>{getPixKeyTypeLabel(account.pixKeyType)}</span>
                          <span className="text-xs truncate max-w-xs">
                            {account.pixKey}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {formatDateTime(account.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-1">
                      <button
                        onClick={() => onApprove(account.id)}
                        className="inline-flex items-center p-1.5 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        title="Verificar"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectWithReason(account.id)}
                        className="inline-flex items-center p-1.5 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Rejeitar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showAccountDetails(account)}
                        className="inline-flex items-center p-1.5 text-white bg-slate-600 rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 px-2">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Mostrando <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAccounts.length)}</span> de <span className="font-medium">{filteredAccounts.length}</span> resultados
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1 
                      ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Lógica para mostrar páginas próximas à atual
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-md ${
                        currentPage === pageNum 
                          ? 'bg-indigo-600 text-white font-medium' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages 
                      ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Modal de Detalhes */}
      {selectedAccount && (
        <BankAccountDetailsModal 
          account={selectedAccount} 
          onClose={closeAccountDetails} 
        />
      )}
    </div>
  );
};

export default BankAccountsTable;