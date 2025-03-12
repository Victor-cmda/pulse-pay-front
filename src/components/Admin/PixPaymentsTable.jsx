import React from "react";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const PixPaymentsTable = ({ payments, onConfirm, onReject }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Pagamentos PIX Pendentes</h2>
          <p className="text-center py-6 text-base-content/70">
            Não há pagamentos PIX pendentes de confirmação.
          </p>
        </div>
      </div>
    );
  }

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
        <h2 className="card-title">Pagamentos PIX Pendentes</h2>
        <p className="text-base-content/70">
          Pagamentos PIX que aguardam confirmação manual
        </p>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Valor</th>
                <th>Chave PIX</th>
                <th>Tipo</th>
                <th>Destinatário</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className="truncate max-w-xs block">{payment.pixKey}</span>
                  </td>
                  <td>{getPixKeyTypeLabel(payment.pixKeyType)}</td>
                  <td>{payment.recipientName || "Não informado"}</td>
                  <td>{formatDateTime(payment.requestedAt)}</td>
                  <td className="flex gap-2">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => onConfirm(payment.id)}
                    >
                      Confirmar
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => onReject(payment.id)}
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

export default PixPaymentsTable;