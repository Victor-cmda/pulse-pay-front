import { 
  WalletClient,
  WalletTransactionsClient,
  BankAccountClient,
  WithdrawClient,
  CreateTransactionRequest,
  WalletCreateDto,
  WalletUpdateDto,
  WithdrawCreateDto,
  WithdrawUpdateDto,
  BankAccountCreateDto,
  BankAccountUpdateDto,
  UpdateTransactionStatusRequest
} from "./PulsePayApiService";

const baseUrl = "https://localhost:5232";

// Inicialização dos clientes
const walletClient = new WalletClient(baseUrl);
const transactionsClient = new WalletTransactionsClient(baseUrl);
const bankAccountClient = new BankAccountClient(baseUrl);
const withdrawClient = new WithdrawClient(baseUrl);

// Funções de Carteira (Wallet)
const createWallet = async (sellerId) => {
  try {
    const dto = new WalletCreateDto({ sellerId });
    await walletClient.walletPost(dto);
    return {
      success: true,
      message: "Carteira criada com sucesso"
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao criar carteira: ${error.message}`
    };
  }
};

const getWallet = async (sellerId) => {
  try {
    const response = await walletClient.walletGet(sellerId);
    return {
      success: true,
      message: "Carteira consultada com sucesso",
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao consultar carteira: ${error.message}`
    };
  }
};

const updateWalletBalance = async (sellerId, availableBalance, pendingBalance) => {
  try {
    const dto = new WalletUpdateDto({
      availableBalance,
      pendingBalance
    });
    await walletClient.balance(sellerId, dto);
    return {
      success: true,
      message: "Saldo atualizado com sucesso"
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao atualizar saldo: ${error.message}`
    };
  }
};

// Funções de Transação
const createTransaction = async ({ walletId, amount, type, description, reference }) => {
  try {
    const request = new CreateTransactionRequest({
      walletId,
      amount,
      type,
      description,
      reference
    });
    await transactionsClient.walletTransactionsPost(request);
    return {
      success: true,
      message: "Transação criada com sucesso"
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao criar transação: ${error.message}`
    };
  }
};

const getTransaction = async (transactionId) => {
  try {
    const response = await transactionsClient.walletTransactionsGet(transactionId);
    return {
      success: true,
      message: "Transação consultada com sucesso",
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao consultar transação: ${error.message}`
    };
  }
};

const getWalletBalance = async (walletId) => {
  try {
    const response = await transactionsClient.balance(walletId);
    return {
      success: true,
      message: "Saldo consultado com sucesso",
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao consultar saldo: ${error.message}`
    };
  }
};

const getTransactionHistory = async ({ walletId, startDate, endDate, status, type, page, pageSize }) => {
  try {
    const response = await transactionsClient.history(
      walletId,
      startDate,
      endDate,
      status,
      type,
      page,
      pageSize
    );
    return {
      success: true,
      message: "Histórico consultado com sucesso",
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao consultar histórico: ${error.message}`
    };
  }
};

// Funções de Conta Bancária
const createBankAccount = async (bankAccountData) => {
  try {
    const dto = new BankAccountCreateDto(bankAccountData);
    await bankAccountClient.bankAccountPost(dto);
    return {
      success: true,
      message: "Conta bancária criada com sucesso"
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao criar conta bancária: ${error.message}`
    };
  }
};

const getBankAccount = async (id) => {
  try {
    const response = await bankAccountClient.bankAccountGet(id);
    return {
      success: true,
      message: "Conta bancária consultada com sucesso",
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao consultar conta bancária: ${error.message}`
    };
  }
};

const getSellerBankAccounts = async (sellerId) => {
  try {
    const response = await bankAccountClient.seller(sellerId);
    return {
      success: true,
      message: "Contas bancárias consultadas com sucesso",
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao consultar contas bancárias: ${error.message}`
    };
  }
};

// Funções de Saque
const createWithdraw = async ({ sellerId, amount, withdrawMethod, bankAccountId }) => {
  try {
    const dto = new WithdrawCreateDto({
      sellerId,
      amount,
      withdrawMethod,
      bankAccountId
    });
    await withdrawClient.withdrawPost(dto);
    return {
      success: true,
      message: "Solicitação de saque criada com sucesso"
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao criar solicitação de saque: ${error.message}`
    };
  }
};

const getWithdraw = async (id) => {
  try {
    const response = await withdrawClient.withdrawGet(id);
    return {
      success: true,
      message: "Saque consultado com sucesso",
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao consultar saque: ${error.message}`
    };
  }
};

const processWithdraw = async (id, updateData) => {
  try {
    const dto = new WithdrawUpdateDto(updateData);
    await withdrawClient.process(id, dto);
    return {
      success: true,
      message: "Saque processado com sucesso"
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao processar saque: ${error.message}`
    };
  }
};

const getPendingWithdraws = async () => {
  try {
    const response = await withdrawClient.pending();
    return {
      success: true,
      message: "Saques pendentes consultados com sucesso",
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: `Falha ao consultar saques pendentes: ${error.message}`
    };
  }
};

const PaymentService = {
  // Wallet operations
  createWallet,
  getWallet,
  updateWalletBalance,
  
  // Transaction operations
  createTransaction,
  getTransaction,
  getWalletBalance,
  getTransactionHistory,
  
  // Bank account operations
  createBankAccount,
  getBankAccount,
  getSellerBankAccounts,
  
  // Withdraw operations
  createWithdraw,
  getWithdraw,
  processWithdraw,
  getPendingWithdraws
};

export default PaymentService;
