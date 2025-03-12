import React from "react";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const WithdrawalsTable = ({ withdraws, onApprove, onReject, onProcess }) => {
  if (!withdraws || withdraws.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Solicitações de Saque Pendentes</h2>
          <p className="text-center py-6 text-base-content/70">
            Não há solicitações de saque pendentes.
          </p>
        </div>
      </div>
    );
  }

  const getWithdrawMethodLabel = (method) => {
    const methods = {
      "BANK_TRANSFER": "Transferência Bancária",
      "PIX": "PIX",
      "TED": "TED",
      "DOC": "DOC"
    };
    return methods[method] || method;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Solicitações de Saque Pendentes</h2>
        <p className="text-base-content/70">
          Saques solicitados que aguardam aprovação e processamento
        </p>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vendedor</th>
                <th>Valor</th>
                <th>Método</th>
                <th>Destino</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {withdraws.map((withdraw) => (
                <tr key={withdraw.id}>
                  <td>{withdraw.id}</td>
                  <td>{withdraw.sellerName || withdraw.sellerId}</td>
                  <td>{formatCurrency(withdraw.amount)}</td>
                  <td>{getWithdrawMethodLabel(withdraw.withdrawMethod)}</td>
                  <td>
                    {withdraw.bankAccountId ? (
                      <div className="flex flex-col">
                        <span>{withdraw.bankName || "Banco"}</span>
                        <span className="text-xs opacity-70">
                          {withdraw.accountNumber ? `Conta: ${withdraw.accountNumber}` : ""}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs opacity-70">
                        Chave PIX ou outro método
                      </span>
                    )}
                  </td>
                  <td>{formatDateTime(withdraw.requestedAt)}</td>
                  <td className="flex gap-2">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => onApprove(withdraw.id)}
                    >
                      Aprovar
                    </button>
                    {withdraw.status === "APPROVED" && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => onProcess(withdraw.id)}
                      >
                        Processar
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => onReject(withdraw.id)}
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

export default WithdrawalsTable;