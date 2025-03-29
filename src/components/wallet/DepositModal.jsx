import React, { useState, useEffect } from "react";
import { Download, Info, Clock, Clipboard, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { formatCurrency } from "../../utils/formatters";

const DepositModal = ({ wallet, onDeposit, onClose }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [depositStep, setDepositStep] = useState("form");
  const [qrCodeData, setQrCodeData] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [depositId, setDepositId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diffMs = expiry - now;

      if (diffMs <= 0) {
        setTimeLeft("Expirado");
        return;
      }

      const minutes = Math.floor(diffMs / (60 * 1000));
      const seconds = Math.floor((diffMs % (60 * 1000)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Por favor, insira um valor válido");
      return;
    }

    setDepositStep("processing");

    try {
      const response = await onDeposit(amount, description, reference);

      if (response && response.qrCode) {
        setQrCodeData(response.qrCode);
        setDepositId(response.id || "");
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 30);
        setExpiresAt(expiry);
        setDepositStep("qrcode");
      } else {
        throw new Error("Falha ao gerar o QR code para pagamento PIX");
      }
    } catch (error) {
      console.error("Error processing deposit:", error);
      setDepositStep("form");
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(qrCodeData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const renderDepositForm = () => (
    <>
      <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
        <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        Realizar Depósito via PIX
      </h3>
      <div className="space-y-6">
        <div className="flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">
              Carteira de{" "}
              {wallet.walletType === 0
                ? "Depósito"
                : wallet.walletType === 1
                ? "Saque"
                : "Geral"}
            </p>
            <p className="text-sm">
              Após confirmar, será gerado um QR Code PIX para pagamento.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor do Depósito
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400">R$</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Depósito para pagamentos"
              className="w-full rounded-lg border border-slate-300 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Referência (opcional)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: Invoice #12345"
              className="w-full rounded-lg border border-slate-300 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
        </div>
      </div>
      <div className="modal-action mt-8 flex gap-3">
        <button
          className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 transition-colors"
          onClick={handleSubmit}
        >
          <Download className="w-4 h-4" />
          Gerar PIX
        </button>
      </div>
    </>
  );

  const renderProcessing = () => (
    <div className="py-8 text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      <p className="mt-4 text-lg font-medium text-slate-800 dark:text-white">
        Gerando PIX...
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Aguarde enquanto geramos seu QR Code para pagamento.
      </p>
    </div>
  );

  const renderQrCode = () => (
    <>
      <h3 className="font-bold text-xl mb-4 text-center">
        PIX para Depósito - {formatCurrency(amount)}
      </h3>

      <div className="text-center mb-5">
        <div className="bg-white p-4 inline-block rounded-lg">
          <QRCodeSVG value={qrCodeData} size={220} />
        </div>

        <div className="mt-4 flex justify-center items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Expira em: <span className="text-amber-500">{timeLeft}</span>
          </p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Código PIX Copia e Cola
          </p>
          <button
            onClick={copyPixCode}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 text-sm"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                Copiar
              </>
            )}
          </button>
        </div>
        <div className="p-3 bg-white dark:bg-slate-700 rounded-md text-xs font-mono break-all text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
          {qrCodeData}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Instruções para pagamento</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Abra o aplicativo do seu banco</li>
              <li>Escaneie o QR Code ou copie o código PIX</li>
              <li>Confira as informações e confirme o pagamento</li>
              <li>Após o pagamento, você receberá uma confirmação</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
        ID do depósito: {depositId}
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </>
  );

  return (
    <>
      {depositStep === "form" && renderDepositForm()}
      {depositStep === "processing" && renderProcessing()}
      {depositStep === "qrcode" && renderQrCode()}
    </>
  );
};

export default DepositModal;
