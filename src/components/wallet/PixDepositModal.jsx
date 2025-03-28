import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Info, Copy, Check, Download, AlertCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const PixDepositModal = ({ onClose, sellerId, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePixCode = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Por favor, informe um valor válido para o depósito");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Dados para a requisição de pagamento PIX
      const paymentRequest = {
        amount: parseFloat(amount),
        description: description || "Depósito de fundos",
        // Dados do vendedor/cliente (normalmente viriam de um contexto ou estado global)
        // Estes devem ser ajustados conforme a estrutura real do seu aplicativo
        name: "Nome do Vendedor",
        email: "email@exemplo.com",
        document: "12345678900",
        documentType: "CPF",
      };

      // Chamada à API para gerar pagamento PIX
      const response = await fetch("/api/payment/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          SellerId: sellerId,
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao gerar código PIX");
      }

      const data = await response.json();
      setPixData(data.details);

      // Notificar componente pai sobre sucesso (opcional)
      if (onSuccess) {
        onSuccess(data.details);
      }
    } catch (err) {
      setError(
        err.message || "Não foi possível gerar o código PIX. Tente novamente."
      );
      console.error("Erro ao gerar PIX:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        setError("Falha ao copiar para a área de transferência");
      }
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg">
      <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center">
        Depositar via PIX
      </h3>

      {!pixData ? (
        <>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Você está prestes a realizar um depósito via PIX. Um código QR
                será gerado para você realizar o pagamento.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Valor do Depósito (R$) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Depósito para operação X"
                className="w-full py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleGeneratePixCode}
              disabled={loading}
              className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Gerando...</span>
                </>
              ) : (
                "Gerar Código PIX"
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Código PIX gerado com sucesso!
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Escaneie o QR Code abaixo ou copie o código PIX para realizar
                  o pagamento.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg mb-6 border border-slate-200 dark:border-slate-700 dark:bg-slate-900">
            <div className="p-2 bg-white rounded mb-4">
              <QRCodeSVG value={pixData.qrCode} size={200} />
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-800 dark:text-white mb-1">
                {formatCurrency(parseFloat(amount))}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {description || "Depósito de fundos"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Código PIX Copia e Cola
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={pixData.qrCode}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-l-lg text-sm text-slate-800 dark:text-slate-200"
              />
              <button
                onClick={() => copyToClipboard(pixData.qrCode)}
                className="px-3 bg-indigo-100 dark:bg-indigo-900/50 border border-l-0 border-indigo-300 dark:border-indigo-700 rounded-r-lg hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
                title={copied ? "Copiado!" : "Copiar"}
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                    Atenção
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    Após realizar o pagamento, o saldo será atualizado em sua
                    carteira automaticamente. Este processo pode levar alguns
                    minutos.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p>
                ID da Transação:{" "}
                <span className="font-mono">{pixData.transactionId}</span>
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PixDepositModal;
