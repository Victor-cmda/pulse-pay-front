import {
  Client,
  BankAccountCreateDto,
  BankAccountUpdateDto,
  CreateTransactionRequest,
  WalletCreateDto,
  WalletUpdateDto,
  UpdateTransactionStatusRequest,
  FundsOperationRequest,
  WalletType,
  PixValidationRequestDto,
  CustomerPayoutCreateDto,
  DepositRequestDto,
  WithdrawRequestDto,
  PaymentCallbackDto,
  PayoutConfirmationDto,
  PayoutRejectionDto,
  PayoutConfirmationWithProofDto,
  TransactionStatus,
  TransactionType,
} from "./PulsePayApiService";
import { setupInterceptors } from "../interceptor/apiInterceptor";

class PaymentService {
  constructor() {
    this.client = new Client("http://localhost:5232");
    this.setAuthorizationHeader = this.setAuthorizationHeader.bind(this);
    this._logoutCallback = () =>
      console.warn("Logout callback não configurado");
    this.initializeInterceptors(this._logoutCallback);
  }

  setLogoutCallback(logoutCallback) {
    if (typeof logoutCallback === "function") {
      this._logoutCallback = logoutCallback;
      this.initializeInterceptors(this._logoutCallback);
    }
  }

  initializeInterceptors(logoutCallback) {
    setupInterceptors(this.client.instance, logoutCallback);
  }

  setAuthorizationHeader(token) {
    if (token) {
      this.client.instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete this.client.instance.defaults.headers.common["Authorization"];
    }
  }

  // --------- ADMIN DASHBOARD OPERATIONS ---------

