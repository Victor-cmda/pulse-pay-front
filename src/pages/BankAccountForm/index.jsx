import React, { useState, useEffect } from "react";
import {
    CreditCard,
    Building,
    Wallet,
    ArrowLeft,
    Save,
    Info,
    AlertCircle,
    Store,
    XCircle,
    Loader,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const BankAccountForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sellerId = queryParams.get("sellerId");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seller, setSeller] = useState(null);
    const [formData, setFormData] = useState({
        bankName: "",
        bankCode: "",
        accountType: "TED",
        accountNumber: "",
        branchNumber: "",
        pixKey: "",
        pixKeyType: "CPF",
        accountHolderName: "",
        documentNumber: "",
    });
    const [errors, setErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const isEditMode = !!id;

    // Carregar dados do vendedor e da conta (se for edição)
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Simulação de carregamento de dados do vendedor
                if (sellerId) {
                    setTimeout(() => {
                        const mockSeller = {
                            id: sellerId,
                            name: "Restaurante Sabor & Arte",
                            document: "12.345.678/0001-90",
                            active: true,
                        };
                        setSeller(mockSeller);

                        // Preencher o nome do titular e documento automaticamente
                        setFormData(prev => ({
                            ...prev,
                            accountHolderName: mockSeller.name,
                            documentNumber: mockSeller.document,
                        }));

                        // Se for modo de edição, carregar dados da conta bancária
                        if (isEditMode) {
                            setTimeout(() => {
                                const mockBankAccount = {
                                    id: id,
                                    bankName: "Banco do Brasil",
                                    bankCode: "001",
                                    accountType: "TED",
                                    accountNumber: "12345-6",
                                    branchNumber: "1234",
                                    accountHolderName: "Restaurante Sabor & Arte LTDA",
                                    documentNumber: "12.345.678/0001-90",
                                    isVerified: false,
                                    createdAt: "2024-12-10T14:30:00",
                                    lastUpdatedAt: "2025-01-05T09:15:00",
                                };
                                setFormData(mockBankAccount);
                                setLoading(false);
                            }, 500);
                        } else {
                            setLoading(false);
                        }
                    }, 800);
                } else if (isEditMode) {
                    // Se for edição mas não tiver sellerId na URL, tentar carregar diretamente
                    setTimeout(() => {
                        const mockBankAccount = {
                            id: id,
                            sellerId: "d5a2f7b8-1234-5678-abcd-ef1234567890",
                            bankName: "Banco do Brasil",
                            bankCode: "001",
                            accountType: "TED",
                            accountNumber: "12345-6",
                            branchNumber: "1234",
                            accountHolderName: "Restaurante Sabor & Arte LTDA",
                            documentNumber: "12.345.678/0001-90",
                            isVerified: false,
                            createdAt: "2024-12-10T14:30:00",
                            lastUpdatedAt: "2025-01-05T09:15:00",
                        };

                        const mockSeller = {
                            id: mockBankAccount.sellerId,
                            name: "Restaurante Sabor & Arte",
                            document: "12.345.678/0001-90",
                            active: true,
                        };

                        setSeller(mockSeller);
                        setFormData(mockBankAccount);
                        setLoading(false);
                    }, 1000);
                } else {
                    // Erro: Nem é edição, nem tem sellerId
                    navigate("/bank");
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setLoading(false);
            }
        };

        loadData();
    }, [id, sellerId, isEditMode, navigate]);

    // Lista de bancos para o select
    const bankOptions = [
        { code: "001", name: "Banco do Brasil" },
        { code: "341", name: "Itaú" },
        { code: "033", name: "Santander" },
        { code: "104", name: "Caixa Econômica Federal" },
        { code: "237", name: "Bradesco" },
        { code: "290", name: "PagBank" },
        { code: "077", name: "Inter" },
        { code: "323", name: "Mercado Pago" },
        { code: "380", name: "PicPay" },
        { code: "197", name: "Stone" },
        { code: "336", name: "C6 Bank" },
        { code: "260", name: "Nubank" },
    ];

    // Lista de tipos de chave PIX
    const pixKeyTypes = [
        { value: "CPF", label: "CPF" },
        { value: "CNPJ", label: "CNPJ" },
        { value: "EMAIL", label: "E-mail" },
        { value: "PHONE", label: "Telefone" },
        { value: "RANDOM", label: "Chave aleatória" },
    ];

    // Manipulador de mudança nos campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpar erro específico do campo quando ele for alterado
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Manipulador de mudança no tipo de conta (TED/PIX)
    const handleAccountTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            accountType: type
        }));
    };

    // Selecionar um banco da lista
    const handleBankSelect = (e) => {
        const selectedIndex = e.target.selectedIndex;
        const bankCode = e.target.value;
        const bankName = selectedIndex > 0 ? bankOptions[selectedIndex - 1].name : "";

        setFormData(prev => ({
            ...prev,
            bankCode,
            bankName
        }));
    };

    // Validar o formulário antes de enviar
    const validateForm = () => {
        const newErrors = {};

        // Validações comuns
        if (!formData.bankCode) newErrors.bankCode = "Selecione um banco";
        if (!formData.accountHolderName) newErrors.accountHolderName = "Nome do titular é obrigatório";
        if (!formData.documentNumber) newErrors.documentNumber = "Documento é obrigatório";

        // Validações específicas por tipo de conta
        if (formData.accountType === "TED") {
            if (!formData.accountNumber) newErrors.accountNumber = "Número da conta é obrigatório";
            if (!formData.branchNumber) newErrors.branchNumber = "Agência é obrigatória";
        } else if (formData.accountType === "PIX") {
            if (!formData.pixKey) newErrors.pixKey = "Chave PIX é obrigatória";
            if (!formData.pixKeyType) newErrors.pixKeyType = "Tipo de chave PIX é obrigatório";

            // Validações específicas por tipo de chave PIX
            if (formData.pixKeyType === "EMAIL" && !validateEmail(formData.pixKey)) {
                newErrors.pixKey = "E-mail inválido";
            } else if (formData.pixKeyType === "PHONE" && !validatePhone(formData.pixKey)) {
                newErrors.pixKey = "Telefone inválido (formato: +5511999999999)";
            } else if (formData.pixKeyType === "CPF" && !validateCPF(formData.pixKey)) {
                newErrors.pixKey = "CPF inválido";
            } else if (formData.pixKeyType === "CNPJ" && !validateCNPJ(formData.pixKey)) {
                newErrors.pixKey = "CNPJ inválido";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Funções de validação
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone) => {
        return /^\+55\d{11}$/.test(phone);
    };

    const validateCPF = (cpf) => {
        // Simplificado para o exemplo, implemente a validação real
        return /^\d{11}$/.test(cpf.replace(/[^\d]/g, ''));
    };

    const validateCNPJ = (cnpj) => {
        // Simplificado para o exemplo, implemente a validação real
        return /^\d{14}$/.test(cnpj.replace(/[^\d]/g, ''));
    };

    // Manipulador de envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        try {
            // Simulação de envio para a API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Voltar para a página de listagem após salvar
            navigate(`/bank?sellerId=${seller.id}`);
        } catch (error) {
            console.error("Erro ao salvar conta bancária:", error);
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-6 pb-16">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Cabeçalho */}
                <div className="flex items-center mb-6">
                    <Link
                        to={`/bank${sellerId ? `?sellerId=${sellerId}` : ''}`}
                        className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {isEditMode ? "Editar Conta Bancária" : "Nova Conta Bancária"}
                    </h1>
                </div>

                {/* Informação do Comerciante */}
                {seller && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6">
                        <div className="flex items-center">
                            <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                            <div>
                                <div className="font-medium text-slate-800 dark:text-white">
                                    {seller.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    CNPJ: {seller.document}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    // Estado de carregamento
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-300">
                            Carregando dados...
                        </p>
                    </div>
                ) : (
                    // Formulário
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        {/* Tipo de conta */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Tipo de Conta
                            </label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className={`flex items-center px-4 py-2 rounded-lg border ${formData.accountType === "TED"
                                            ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-600 dark:text-indigo-300"
                                            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                        }`}
                                    onClick={() => handleAccountTypeChange("TED")}
                                >
                                    <Building className="w-5 h-5 mr-2" />
                                    <span>Transferência Bancária</span>
                                </button>
                                <button
                                    type="button"
                                    className={`flex items-center px-4 py-2 rounded-lg border ${formData.accountType === "PIX"
                                            ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-600 dark:text-indigo-300"
                                            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                        }`}
                                    onClick={() => handleAccountTypeChange("PIX")}
                                >
                                    <Wallet className="w-5 h-5 mr-2" />
                                    <span>Chave PIX</span>
                                </button>
                            </div>
                        </div>

                        {/* Banco */}
                        <div className="mb-6">
                            <label htmlFor="bankCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Banco
                            </label>
                            <select
                                id="bankCode"
                                name="bankCode"
                                value={formData.bankCode}
                                onChange={handleBankSelect}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.bankCode && formSubmitted
                                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                                        : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                            >
                                <option value="">Selecione um banco</option>
                                {bankOptions.map(bank => (
                                    <option key={bank.code} value={bank.code}>
                                        {bank.code} - {bank.name}
                                    </option>
                                ))}
                            </select>
                            {errors.bankCode && formSubmitted && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.bankCode}
                                </p>
                            )}
                        </div>

                        {formData.accountType === "TED" ? (
                            // Campos para conta TED
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {/* Agência */}
                                    <div>
                                        <label htmlFor="branchNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Agência
                                        </label>
                                        <input
                                            type="text"
                                            id="branchNumber"
                                            name="branchNumber"
                                            value={formData.branchNumber}
                                            onChange={handleChange}
                                            placeholder="Número da agência"
                                            className={`w-full px-3 py-2 border rounded-lg ${errors.branchNumber && formSubmitted
                                                    ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                                                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                                        />
                                        {errors.branchNumber && formSubmitted && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.branchNumber}
                                            </p>
                                        )}
                                    </div>

                                    {/* Conta */}
                                    <div>
                                        <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Conta
                                        </label>
                                        <input
                                            type="text"
                                            id="accountNumber"
                                            name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            placeholder="Número da conta com dígito"
                                            className={`w-full px-3 py-2 border rounded-lg ${errors.accountNumber && formSubmitted
                                                    ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                                                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                                        />
                                        {errors.accountNumber && formSubmitted && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.accountNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Campos para conta PIX
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {/* Tipo de Chave PIX */}
                                    <div>
                                        <label htmlFor="pixKeyType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Tipo de Chave PIX
                                        </label>
                                        <select
                                            id="pixKeyType"
                                            name="pixKeyType"
                                            value={formData.pixKeyType}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg ${errors.pixKeyType && formSubmitted
                                                    ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                                                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                                        >
                                            {pixKeyTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.pixKeyType && formSubmitted && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.pixKeyType}
                                            </p>
                                        )}
                                    </div>

                                    {/* Chave PIX */}
                                    <div>
                                        <label htmlFor="pixKey" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Chave PIX
                                        </label>
                                        <input
                                            type="text"
                                            id="pixKey"
                                            name="pixKey"
                                            value={formData.pixKey}
                                            onChange={handleChange}
                                            placeholder={
                                                formData.pixKeyType === "EMAIL" ? "exemplo@email.com" :
                                                    formData.pixKeyType === "PHONE" ? "+5511999999999" :
                                                        formData.pixKeyType === "CPF" ? "123.456.789-00" :
                                                            formData.pixKeyType === "CNPJ" ? "12.345.678/0001-90" :
                                                                "Chave aleatória"
                                            }
                                            className={`w-full px-3 py-2 border rounded-lg ${errors.pixKey && formSubmitted
                                                    ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                                                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                                        />
                                        {errors.pixKey && formSubmitted && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.pixKey}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Dados do titular */}
                        <div className="mb-6">
                            <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">
                                Dados do Titular
                            </h3>

                            {/* Nome do Titular */}
                            <div className="mb-4">
                                <label htmlFor="accountHolderName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Nome do Titular
                                </label>
                                <input
                                    type="text"
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                    placeholder="Nome completo do titular ou razão social"
                                    className={`w-full px-3 py-2 border rounded-lg ${errors.accountHolderName && formSubmitted
                                            ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                                            : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                                />
                                {errors.accountHolderName && formSubmitted && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.accountHolderName}
                                    </p>
                                )}
                            </div>

                            {/* CPF/CNPJ */}
                            <div>
                                <label htmlFor="documentNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    CPF/CNPJ
                                </label>
                                <input
                                    type="text"
                                    id="documentNumber"
                                    name="documentNumber"
                                    value={formData.documentNumber}
                                    onChange={handleChange}
                                    placeholder="CPF ou CNPJ do titular"
                                    className={`w-full px-3 py-2 border rounded-lg ${errors.documentNumber && formSubmitted
                                            ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                                            : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                                />
                                {errors.documentNumber && formSubmitted && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.documentNumber}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Informação de verificação */}
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-6">
                            <div className="flex">
                                <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">
                                        Verificação de conta
                                    </h4>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-400">
                                        Após o cadastro, sua conta bancária passará por uma verificação antes de ser liberada para saques automáticos. Você poderá usá-la para recebimentos imediatamente.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex justify-end space-x-3">
                            <Link
                                to={`/bank${sellerId ? `?sellerId=${sellerId}` : ''}`}
                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Salvar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BankAccountForm;