import React from "react";
import { formatDateTime } from "../../utils/formatters";

const BankAccountsTable = ({ accounts, onApprove, onReject }) => {
  if (!accounts || accounts.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Contas Bancárias Pendentes</h2>
          <p className="text-center py-6 text-base-content/70">
            Não há contas bancárias pendentes de verificação.
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Contas Bancárias Pendentes</h2>
        <p className="text-base-content/70">
          Contas bancárias que aguardam verificação manual
        </p>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Banco</th>
                <th>Titular</th>
                <th>Tipo</th>
                <th>Detalhes</th>
                <th>Cadastrada em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>
                    <div className="flex flex-col">
                      <span>{account.bankName}</span>
                      <span className="text-xs opacity-70">
                        {formatBankCode(account.bankCode)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span>{account.accountHolderName}</span>
                      <span className="text-xs opacity-70">
                        {account.documentNumber}
                      </span>
                    </div>
                  </td>
                  <td>{getAccountTypeLabel(account.accountType)}</td>
                  <td>
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
                  <td>{formatDateTime(account.createdAt)}</td>
                  <td className="flex gap-2">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => onApprove(account.id)}
                    >
                      Verificar
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => onReject(account.id)}
                    >
                      Rejeitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BankAccountsTable;