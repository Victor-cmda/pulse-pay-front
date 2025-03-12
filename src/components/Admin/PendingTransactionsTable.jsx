import React from "react";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const PendingTransactionsTable = ({ transactions, onApprove, onReject }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Transações Pendentes</h2>
          <p className="text-center py-6 text-base-content/70">
            Não há transações pendentes de aprovação.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Transações Pendentes</h2>
        <p className="text-base-content/70">
          Transações que necessitam de aprovação manual
        </p>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Carteira</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.walletId}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td>{transaction.type}</td>
                  <td>{formatDateTime(transaction.createdAt)}</td>
                  <td className="flex gap-2">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => onApprove(transaction.id)}
                    >
                      Aprovar
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => onReject(transaction.id)}
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

export default PendingTransactionsTable;