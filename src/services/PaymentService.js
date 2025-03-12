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
  TransactionType
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

  // --------- BANK ACCOUNT OPERATIONS ---------

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

  // --------- WALLET OPERATIONS ---------
  
  // Método para obter todas as carteiras de um vendedor
  async seller(sellerId) {
    try {
      const response = await this.client.seller2(sellerId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar as carteiras do vendedor"
      };
    }
  }

  // Método para obter uma carteira específica pelo ID
  async walletsGET(walletId) {
    try {
      const response = await this.client.walletsGET(walletId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar a carteira"
      };
    }
  }

  // Método para obter uma carteira pelo tipo
  async type(sellerId, walletType) {
    try {
      const response = await this.client.type(sellerId, walletType);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar a carteira pelo tipo"
      };
    }
  }

  // Método para obter uma carteira com transações recentes
  async withTransactions(walletId, count = 5) {
    try {
      const response = await this.client.withTransactions(walletId, count);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar a carteira com transações"
      };
    }
  }

  // Método para criar uma nova carteira
  async walletsPOST(walletData) {
    try {
      const dto = new WalletCreateDto(walletData);
      const response = await this.client.walletsPOST(dto);
      return {
        success: true,
        data: response.data,
        message: "Carteira criada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar a carteira"
      };
    }
  }

  // Método para atualizar o saldo de uma carteira
  async balancePUT(walletId, balanceData) {
    try {
      const dto = new WalletUpdateDto(balanceData);
      const response = await this.client.balancePUT(walletId, dto);
      return {
        success: true,
        data: response.data,
        message: "Saldo atualizado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar o saldo da carteira"
      };
    }
  }

  // Método para obter o saldo disponível de uma carteira
  async balanceGET(walletId) {
    try {
      const response = await this.client.balanceGET(walletId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter o saldo da carteira"
      };
    }
  }

  // Método para definir uma carteira como padrão
  async default(walletId, sellerId) {
    try {
      const response = await this.client.default(walletId, sellerId);
      return {
        success: true,
        data: response.data,
        message: "Carteira definida como padrão com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível definir a carteira como padrão"
      };
    }
  }

  // Método para depositar fundos em uma carteira
  async deposits(walletId, operationData) {
    try {
      const request = new FundsOperationRequest(operationData);
      const response = await this.client.depositsPOST2(walletId, request);
      return {
        success: true,
        data: response.data,
        message: "Depósito realizado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível realizar o depósito"
      };
    }
  }

  // Método para sacar fundos de uma carteira
  async withdrawals(walletId, operationData) {
    try {
      const request = new FundsOperationRequest(operationData);
      const response = await this.client.withdrawals(walletId, request);
      return {
        success: true,
        data: response.data,
        message: "Saque realizado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível realizar o saque"
      };
    }
  }

  // Método para transferir fundos entre carteiras
  async transfer(sourceWalletId, destinationWalletId, operationData) {
    try {
      const request = new FundsOperationRequest(operationData);
      const response = await this.client.transfer(sourceWalletId, destinationWalletId, request);
      return {
        success: true,
        data: response.data,
        message: "Transferência realizada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível realizar a transferência"
      };
    }
  }

  // Método para obter transações de uma carteira
  async transactions(walletId, startDate, endDate, page = 1, pageSize = 20) {
    try {
      const response = await this.client.transactions(walletId, startDate, endDate, page, pageSize);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter as transações"
      };
    }
  }

  // Método para criar uma nova transação
  async walletTransactionsPOST(transactionData) {
    try {
      const request = new CreateTransactionRequest(transactionData);
      await this.client.walletTransactionsPOST(request);
      return {
        success: true,
        message: "Transação criada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar a transação"
      };
    }
  }

  // Método para obter uma transação específica
  async walletTransactionsGET(transactionId) {
    try {
      const response = await this.client.walletTransactionsGET(transactionId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter a transação"
      };
    }
  }

  // Método para obter o saldo das transações
  async balanceGET2(walletId) {
    try {
      const response = await this.client.balanceGET2(walletId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter o saldo das transações"
      };
    }
  }

  // Método para obter o histórico de transações
  async history(walletId, startDate, endDate, status, type, page, pageSize) {
    try {
      const response = await this.client.history(walletId, startDate, endDate, status, type, page, pageSize);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter o histórico de transações"
      };
    }
  }

  // Método para atualizar o status de uma transação
  async status(transactionId, statusData) {
    try {
      const request = new UpdateTransactionStatusRequest(statusData);
      await this.client.status(transactionId, request);
      return {
        success: true,
        message: "Status da transação atualizado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar o status da transação"
      };
    }
  }

  // --------- DASHBOARD E ADMINISTRAÇÃO ---------

  // Obter resumo do dashboard administrativo
  async getDashboardSummary() {
    try {
      const response = await this.client.summary();
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter o resumo do dashboard"
      };
    }
  }

  // Verificar status do sistema
  async checkStatus() {
    try {
      const response = await this.client.checkStatus();
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível verificar o status do sistema"
      };
    }
  }

  // Obter transações pendentes (admin)
  async getPendingTransactions(page = 1, pageSize = 20) {
    try {
      const response = await this.client.pending(page, pageSize);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter as transações pendentes"
      };
    }
  }

  // Aprovar transação pendente
  async approveTransaction(transactionId) {
    try {
      const response = await this.client.approve(transactionId);
      return {
        success: true,
        data: response.data,
        message: "Transação aprovada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível aprovar a transação"
      };
    }
  }

  // Rejeitar transação pendente
  async rejectTransaction(transactionId, reason) {
    try {
      const response = await this.client.reject(transactionId, reason);
      return {
        success: true,
        data: response.data,
        message: "Transação rejeitada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar a transação"
      };
    }
  }

  // --------- GERENCIAMENTO DE CONTAS BANCÁRIAS ---------

  // Obter contas bancárias não verificadas (admin)
  async getUnverifiedBankAccounts(page = 1, pageSize = 20) {
    try {
      const response = await this.client.unverified(page, pageSize);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter as contas bancárias não verificadas"
      };
    }
  }

  // Verificar uma conta bancária como administrador
  async verifyBankAccountAdmin(id) {
    try {
      const response = await this.client.verify(id);
      return {
        success: true,
        data: response.data,
        message: "Conta bancária verificada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível verificar a conta bancária"
      };
    }
  }

  // Rejeitar uma conta bancária como administrador
  async rejectBankAccount(id, reason) {
    try {
      const response = await this.client.reject2(id, reason);
      return {
        success: true,
        data: response.data,
        message: "Conta bancária rejeitada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar a conta bancária"
      };
    }
  }

  // --------- GERENCIAMENTO DE PIX ---------

  // Validar chave PIX
  async validatePixKey(pixKey, pixKeyType) {
    try {
      const request = new PixValidationRequestDto({
        pixKey: pixKey,
        pixKeyType: pixKeyType
      });
      const response = await this.client.validate2(request);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível validar a chave PIX"
      };
    }
  }

  // Criar um pagamento PIX
  async createPayment(paymentData) {
    try {
      const request = new CustomerPayoutCreateDto(paymentData);
      const response = await this.client.payment(request);
      return {
        success: true,
        data: response.data,
        message: "Pagamento criado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar o pagamento"
      };
    }
  }

  // Obter detalhes de um pagamento PIX
  async getPayment(paymentId) {
    try {
      const response = await this.client.customerPayouts(paymentId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os detalhes do pagamento"
      };
    }
  }

  // Obter pagamentos PIX pendentes (admin)
  async getPendingPixPayments(page = 1, pageSize = 20) {
    try {
      const response = await this.client.pending3(page, pageSize);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os pagamentos PIX pendentes"
      };
    }
  }

  // Confirmar um pagamento PIX
  async confirmPixPayment(payoutId, paymentProofId) {
    try {
      const request = new PayoutConfirmationDto({
        paymentProofId: paymentProofId
      });
      const response = await this.client.confirm2(payoutId, request);
      return {
        success: true,
        data: response.data,
        message: "Pagamento PIX confirmado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível confirmar o pagamento PIX"
      };
    }
  }

  // Rejeitar um pagamento PIX
  async rejectPixPayment(payoutId, reason) {
    try {
      const request = new PayoutRejectionDto({
        rejectionReason: reason
      });
      const response = await this.client.reject4(payoutId, request);
      return {
        success: true,
        data: response.data,
        message: "Pagamento PIX rejeitado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar o pagamento PIX"
      };
    }
  }

  // Confirmar um pagamento PIX com comprovante
  async confirmPayoutWithProof(payoutId, value, proofReference, notes) {
    try {
      const request = new PayoutConfirmationWithProofDto({
        value: value,
        proofReference: proofReference,
        notes: notes
      });
      const response = await this.client.confirm(payoutId, request);
      return {
        success: true,
        data: response.data,
        message: "Pagamento confirmado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível confirmar o pagamento"
      };
    }
  }

  // Rejeitar um pagamento
  async rejectPayout(payoutId, rejectionReason) {
    try {
      const response = await this.client.reject3(payoutId, rejectionReason);
      return {
        success: true,
        data: response.data,
        message: "Pagamento rejeitado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar o pagamento"
      };
    }
  }

  // Obter pagamentos pendentes de administrador
  async getPendingAdminPayouts(page = 1, pageSize = 20) {
    try {
      const response = await this.client.pending2(page, pageSize);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os pagamentos pendentes"
      };
    }
  }

  // --------- GERENCIAMENTO DE DEPÓSITOS ---------

  // Criar um novo depósito
  async createDeposit(depositData) {
    try {
      const request = new DepositRequestDto(depositData);
      const response = await this.client.depositsPOST(request);
      return {
        success: true,
        data: response.data,
        message: "Depósito criado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar o depósito"
      };
    }
  }

  // Obter detalhes de um depósito
  async getDeposit(depositId) {
    try {
      const response = await this.client.depositsGET(depositId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os detalhes do depósito"
      };
    }
  }

  // Obter depósitos de um vendedor
  async getSellerDeposits(sellerId, page = 1, pageSize = 20) {
    try {
      const response = await this.client.seller(sellerId, page, pageSize);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os depósitos do vendedor"
      };
    }
  }

  // Processar um callback de pagamento
  async processPaymentCallback(callbackData) {
    try {
      const request = new PaymentCallbackDto(callbackData);
      await this.client.callback(request);
      return {
        success: true,
        message: "Callback de pagamento processado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível processar o callback de pagamento"
      };
    }
  }

  // --------- GERENCIAMENTO DE SAQUES ---------

  // Criar um novo saque
  async createWithdraw(withdrawData) {
    try {
      const request = new WithdrawRequestDto(withdrawData);
      const response = await this.client.withdrawsPOST(request);
      return {
        success: true,
        data: response.data,
        message: "Solicitação de saque criada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar a solicitação de saque"
      };
    }
  }

  // Obter detalhes de um saque
  async getWithdraw(withdrawId) {
    try {
      const response = await this.client.withdrawsGET(withdrawId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os detalhes do saque"
      };
    }
  }

  // Obter saques de um vendedor
  async getSellerWithdraws(sellerId, page = 1, pageSize = 20) {
    try {
      const response = await this.client.seller3(sellerId, page, pageSize);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os saques do vendedor"
      };
    }
  }

  // Obter saques pendentes (admin)
  async getPendingWithdraws(page = 1, pageSize = 20) {
    try {
      const response = await this.client.pending4(page, pageSize);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os saques pendentes"
      };
    }
  }

  // Aprovar um saque
  async approveWithdraw(withdrawId) {
    try {
      const response = await this.client.approve2(withdrawId);
      return {
        success: true,
        data: response.data,
        message: "Saque aprovado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível aprovar o saque"
      };
    }
  }

  // Rejeitar um saque
  async rejectWithdraw(withdrawId, reason) {
    try {
      const response = await this.client.reject5(withdrawId, reason);
      return {
        success: true,
        data: response.data,
        message: "Saque rejeitado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível rejeitar o saque"
      };
    }
  }

  // Processar um saque
  async processWithdraw(withdrawId, receipt) {
    try {
      const response = await this.client.process(withdrawId, receipt);
      return {
        success: true,
        data: response.data,
        message: "Saque processado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível processar o saque"
      };
    }
  }

  // --------- MÉTODOS ADICIONAIS DE CARTEIRA ---------

  // Obter todas as carteiras (admin)
  async getAllWallets(page = 1, pageSize = 20) {
    try {
      const response = await this.client.all(page, pageSize);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter todas as carteiras"
      };
    }
  }

  // Atualizar o saldo de uma carteira (admin)
  async updateWalletBalanceAdmin(walletId, balanceData) {
    try {
      const dto = new WalletUpdateDto(balanceData);
      const response = await this.client.balancePUT2(walletId, dto);
      return {
        success: true,
        data: response.data,
        message: "Saldo da carteira atualizado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar o saldo da carteira"
      };
    }
  }
}

export const paymentService = new PaymentService();