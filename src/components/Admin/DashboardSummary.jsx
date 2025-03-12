import React from "react";
import { formatCurrency } from "../../utils/formatters";

const DashboardSummary = ({ data, onTabChange }) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Carregando dados do dashboard...</p>
      </div>
    );
  }

  const cards = [
    {
      title: "Transações Pendentes",
      value: data.pendingTransactions || 0,
      tabName: "transactions",
      color: "primary"
    },
    {
      title: "Contas Bancárias Pendentes",
      value: data.pendingBankAccounts || 0,
      tabName: "bankAccounts",
      color: "secondary"
    },
    {
      title: "Saques Pendentes",
      value: data.pendingWithdraws || 0,
      tabName: "withdraws",
      color: "accent"
    },
    {
      title: "Pagamentos PIX Pendentes",
      value: data.pendingPixPayments || 0,
      tabName: "pixPayments",
      color: "info"
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Cards com contadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`card bg-base-100 shadow-xl border-t-4 border-${card.color}`}
          >
            <div className="card-body">
              <h2 className="card-title">{card.title}</h2>
              <p className="text-3xl font-bold">{card.value}</p>
              <div className="card-actions justify-end">
                <button 
                  className={`btn btn-${card.color}`}
                  onClick={() => onTabChange(card.tabName)}
                >
                  Visualizar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Status do sistema */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Status do Sistema</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-success/20 p-4 rounded-lg">
              <p className="text-sm font-medium">API Status</p>
              <p className="text-lg font-bold text-success">Online</p>
            </div>
            
            <div className="bg-info/20 p-4 rounded-lg">
              <p className="text-sm font-medium">Transações Hoje</p>
              <p className="text-lg font-bold text-info">
                {data.transactionsToday || 0}
              </p>
            </div>
            
            <div className="bg-warning/20 p-4 rounded-lg">
              <p className="text-sm font-medium">Valor Processado</p>
              <p className="text-lg font-bold text-warning">
                {formatCurrency(data.processedValueToday || 0)}
              </p>
            </div>
            
            <div className="bg-primary/20 p-4 rounded-lg">
              <p className="text-sm font-medium">Usuários Ativos</p>
              <p className="text-lg font-bold text-primary">
                {data.activeUsers || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;