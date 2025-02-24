import { ArrowLeft, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BankAccountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banksList] = useState([
    { code: "001", name: "Banco do Brasil" },
    { code: "341", name: "Itaú Unibanco" },
    { code: "033", name: "Santander" },
    { code: "237", name: "Bradesco" },
  ]);

  const [formData, setFormData] = useState({
    accountType: "TED",
    bankName: "",
    bankCode: "",
    accountNumber: "",
    branchNumber: "",
    documentNumber: "",
    accountHolderName: "",
    pixKey: "",
    pixKeyType: null,
  });

  useEffect(() => {
    setMounted(true);
    if (id) {
      // Carregar dados da conta para edição
      // loadBankAccount(id);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        // await updateBankAccount(id, formData);
      } else {
        // await createBankAccount(formData);
      }
      navigate("/bank-accounts");
    } catch (error) {
      console.error(error);
      // Mostrar mensagem de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[94vh] bg-gradient-to-b from-base-200 to-base-300">
      <div
        className={`container mx-auto px-4 py-8 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate("/bank-accounts")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">
              {id ? "Editar Conta Bancária" : "Nova Conta Bancária"}
            </h1>
            <p className="text-base-content/70 mt-1">
              {id
                ? "Atualize os dados da sua conta bancária"
                : "Adicione uma nova conta bancária para recebimentos"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Conta */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tipo de Conta</span>
                </label>
                <div className="tabs tabs-boxed">
                  <a
                    className={`tab ${
                      formData.accountType === "TED" ? "tab-active" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, accountType: "TED" })
                    }
                  >
                    TED
                  </a>
                  <a
                    className={`tab ${
                      formData.accountType === "PIX" ? "tab-active" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, accountType: "PIX" })
                    }
                  >
                    PIX
                  </a>
                </div>
              </div>

              {/* Seleção do Banco */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Banco</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.bankCode}
                  onChange={(e) => {
                    const bank = banksList.find(
                      (b) => b.code === e.target.value
                    );
                    setFormData({
                      ...formData,
                      bankCode: e.target.value,
                      bankName: bank?.name || "",
                    });
                  }}
                >
                  <option value="">Selecione um banco</option>
                  {banksList.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.code} - {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.accountType === "TED" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Agência</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="0000"
                      value={formData.branchNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branchNumber: e.target.value,
                        })
                      }
                      maxLength={10}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Conta</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="00000-0"
                      value={formData.accountNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountNumber: e.target.value,
                        })
                      }
                      maxLength={20}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Tipo de Chave PIX
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={formData.pixKeyType || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, pixKeyType: e.target.value })
                      }
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="EMAIL">E-mail</option>
                      <option value="PHONE">Telefone</option>
                      <option value="EVP">Chave Aleatória</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Chave PIX</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="Digite sua chave PIX"
                      value={formData.pixKey || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, pixKey: e.target.value })
                      }
                      maxLength={100}
                    />
                  </div>
                </div>
              )}

              {/* Campos Comuns */}
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Nome do Titular
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Nome completo do titular"
                    value={formData.accountHolderName || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountHolderName: e.target.value,
                      })
                    }
                    maxLength={100}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      CPF/CNPJ do Titular
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="000.000.000-00"
                    value={formData.documentNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documentNumber: e.target.value,
                      })
                    }
                    maxLength={14}
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/bank-accounts")}
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  {id ? "Salvar Alterações" : "Criar Conta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccountForm;