  /**
   * Get dashboard summary data for admin
   */
  async getDashboardSummary() {
    try {
      const response = await this.client.summary();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter o resumo do dashboard",
      };
    }
  }

  /**
   * Get pending transactions for admin
   * @param {number} page Page number for pagination
   * @param {number} pageSize Page size for pagination
   */
  async getPendingTransactions(page = 1, pageSize = 20) {
    try {
      const response = await this.client.pending(page, pageSize);
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter as transações pendentes",
      };
    }
  }

  /**
   * Approve a pending transaction
   * @param {string} transactionId ID of the transaction to approve
   */
  async approveTransaction(transactionId) {
    try {
      const response = await this.client.approve(transactionId);
      return {
        success: true,
        data: response.data,
        message: "Transação aprovada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível aprovar a transação",
      };
    }
  }

  /**
   * Reject a pending transaction
   * @param {string} transactionId ID of the transaction to reject
   * @param {string} reason Reason for rejection
   */
  async rejectTransaction(
    transactionId,
    reason = "Rejeitada pelo administrador"
  ) {
    try {
      const response = await this.client.reject(transactionId, reason);
      return {
        success: true,
        data: response.data,
        message: "Transação rejeitada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar a transação",
      };
    }
  }

  /**
   * Check system status and admin privileges
   */
  async checkStatus() {
    try {
      const response = await this.client.checkStatus();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível verificar o status do sistema",
      };
    }
  }

  // --------- BANK ACCOUNT OPERATIONS ---------

  /**
   * Get unverified bank accounts (admin)
   * @param {number} page Page number for pagination
   * @param {number} pageSize Page size for pagination
   */
  async getUnverifiedBankAccounts(page = 1, pageSize = 20) {
    try {
      const response = await this.client.unverified(page, pageSize);
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message ||
          "Não foi possível obter as contas bancárias não verificadas",
      };
    }
  }

  /**
   * Get a bank account by ID
   * @param {string} id Bank account ID
   */
  async getBankAccount(id) {
    try {
      const response = await this.client.bankGET(id);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar a conta bancária",
      };
    }
  }

  /**
   * Update a bank account
   * @param {string} id Bank account ID
   * @param {object} updateData Update data
   */
  async updateBankAccount(id, updateData) {
    try {
      const dto = new BankAccountUpdateDto(updateData);
      const response = await this.client.bankPUT(id, dto);
      return {
        success: true,
        data: response,
        message: "Conta bancária atualizada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar a conta bancária",
      };
    }
  }

  /**
   * Delete a bank account
   * @param {string} id Bank account ID
   * @param {string} sellerId Seller ID
   */
  async deleteBankAccount(id, sellerId) {
    try {
      await this.client.bankDELETE(id, sellerId);
      return {
        success: true,
        message: "Conta bancária excluída com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível excluir a conta bancária",
      };
    }
  }

  /**
   * Get all bank accounts for a seller
   * @param {string} sellerId Seller ID
   */
  async getSellerBankAccounts(sellerId) {
    try {
      const response = await this.client.sellerAll(sellerId);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message ||
          "Não foi possível recuperar as contas bancárias do vendedor",
      };
    }
  }

  /**
   * Create a new bank account
   * @param {object} accountData Bank account data
   */
  async createBankAccount(accountData) {
    try {
      const dto = new BankAccountCreateDto(accountData);
      const response = await this.client.bankPOST(dto);
      return {
        success: true,
        data: response,
        message: "Conta bancária criada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar a conta bancária",
      };
    }
  }

  /**
   * Verify a bank account
   * @param {string} id Bank account ID
   */
  async verifyBankAccount(id) {
    try {
      await this.client.verify(id);
      return {
        success: true,
        message: "Conta bancária verificada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível verificar a conta bancária",
      };
    }
  }

  /**
   * Validate a bank account
   * @param {object} accountData Bank account data
   */
  async validateBankAccount(accountData) {
    try {
      const dto = new BankAccountCreateDto(accountData);
      const response = await this.client.validate(dto);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível validar a conta bancária",
      };
    }
  }

  /**
   * Verify a bank account as admin
   * @param {string} id Bank account ID
   */
  async verifyBankAccountAdmin(id) {
    try {
      const response = await this.client.verify(id);
      return {
        success: true,
        data: response.data,
        message: "Conta bancária verificada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível verificar a conta bancária",
      };
    }
  }

  /**
   * Reject a bank account
   * @param {string} id Bank account ID
   * @param {string} reason Rejection reason
   */
  async rejectBankAccount(id, reason) {
    try {
      const response = await this.client.reject2(id, reason);
      return {
        success: true,
        data: response.data,
        message: "Conta bancária rejeitada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar a conta bancária",
      };
    }
  }

  // --------- WALLET OPERATIONS ---------

  /**
   * Get all wallets for a seller
   * @param {string} sellerId Seller ID
   */
  async getSellerWallets(sellerId) {
    try {
      const response = await this.client.seller3(sellerId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message ||
          "Não foi possível recuperar as carteiras do vendedor",
      };
    }
  }

  /**
   * Get a wallet by ID
   * @param {string} walletId Wallet ID
   */
  async getWallet(walletId) {
    try {
      const response = await this.client.walletsGET(walletId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar a carteira",
      };
    }
  }

  /**
   * Get a wallet by type
   * @param {string} sellerId Seller ID
   * @param {WalletType} walletType Wallet type
   */
  async getWalletByType(sellerId, walletType) {
    try {
      const response = await this.client.type(sellerId, walletType);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível recuperar a carteira pelo tipo",
      };
    }
  }

  /**
   * Get a wallet with recent transactions
   * @param {string} walletId Wallet ID
   * @param {number} count Number of recent transactions to include
   */
  async getWalletWithTransactions(walletId, count = 5) {
    try {
      const response = await this.client.withTransactions(walletId, count);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message ||
          "Não foi possível recuperar a carteira com transações",
      };
    }
  }

  /**
   * Create a new wallet
   * @param {object} walletData Wallet data
   */
  async createWallet(walletData) {
    try {
      const dto = new WalletCreateDto(walletData);
      const response = await this.client.walletsPOST(dto);
      return {
        success: true,
        data: response.data,
        message: "Carteira criada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar a carteira",
      };
    }
  }

  /**
   * Update a wallet's balance
   * @param {string} walletId Wallet ID
   * @param {object} balanceData Balance data
   */
  async updateWalletBalance(walletId, balanceData) {
    try {
      const dto = new WalletUpdateDto(balanceData);
      const response = await this.client.balancePUT(walletId, dto);
      return {
        success: true,
        data: response.data,
        message: "Saldo atualizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível atualizar o saldo da carteira",
      };
    }
  }

  /**
   * Get a wallet's available balance
   * @param {string} walletId Wallet ID
   */
  async getWalletBalance(walletId) {
    try {
      const response = await this.client.balanceGET(walletId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter o saldo da carteira",
      };
    }
  }

  /**
   * Set a wallet as default
   * @param {string} walletId Wallet ID
   * @param {string} sellerId Seller ID
   */
  async setDefaultWallet(walletId, sellerId) {
    try {
      const response = await this.client.default(walletId, sellerId);
      return {
        success: true,
        data: response.data,
        message: "Carteira definida como padrão com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível definir a carteira como padrão",
      };
    }
  }

  /**
   * Deposit funds into a wallet
   * @param {string} walletId Wallet ID
   * @param {object} operationData Operation data
   */
  async depositFunds(walletId, operationData) {
    try {
      const request = new FundsOperationRequest(operationData);
      const response = await this.client.depositsPOST2(walletId, request);
      return {
        success: true,
        data: response.data,
        message: "Depósito realizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível realizar o depósito",
      };
    }
  }

  /**
   * Withdraw funds from a wallet
   * @param {string} walletId Wallet ID
   * @param {object} operationData Operation data
   */
  async withdrawFunds(walletId, operationData) {
    try {
      const request = new FundsOperationRequest(operationData);
      const response = await this.client.withdrawals(walletId, request);
      return {
        success: true,
        data: response.data,
        message: "Saque realizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível realizar o saque",
      };
    }
  }

  /**
   * Transfer funds between wallets
   * @param {string} sourceWalletId Source wallet ID
   * @param {string} destinationWalletId Destination wallet ID
   * @param {object} operationData Operation data
   */
  async transferFunds(sourceWalletId, destinationWalletId, operationData) {
    try {
      const request = new FundsOperationRequest(operationData);
      const response = await this.client.transfer(
        sourceWalletId,
        destinationWalletId,
        request
      );
      return {
        success: true,
        data: response.data,
        message: "Transferência realizada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível realizar a transferência",
      };
    }
  }

  /**
   * Get wallet transactions
   * @param {string} walletId Wallet ID
   * @param {Date} startDate Start date
   * @param {Date} endDate End date
   * @param {number} page Page number
   * @param {number} pageSize Page size
   */
  async getWalletTransactions(
    walletId,
    startDate,
    endDate,
    page = 1,
    pageSize = 20
  ) {
    try {
      const response = await this.client.transactions(
        walletId,
        startDate,
        endDate,
        page,
        pageSize
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter as transações",
      };
    }
  }

  /**
   * Create a new transaction
   * @param {object} transactionData Transaction data
   */
  async createTransaction(transactionData) {
    try {
      const request = new CreateTransactionRequest(transactionData);
      await this.client.walletTransactionsPOST(request);
      return {
        success: true,
        message: "Transação criada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar a transação",
      };
    }
  }

  /**
   * Get a specific transaction
   * @param {string} transactionId Transaction ID
   */
  async getTransaction(transactionId) {
    try {
      const response = await this.client.walletTransactionsGET(transactionId);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter a transação",
      };
    }
  }

  /**
   * Get transaction balance
   * @param {string} walletId Wallet ID
   */
  async getTransactionBalance(walletId) {
    try {
      const response = await this.client.balanceGET2(walletId);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter o saldo das transações",
      };
    }
  }

  /**
   * Get transaction history
   * @param {string} walletId Wallet ID
   * @param {Date} startDate Start date
   * @param {Date} endDate End date
   * @param {TransactionStatus} status Transaction status
   * @param {TransactionType} type Transaction type
   * @param {number} page Page number
   * @param {number} pageSize Page size
   */
  async getTransactionHistory(
    walletId,
    startDate,
    endDate,
    status,
    type,
    page,
    pageSize
  ) {
    try {
      const response = await this.client.history(
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
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter o histórico de transações",
      };
    }
  }

  /**
   * Update transaction status
   * @param {string} transactionId Transaction ID
   * @param {object} statusData Status data
   */
  async updateTransactionStatus(transactionId, statusData) {
    try {
      const request = new UpdateTransactionStatusRequest(statusData);
      await this.client.status(transactionId, request);
      return {
        success: true,
        message: "Status da transação atualizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível atualizar o status da transação",
      };
    }
  }

  // --------- PIX OPERATIONS ---------

  /**
   * Validate a PIX key
   * @param {string} pixKey PIX key
   * @param {string} pixKeyType PIX key type
   */
  async validatePixKey(pixKey, pixKeyType) {
    try {
      const request = new PixValidationRequestDto({
        pixKey: pixKey,
        pixKeyType: pixKeyType,
      });
      const response = await this.client.validate2(request);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível validar a chave PIX",
      };
    }
  }

  /**
   * Create a PIX payment
   * @param {object} paymentData Payment data
   */
  async createPayment(paymentData) {
    try {
      const request = new CustomerPayoutCreateDto(paymentData);
      const response = await this.client.payment(request);
      return {
        success: true,
        data: response.data,
        message: "Pagamento criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar o pagamento",
      };
    }
  }

  /**
   * Get payment details
   * @param {string} paymentId Payment ID
   */
  async getPayment(paymentId) {
    try {
      const response = await this.client.customerPayouts(paymentId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter os detalhes do pagamento",
      };
    }
  }

  /**
   * Get pending PIX payments (admin)
   * @param {number} page Page number
   * @param {number} pageSize Page size
   */
  async getPendingPixPayments(page = 1, pageSize = 20) {
    try {
      const response = await this.client.pending3(page, pageSize);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter os pagamentos PIX pendentes",
      };
    }
  }

  /**
   * Confirm a PIX payment
   * @param {string} payoutId Payout ID
   * @param {string} paymentProofId Payment proof ID
   */
  async confirmPixPayment(payoutId, paymentProofId) {
    try {
      const request = new PayoutConfirmationDto({
        paymentProofId: paymentProofId,
      });
      const response = await this.client.confirm2(payoutId, request);
      return {
        success: true,
        data: response.data,
        message: "Pagamento PIX confirmado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível confirmar o pagamento PIX",
      };
    }
  }

  /**
   * Reject a PIX payment
   * @param {string} payoutId Payout ID
   * @param {string} reason Rejection reason
   */
  async rejectPixPayment(payoutId, reason) {
    try {
      const request = new PayoutRejectionDto({
        rejectionReason: reason,
      });
      const response = await this.client.reject4(payoutId, request);
      return {
        success: true,
        data: response.data,
        message: "Pagamento PIX rejeitado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar o pagamento PIX",
      };
    }
  }

  /**
   * Confirm a payment with proof
   * @param {string} payoutId Payout ID
   * @param {number} value Payment value
   * @param {string} proofReference Proof reference
   * @param {string} notes Notes
   */
  async confirmPayoutWithProof(payoutId, value, proofReference, notes) {
    try {
      const request = new PayoutConfirmationWithProofDto({
        value: value,
        proofReference: proofReference,
        notes: notes,
      });
      const response = await this.client.confirm(payoutId, request);
      return {
        success: true,
        data: response.data,
        message: "Pagamento confirmado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível confirmar o pagamento",
      };
    }
  }

  /**
   * Reject a payout
   * @param {string} payoutId Payout ID
   * @param {string} rejectionReason Rejection reason
   */
  async rejectPayout(payoutId, rejectionReason) {
    try {
      const response = await this.client.reject3(payoutId, rejectionReason);
      return {
        success: true,
        data: response.data,
        message: "Pagamento rejeitado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar o pagamento",
      };
    }
  }

  /**
   * Get pending admin payouts
   * @param {number} page Page number
   * @param {number} pageSize Page size
   */
  async getPendingAdminPayouts(page = 1, pageSize = 20) {
    try {
      const response = await this.client.pending2(page, pageSize);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter os pagamentos pendentes",
      };
    }
  }

  // --------- DEPOSIT OPERATIONS ---------

  /**
   * Create a new deposit
   * @param {object} depositData Deposit data
   */
  async createDeposit(depositData) {
    try {
      const request = new DepositRequestDto(depositData);
      const response = await this.client.depositsPOST(request);
      return {
        success: true,
        data: response.data,
        message: "Depósito criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar o depósito",
      };
    }
  }

  /**
   * Get deposit details
   * @param {string} depositId Deposit ID
   */
  async getDeposit(depositId) {
    try {
      const response = await this.client.depositsGET(depositId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter os detalhes do depósito",
      };
    }
  }

  /**
   * Get seller deposits
   * @param {string} sellerId Seller ID
   * @param {number} page Page number
   * @param {number} pageSize Page size
   */
  async getSellerDeposits(sellerId, page = 1, pageSize = 20) {
    try {
      const response = await this.client.seller(sellerId, page, pageSize);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter os depósitos do vendedor",
      };
    }
  }

  /**
   * Process payment callback
   * @param {object} callbackData Callback data
   */
  async processPaymentCallback(callbackData) {
    try {
      const request = new PaymentCallbackDto(callbackData);
      await this.client.callback(request);
      return {
        success: true,
        message: "Callback de pagamento processado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível processar o callback de pagamento",
      };
    }
  }

  // --------- WITHDRAW OPERATIONS ---------

  /**
   * Create a new withdraw request
   * @param {object} withdrawData Withdraw data
   */
  async createWithdraw(withdrawData) {
    try {
      const request = new WithdrawRequestDto(withdrawData);
      const response = await this.client.withdrawsPOST(request);
      return {
        success: true,
        data: response.data,
        message: "Solicitação de saque criada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível criar a solicitação de saque",
      };
    }
  }

  /**
   * Get withdraw details
   * @param {string} withdrawId Withdraw ID
   */
  async getWithdraw(withdrawId) {
    try {
      const response = await this.client.withdrawsGET(withdrawId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os detalhes do saque",
      };
    }
  }

  /**
   * Get seller withdraws
   * @param {string} sellerId Seller ID
   * @param {number} page Page number
   * @param {number} pageSize Page size
   */
  async getSellerWithdraws(sellerId, page = 1, pageSize = 20) {
    try {
      const response = await this.client.seller4(sellerId, page, pageSize);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter os saques do vendedor",
      };
    }
  }

  /**
   * Get pending withdraws (admin)
   * @param {number} page Page number
   * @param {number} pageSize Page size
   */
  async getPendingWithdraws(page = 1, pageSize = 20) {
    try {
      const response = await this.client.pending5(page, pageSize);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os saques pendentes",
      };
    }
  }

  /**
   * Approve a withdraw
   * @param {string} withdrawId Withdraw ID
   */
  async approveWithdraw(withdrawId) {
    try {
      const response = await this.client.approve3(withdrawId);
      return {
        success: true,
        data: response.data,
        message: "Saque aprovado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível aprovar o saque",
      };
    }
  }

  /**
   * Reject a withdraw
   * @param {string} withdrawId Withdraw ID
   * @param {string} reason Rejection reason
   */
  async rejectWithdraw(withdrawId, reason) {
    try {
      const response = await this.client.reject6(withdrawId, reason);
      return {
        success: true,
        data: response.data,
        message: "Saque rejeitado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar o saque",
      };
    }
  }

  /**
   * Process a withdraw
   * @param {string} withdrawId Withdraw ID
   * @param {string} receipt Transaction receipt
   */
  async processWithdraw(withdrawId, receipt) {
    try {
      const response = await this.client.process(withdrawId, receipt);
      return {
        success: true,
        data: response.data,
        message: "Saque processado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível processar o saque",
      };
    }
  }

  // --------- ADDITIONAL WALLET OPERATIONS ---------

  /**
   * Get all wallets (admin)
   * @param {number} page Page number
   * @param {number} pageSize Page size
   */
  async getAllWallets(page = 1, pageSize = 20) {
    try {
      const response = await this.client.all(page, pageSize);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter todas as carteiras",
      };
    }
  }

  /**
   * Update wallet balance (admin)
   * @param {string} walletId Wallet ID
   * @param {object} balanceData Balance data
   */
  async updateWalletBalanceAdmin(walletId, balanceData) {
    try {
      const dto = new WalletUpdateDto(balanceData);
      const response = await this.client.balancePUT2(walletId, dto);
      return {
        success: true,
        data: response.data,
        message: "Saldo da carteira atualizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível atualizar o saldo da carteira",
      };
    }
  }
}

export const paymentService = new PaymentService();
