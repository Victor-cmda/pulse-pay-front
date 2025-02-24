import React, { useState, useEffect } from "react";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Eye,
  AlertCircle,
  ChevronRight,
  CreditCard,
  RefreshCcw,
  BanknoteIcon,
} from "lucide-react";

const WalletManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showNewWalletModal, setShowNewWalletModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Dados mockados para exemplo
  const [wallets] = useState([
    {
      id: 1,
      name: "Carteira Principal",
      balance: 15780.5,
      blocked_balance: 2500.0,
      available_balance: 13280.5,
      account: {
        bank: "341 - Itaú",
        agency: "1234",
        account: "12345-6",
        type: "Conta Corrente",
      },
      transactions: [
        {
          id: 1,
          type: "deposit",
          amount: 1500.0,
          description: "Depósito via PIX",
          date: "2024-02-23 14:30:25",
          status: "completed",
          transaction_id: "PIX78945612378",
        },
        {
          id: 2,
          type: "blocked",
          amount: 2500.0,
          description: "Valor bloqueado para liquidação",
          date: "2024-02-22 09:15:00",
          status: "blocked",
          transaction_id: "BLQ45612378945",
        },
      ],
    },
    {
      id: 2,
      name: "Carteira Secundária",
      balance: 45000.0,
      blocked_balance: 0.0,
      available_balance: 45000.0,
      account: {
        bank: "341 - Itaú",
        agency: "1234",
        account: "12345-7",
        type: "Conta Corrente",
      },
      transactions: [],
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const NewWalletModal = () => (
    <dialog
      id="new_wallet_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showNewWalletModal}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Nova Carteira</h3>
        <form className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nome da Carteira</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Carteira Principal"
              className="input input-bordered"
            />
          </div>

          <div className="divider">Dados Bancários</div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Banco</span>
            </label>
            <select className="select select-bordered w-full">
              <option value="">Selecione o banco</option>
              <option value="341">341 - Itaú</option>
              <option value="001">001 - Banco do Brasil</option>
              <option value="237">237 - Bradesco</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Agência</span>
              </label>
              <input
                type="text"
                placeholder="0000"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Conta</span>
              </label>
              <input
                type="text"
                placeholder="00000-0"
                className="input input-bordered"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Tipo de Conta</span>
            </label>
            <select className="select select-bordered w-full">
              <option value="checking">Conta Corrente</option>
              <option value="savings">Conta Poupança</option>
            </select>
          </div>
        </form>
        <div className="modal-action">
          <button className="btn" onClick={() => setShowNewWalletModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary">Criar Carteira</button>
        </div>
      </div>
    </dialog>
  );

  const DepositModal = () => (
    <dialog
      id="deposit_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showDepositModal}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Realizar Depósito</h3>
        <div className="space-y-4">
          <div className="alert alert-info">
            <AlertCircle className="w-5 h-5" />
            <span>Os depósitos são processados via PIX ou TED</span>
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Dados para Depósito</h4>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Banco:</strong> {selectedWallet?.account.bank}
              </p>
              <p>
                <strong>Agência:</strong> {selectedWallet?.account.agency}
              </p>
              <p>
                <strong>Conta:</strong> {selectedWallet?.account.account}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedWallet?.account.type}
              </p>
              <p>
                <strong>CNPJ:</strong> XX.XXX.XXX/0001-XX
              </p>
            </div>
          </div>

          <div className="alert alert-warning">
            <AlertCircle className="w-5 h-5" />
            <span>O valor será creditado após a confirmação do depósito</span>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={() => setShowDepositModal(false)}>
            Fechar
          </button>
          <button className="btn btn-primary gap-2">
            <Download className="w-4 h-4" />
            Baixar Dados
          </button>
        </div>
      </div>
    </dialog>
  );

  const TransferModal = () => (
    <dialog
      id="transfer_modal"
      className="modal modal-bottom sm:modal-middle"
      open={showTransferModal}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Solicitar Transferência</h3>
        <form className="space-y-4">
          <div className="alert alert-info">
            <AlertCircle className="w-5 h-5" />
            <span>
              Saldo disponível para transferência: R${" "}
              {selectedWallet?.available_balance.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Valor da Transferência</span>
            </label>
            <input
              type="number"
              placeholder="R$ 0,00"
              className="input input-bordered"
            />
          </div>

          <div className="alert alert-warning">
            <AlertCircle className="w-5 h-5" />
            <span>A transferência será processada em até 1 dia útil</span>
          </div>
        </form>
        <div className="modal-action">
          <button className="btn" onClick={() => setShowTransferModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary">Solicitar Transferência</button>
        </div>
      </div>
    </dialog>
  );

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
              <Wallet className="w-8 h-8" />
              Minhas Carteiras
            </h1>
            <p className="text-base-content/70 mt-2">
              Gerencie suas carteiras e movimentações financeiras
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowNewWalletModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nova Carteira
          </button>
        </div>

        {/* Wallets List */}
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title">{wallet.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                      <BanknoteIcon className="w-4 h-4" />
                      {wallet.account.bank} • {wallet.account.agency} •{" "}
                      {wallet.account.account}
                    </div>
                  </div>
                  <div className="dropdown dropdown-end">
                    <button className="btn btn-square btn-ghost">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block w-5 h-5 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        ></path>
                      </svg>
                    </button>
                    <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <a
                          onClick={() => {
                            setSelectedWallet(wallet);
                            setShowDepositModal(true);
                          }}
                        >
                          Dados para Depósito
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => {
                            setSelectedWallet(wallet);
                            setShowTransferModal(true);
                          }}
                        >
                          Solicitar Transferência
                        </a>
                      </li>
                      <li>
                        <a>Extrato Detalhado</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="stat bg-base-200 rounded-box">
                    <div className="stat-title">Saldo Total</div>
                    <div className="stat-value text-lg">
                      R${" "}
                      {wallet.balance.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-box">
                    <div className="stat-title">Saldo Bloqueado</div>
                    <div className="stat-value text-lg text-warning">
                      R${" "}
                      {wallet.blocked_balance.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-box">
                    <div className="stat-title">Saldo Disponível</div>
                    <div className="stat-value text-lg text-success">
                      R${" "}
                      {wallet.available_balance.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                {wallet.transactions.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">
                      Últimas Movimentações
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <tbody>
                          {wallet.transactions
                            .slice(0, 3)
                            .map((transaction) => (
                              <tr key={transaction.id}>
                                <td>
                                  <div
                                    className={`flex items-center gap-2 ${
                                      transaction.type === "deposit"
                                        ? "text-success"
                                        : transaction.type === "blocked"
                                        ? "text-warning"
                                        : "text-error"
                                    }`}
                                  >
                                    {transaction.type === "deposit" ? (
                                      <ArrowUpRight className="w-4 h-4" />
                                    ) : transaction.type === "blocked" ? (
                                      <RefreshCcw className="w-4 h-4" />
                                    ) : (
                                      <ArrowDownRight className="w-4 h-4" />
                                    )}
                                    {transaction.description}
                                  </div>
                                  <div className="text-xs text-base-content/70">
                                    {new Date(transaction.date).toLocaleString(
                                      "pt-BR"
                                    )}
                                  </div>
                                </td>
                                <td className="text-right">
                                  <div
                                    className={`font-semibold ${
                                      transaction.type === "deposit"
                                        ? "text-success"
                                        : transaction.type === "blocked"
                                        ? "text-warning"
                                        : "text-error"
                                    }`}
                                  >
                                    R${" "}
                                    {transaction.amount.toLocaleString(
                                      "pt-BR",
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </div>
                                  <div className="text-xs text-base-content/70">
                                    {transaction.transaction_id}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <button className="btn btn-ghost btn-sm w-full mt-2">
                      Ver todas as movimentações
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        <NewWalletModal />
        {selectedWallet && <DepositModal />}
        {selectedWallet && <TransferModal />}
      </div>
    </div>
  );
};

export default WalletManagement;
