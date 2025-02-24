import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowLeft,
  Save,
  X,
  BanknoteIcon,
} from "lucide-react";

// Componente principal para listagem
const BankAccountsList = () => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // Mock de dados das contas
  const [bankAccounts] = useState([
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      sellerId: "123",
      bankName: "Banco do Brasil",
      bankCode: "001",
      accountType: "TED",
      accountNumber: "12345-6",
      branchNumber: "1234",
      documentNumber: "12345678901",
      accountHolderName: "Empresa LTDA",
      isVerified: true,
      createdAt: "2024-02-23T14:30:00",
      lastUpdatedAt: "2024-02-23T14:30:00",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      sellerId: "123",
      bankName: "Itaú",
      bankCode: "341",
      accountType: "PIX",
      pixKey: "12345678901",
      pixKeyType: "CPF",
      documentNumber: "12345678901",
      accountHolderName: "Empresa LTDA",
      isVerified: false,
      createdAt: "2024-02-23T14:30:00",
      lastUpdatedAt: "2024-02-23T14:30:00",
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async (id) => {
    // Implementar deleção via API
    console.log("Delete:", id);
  };

  return (
    <div className="min-h-[94vh] bg-gradient-to-b from-base-200 to-base-300">
      <div
        className={`container mx-auto px-4 py-8 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BanknoteIcon className="w-8 h-8" />
              Contas Bancárias
            </h1>
            <p className="text-base-content/70 mt-2">
              Gerencie suas contas bancárias para recebimento
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/bank-accounts/new")}
          >
            <Plus className="w-4 h-4" />
            Nova Conta
          </button>
        </div>

        {/* Accounts List */}
        <div className="space-y-4">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="card-title">{account.bankName}</h2>
                      <div className="badge badge-outline">
                        {account.accountType}
                      </div>
                      {account.isVerified ? (
                        <div className="badge badge-success gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verificada
                        </div>
                      ) : (
                        <div className="badge badge-warning gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Pendente
                        </div>
                      )}
                    </div>

                    {account.accountType === "TED" ? (
                      <div className="text-sm space-y-1">
                        <p>Agência: {account.branchNumber}</p>
                        <p>Conta: {account.accountNumber}</p>
                      </div>
                    ) : (
                      <div className="text-sm space-y-1">
                        <p>Tipo de Chave: {account.pixKeyType}</p>
                        <div className="flex items-center gap-2">
                          <p>Chave: {account.pixKey}</p>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() =>
                              navigator.clipboard.writeText(account.pixKey)
                            }
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-sm">
                      Titular: {account.accountHolderName}
                    </p>
                    <p className="text-xs text-base-content/70">
                      Última atualização:{" "}
                      {new Date(account.lastUpdatedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        navigate(`/bank-accounts/edit/${account.id}`)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => handleDelete(account.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Accounts Message */}
        {bankAccounts.length === 0 && (
          <div className="text-center py-12">
            <BanknoteIcon className="w-16 h-16 mx-auto text-base-content/30" />
            <h3 className="mt-4 text-lg font-semibold">
              Nenhuma conta bancária cadastrada
            </h3>
            <p className="text-base-content/70 mt-2">
              Adicione uma conta bancária para começar a receber pagamentos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankAccountsList;
