import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Building,
  Wallet,
  ArrowLeft,
  Save,
  Info,
  AlertCircle,
  User,
  ChevronDown,
  Check,
  Loader,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { paymentService } from "../../services/PaymentService";
import { authService } from "../../services/AuthService";
import { notification } from "antd";

const BankAccountForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sellerId = queryParams.get("sellerId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();

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

  useEffect(() => {
    const loadSellers = async () => {
      try {
        setSellerLoading(true);
        const sellersResponse = await authService.getAvailableSellers();

        if (sellersResponse.success && sellersResponse.data) {
          setSellers(sellersResponse.data || []);

          if (sellerId) {
            const seller = sellersResponse.data.find(s => s.id === sellerId);
            if (seller) {
              setSelectedSeller(seller);

              setFormData(prev => ({
                ...prev,
                accountHolderName: seller.name,
                documentNumber: seller.document,
                sellerId: seller.id
              }));
            }
          }
        } else {
          api.error({
            message: "Erro",
            description: sellersResponse.message || "Erro ao carregar vendedores",
            placement: "topRight",
          });
          setSellers([]);
        }
      } catch (error) {
        api.error({
          message: "Erro",
          description: "Não foi possível carregar a lista de vendedores",
          placement: "topRight",
        });
        setSellers([]);
      } finally {
        setSellerLoading(false);
        if (!isEditMode) {
          setLoading(false);
        }
      }
    };

    loadSellers();
  }, [sellerId, isEditMode, api]);

  useEffect(() => {
    const loadBankAccount = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const accountResponse = await paymentService.getBankAccount(id);

          if (accountResponse.success && accountResponse.data) {
            setFormData(accountResponse.data);

            if (!selectedSeller && accountResponse.data.sellerId) {
              const sellerResponse = await authService.getSellerWithCommerces(
                accountResponse.data.sellerId
              );

              if (sellerResponse.success && sellerResponse.data) {
                setSelectedSeller(sellerResponse.data);
              }
            }
          } else {
            api.error({
              message: "Erro",
              description: accountResponse.message || "Não foi possível carregar os dados da conta bancária",
              placement: "topRight",
            });
            navigate("/bank");
          }
        } catch (error) {
          api.error({
            message: "Erro",
            description: "Ocorreu um erro ao carregar os dados. Tente novamente.",
            placement: "topRight",
          });
          navigate("/bank");
        } finally {
          setLoading(false);
        }
      }
    };

    loadBankAccount();
  }, [id, isEditMode, navigate, selectedSeller, api]);

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

  // Funções de formatação
  const formatCPF = (value) => {
    if (!value) return value;

    const onlyNumbers = value.replace(/\D/g, '');

    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 6) return `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3)}`;
    if (onlyNumbers.length <= 9) return `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3, 6)}.${onlyNumbers.slice(6)}`;

    return `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3, 6)}.${onlyNumbers.slice(6, 9)}-${onlyNumbers.slice(9, 11)}`;
  };

  const formatCNPJ = (value) => {
    if (!value) return value;

    const onlyNumbers = value.replace(/\D/g, '');

    if (onlyNumbers.length <= 2) return onlyNumbers;
    if (onlyNumbers.length <= 5) return `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2)}`;
    if (onlyNumbers.length <= 8) return `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2, 5)}.${onlyNumbers.slice(5)}`;
    if (onlyNumbers.length <= 12) return `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2, 5)}.${onlyNumbers.slice(5, 8)}/${onlyNumbers.slice(8)}`;

    return `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2, 5)}.${onlyNumbers.slice(5, 8)}/${onlyNumbers.slice(8, 12)}-${onlyNumbers.slice(12, 14)}`;
  };

  const formatPhone = (value) => {
    if (!value) return value;

    // Garantir que começa com +55
    let formattedValue = value;
    if (!formattedValue.startsWith('+')) formattedValue = '+' + formattedValue;
    if (!formattedValue.startsWith('+55') && formattedValue.startsWith('+')) formattedValue = '+55' + formattedValue.substring(1);

    // Remover caracteres não numéricos após o +55
    const prefix = '+55';
    const onlyNumbers = formattedValue.substring(3).replace(/\D/g, '');

    return prefix + onlyNumbers;
  };

  const formatBranchNumber = (value) => {
    if (!value) return value;

    // Remover caracteres não numéricos
    const onlyNumbers = value.replace(/\D/g, '');

    // Limitar a 4 dígitos (padrão comum para agências)
    return onlyNumbers.slice(0, 4);
  };

  const formatAccountNumber = (value) => {
    if (!value) return value;

    // Remover caracteres não numéricos
    const onlyNumbers = value.replace(/\D/g, '');

    // Formatar com hífen antes do último dígito se tiver mais de 1 dígito
    if (onlyNumbers.length > 1) {
      return `${onlyNumbers.slice(0, -1)}-${onlyNumbers.slice(-1)}`;
    }

    return onlyNumbers;
  };

  const formatDocumentNumber = (value) => {
    if (!value) return value;

    const onlyNumbers = value.replace(/\D/g, '');

    // Verificar se é CPF ou CNPJ pelo número de dígitos
    if (onlyNumbers.length <= 11) {
      return formatCPF(onlyNumbers);
    } else {
      return formatCNPJ(onlyNumbers);
    }
  };

  const formatPixKey = (value, type) => {
    if (!value) return value;

    switch (type) {
      case 'CPF':
        return formatCPF(value);
      case 'CNPJ':
        return formatCNPJ(value);
      case 'PHONE':
        return formatPhone(value);
      case 'EMAIL':
        return value.toLowerCase();
      default:
        return value;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
  
    switch (name) {
      case 'branchNumber':
        formattedValue = formatBranchNumber(value);
        break;
      case 'accountNumber':
        formattedValue = formatAccountNumber(value);
        break;
      case 'documentNumber':
        formattedValue = formatDocumentNumber(value);
        break;
      case 'pixKey':
        formattedValue = formatPixKey(value, formData.pixKeyType);
        break;
      default:
        formattedValue = value;
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue ?? '',
    }));
  
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  useEffect(() => {
    if (formData.pixKey) {
      setFormData(prev => ({
        ...prev,
        pixKey: formatPixKey(prev.pixKey, prev.pixKeyType)
      }));
    }
  }, [formData.pixKeyType]);

  const handleAccountTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      accountType: type,
    }));
  };

  const handleBankSelect = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const bankCode = e.target.value;
    const bankName =
      selectedIndex > 0 ? bankOptions[selectedIndex - 1].name : "";

    setFormData((prev) => ({
      ...prev,
      bankCode,
      bankName,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedSeller) newErrors.sellerId = "Selecione um vendedor";

    if (!formData.bankCode) newErrors.bankCode = "Selecione um banco";
    if (!formData.accountHolderName)
      newErrors.accountHolderName = "Nome do titular é obrigatório";
    if (!formData.documentNumber)
      newErrors.documentNumber = "Documento é obrigatório";

    if (formData.accountType === "TED") {
      if (!formData.accountNumber)
        newErrors.accountNumber = "Número da conta é obrigatório";
      if (!formData.branchNumber)
        newErrors.branchNumber = "Agência é obrigatória";
    } else if (formData.accountType === "PIX") {
      if (!formData.pixKey) newErrors.pixKey = "Chave PIX é obrigatória";
      if (!formData.pixKeyType)
        newErrors.pixKeyType = "Tipo de chave PIX é obrigatório";

      if (formData.pixKeyType === "EMAIL" && !validateEmail(formData.pixKey)) {
        newErrors.pixKey = "E-mail inválido";
      } else if (
        formData.pixKeyType === "PHONE" &&
        !validatePhone(formData.pixKey)
      ) {
        newErrors.pixKey = "Telefone inválido (formato: +5511999999999)";
      } else if (
        formData.pixKeyType === "CPF" &&
        !validateCPF(formData.pixKey)
      ) {
        newErrors.pixKey = "CPF inválido";
      } else if (
        formData.pixKeyType === "CNPJ" &&
        !validateCNPJ(formData.pixKey)
      ) {
        newErrors.pixKey = "CNPJ inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Validar apenas os dígitos após +55
    const phoneDigits = phone.replace(/\D/g, '').slice(-11);
    return phoneDigits.length === 11;
  };

  const validateCPF = (cpf) => {
    const cpfDigits = cpf.replace(/\D/g, '');
    return cpfDigits.length === 11;
  };

  const validateCNPJ = (cnpj) => {
    const cnpjDigits = cnpj.replace(/\D/g, '');
    return cnpjDigits.length === 14;
  };


  // Função para normalizar os dados antes de enviar para o backend
  const normalizeDataForSubmission = (data) => {
    // Criar uma cópia para não modificar o state diretamente
    const normalizedData = { ...data };

    // Remover formatação dos campos antes de enviar para o backend
    if (normalizedData.documentNumber) {
      normalizedData.documentNumber = normalizedData.documentNumber.replace(/\D/g, '');
    }

    if (normalizedData.accountNumber) {
      normalizedData.accountNumber = normalizedData.accountNumber.replace(/\D/g, '');
    }

    if (normalizedData.branchNumber) {
      normalizedData.branchNumber = normalizedData.branchNumber.replace(/\D/g, '');
    }

    if (normalizedData.pixKeyType === 'CPF' && normalizedData.pixKey) {
      normalizedData.pixKey = normalizedData.pixKey.replace(/\D/g, '');
    }

    if (normalizedData.pixKeyType === 'CNPJ' && normalizedData.pixKey) {
      normalizedData.pixKey = normalizedData.pixKey.replace(/\D/g, '');
    }

    return normalizedData;
  };


  // Manipulador de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Garantir que sellerId esteja no formData
    if (selectedSeller) {
      setFormData(prev => ({
        ...prev,
        sellerId: selectedSeller.id
      }));
    }

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Normalizar os dados antes de enviar
      const normalizedData = normalizeDataForSubmission(formData);

      // Verificar se a conta é válida através do serviço
      const validationResponse = await paymentService.validateBankAccount(
        normalizedData
      );
      if (
        !validationResponse.success ||
        (validationResponse.data && !validationResponse.data.isValid)
      ) {
        // Se a validação falhar, mostrar erros
        if (
          validationResponse.data &&
          validationResponse.data.validationErrors
        ) {
          api.error({
            message: "Erro de validação",
            description: validationResponse.data.validationErrors.join(", "),
            placement: "topRight",
          });
        } else {
          api.error({
            message: "Erro de validação",
            description: validationResponse.message || "Dados inválidos. Verifique os campos.",
            placement: "topRight",
          });
        }
        setSaving(false);
        return;
      }

      // Salvar a conta bancária
      let response;
      if (isEditMode) {
        response = await paymentService.updateBankAccount(id, normalizedData);
      } else {
        response = await paymentService.createBankAccount(normalizedData);
      }

      if (response.success) {
        api.success({
          message: "Sucesso",
          description: response.message ||
            (isEditMode ? "Conta bancária atualizada com sucesso!" : "Conta bancária criada com sucesso!"),
          placement: "topRight",
        });
        navigate("/bank");
      } else {
        debugger;
        api.error({
          message: "Erro",
          description: response.message || "Erro ao salvar conta bancária.",
          placement: "topRight",
        });
        setSaving(false);
      }
    } catch (error) {
      api.error({
        message: "Erro",
        description: "Erro ao salvar conta bancária. Tente novamente mais tarde.",
        placement: "topRight",
      });
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-6 pb-16">
      {contextHolder}
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center mb-6">
          <Link
            to="/bank"
            className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {isEditMode ? "Editar Conta Bancária" : "Nova Conta Bancária"}
          </h1>
        </div>

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
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-6"
          >
            {/* Seletor de Seller (se não estiver em modo de edição) */}
            {!isEditMode && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Vendedor
                </label>
                <div className="relative">
                  <div
                    className={`p-3 border ${errors.sellerId && formSubmitted
                      ? "border-red-300 dark:border-red-600"
                      : "border-slate-300 dark:border-slate-600"
                      } rounded-lg flex justify-between items-center cursor-pointer bg-white dark:bg-slate-800`}
                    onClick={() => setShowSellerDropdown(!showSellerDropdown)}
                  >
                    {selectedSeller ? (
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white">
                            {selectedSeller.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {selectedSeller.description || "Sem descrição"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">
                        Selecione um vendedor...
                      </span>
                    )}
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                  {errors.sellerId && formSubmitted && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.sellerId}
                    </p>
                  )}

                  {showSellerDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {sellerLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                          <span className="ml-2 text-slate-600 dark:text-slate-300">
                            Carregando vendedores...
                          </span>
                        </div>
                      ) : sellers.length > 0 ? (
                        sellers.map((seller) => (
                          <div
                            key={seller.id}
                            className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                            onClick={() => {
                              setSelectedSeller(seller);
                              setShowSellerDropdown(false);

                              setFormData(prev => ({
                                ...prev,
                                sellerId: seller.id,
                                accountHolderName: seller.name,
                                documentNumber: seller.document ? formatDocumentNumber(seller.document) : ''
                              }));
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <User
                                  className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"
                                />
                                <div>
                                  <div className="font-medium text-slate-800 dark:text-white flex items-center">
                                    {seller.name}
                                    {selectedSeller &&
                                      selectedSeller.id === seller.id && (
                                        <Check className="w-4 h-4 text-green-500 ml-2" />
                                      )}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {seller.description || "Sem descrição"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                          Nenhum vendedor encontrado
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Informação do Vendedor (em modo de edição) */}
            {isEditMode && selectedSeller && (
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">
                      {selectedSeller.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Documento: {selectedSeller.document ? formatDocumentNumber(selectedSeller.document) : "Não informado"}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
              <label
                htmlFor="bankCode"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Banco
              </label>
              <select
                id="bankCode"
                name="bankCode"
                value={formData.bankCode ?? ''}
                onChange={handleBankSelect}
                className={`w-full px-3 py-2 border rounded-lg ${errors.bankCode && formSubmitted
                  ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                  : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
              >
                <option value="">Selecione um banco</option>
                {bankOptions.map((bank) => (
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
                    <label
                      htmlFor="branchNumber"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Agência
                    </label>
                    <input
                      type="text"
                      id="branchNumber"
                      name="branchNumber"
                      value={formData.branchNumber}
                      onChange={handleChange}
                      placeholder="Número da agência"
                      maxLength={4}
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
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
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
                    <label
                      htmlFor="pixKeyType"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
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
                      {pixKeyTypes.map((type) => (
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
                    <label
                      htmlFor="pixKey"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Chave PIX
                    </label>
                    <input
                      type={formData.pixKeyType === "EMAIL" ? "email" : "text"}
                      id="pixKey"
                      name="pixKey"
                      value={formData.pixKey}
                      onChange={handleChange}
                      placeholder={
                        formData.pixKeyType === "EMAIL"
                          ? "exemplo@email.com"
                          : formData.pixKeyType === "PHONE"
                            ? "+5511999999999"
                            : formData.pixKeyType === "CPF"
                              ? "123.456.789-00"
                              : formData.pixKeyType === "CNPJ"
                                ? "12.345.678/0001-90"
                                : "Chave aleatória"
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
                <label
                  htmlFor="accountHolderName"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
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
                <label
                  htmlFor="documentNumber"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
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
                    Após o cadastro, sua conta bancária passará por uma
                    verificação antes de ser liberada para saques automáticos.
                  </p>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3">
              <Link
                to="/bank"
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
