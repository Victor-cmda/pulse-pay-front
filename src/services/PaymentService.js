import {
  Client,
  BankAccountCreateDto,
  BankAccountUpdateDto,
  CreateTransactionRequest,
  WalletCreateDto,
  WalletUpdateDto,
  WithdrawCreateDto,
  WithdrawUpdateDto,
  UpdateTransactionStatusRequest
} from "./PulsePayApiService";
import { setupInterceptors } from "../interceptor/apiInterceptor";

class PaymentService {
  constructor() {
    this.client = new Client("http://localhost:5232");
    this.setAuthorizationHeader = this.setAuthorizationHeader.bind(this);
    this._logoutCallback = () => console.warn("Logout callback não configurado");
    this.initializeInterceptors(this._logoutCallback);
  }

  setLogoutCallback(logoutCallback) {
    if (typeof logoutCallback === 'function') {
      this._logoutCallback = logoutCallback;
      // Reinicialize os interceptors com o novo callback
      this.initializeInterceptors(this._logoutCallback);
    }
  }

  initializeInterceptors(logoutCallback) {
    console.log("Inicializando interceptors...");
    setupInterceptors(this.client.instance, logoutCallback); // ERRO: authClient não existe
    console.log("Interceptors inicializados!");
  }

  setAuthorizationHeader(token) {
    if (token) {
      this.client.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.client.instance.defaults.headers.common["Authorization"];
    }
  }

  async getBankAccount(id) {
    try {
      const response = await this.client.bankGET(id);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar a conta bancária"
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
        message: "Conta bancária atualizada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar a conta bancária"
      };
    }
  }

  async deleteBankAccount(id) {
    try {
      await this.client.bankDELETE(id);
      return {
        success: true,
        message: "Conta bancária excluída com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível excluir a conta bancária"
      };
    }
  }

  async getSellerBankAccounts(sellerId) {
    try {
      const response = await this.client.sellerAll(sellerId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar as contas bancárias do vendedor"
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
        message: "Conta bancária criada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar a conta bancária"
      };
    }
  }

  async verifyBankAccount(id) {
    try {
      await this.client.verify(id);
      return {
        success: true,
        message: "Conta bancária verificada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível verificar a conta bancária"
      };
    }
  }

  async validateBankAccount(accountData) {
    try {
      const dto = new BankAccountCreateDto(accountData);
      const response = await this.client.validate(dto);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível validar a conta bancária"
      };
    }
  }

  // --------- WALLET OPERATIONS ---------

  async getWallet(sellerId) {
    try {
      const response = await this.client.walletGET(sellerId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar a carteira"
      };
    }
  }

  async createWallet(sellerId) {
    try {
      const dto = new WalletCreateDto({ sellerId });
      await this.client.walletPOST(dto);
      return {
        success: true,
        message: "Carteira criada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar a carteira"
      };
    }
  }

  async updateWalletBalance(sellerId, availableBalance, pendingBalance) {
    try {
      const dto = new WalletUpdateDto({
        availableBalance,
        pendingBalance
      });
      await this.client.balancePUT(sellerId, dto);
      return {
        success: true,
        message: "Saldo da carteira atualizado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar o saldo da carteira"
      };
    }
  }

  async addFunds(sellerId, amount) {
    try {
      await this.client.addFunds(sellerId, amount);
      return {
        success: true,
        message: "Fundos adicionados com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível adicionar fundos"
      };
    }
  }

  async deductFunds(sellerId, amount) {
    try {
      await this.client.deductFunds(sellerId, amount);
      return {
        success: true,
        message: "Fundos deduzidos com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível deduzir fundos"
      };
    }
  }

  // --------- TRANSACTION OPERATIONS ---------

  async createTransaction(transactionData) {
    try {
      const request = new CreateTransactionRequest(transactionData);
      await this.client.walletTransactionPOST(request);
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

  async getTransaction(transactionId) {
    try {
      const response = await this.client.walletTransactionGET(transactionId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar a transação"
      };
    }
  }

  async getWalletBalance(walletId) {
    try {
      const response = await this.client.balanceGET(walletId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar o saldo da carteira"
      };
    }
  }

  async getTransactionHistory(walletId, startDate, endDate, status, type, page, pageSize) {
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
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar o histórico de transações"
      };
    }
  }

  async updateTransactionStatus(transactionId, status, reason) {
    try {
      const updateRequest = new UpdateTransactionStatusRequest({
        status,
        reason
      });
      await this.client.status(transactionId, updateRequest);
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

  // --------- WITHDRAW OPERATIONS ---------

  async createWithdraw(withdrawData) {
    try {
      const dto = new WithdrawCreateDto(withdrawData);
      await this.client.withdrawPOST(dto);
      return {
        success: true,
        message: "Solicitação de saque criada com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar a solicitação de saque"
      };
    }
  }

  async getWithdraw(id) {
    try {
      const response = await this.client.withdrawGET(id);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar o saque"
      };
    }
  }

  async getSellerWithdraws(sellerId, page, pageSize) {
    try {
      const response = await this.client.seller(sellerId, page, pageSize);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar os saques do vendedor"
      };
    }
  }

  async processWithdraw(id, status, failureReason, transactionReceipt) {
    try {
      const updateDto = new WithdrawUpdateDto({
        status,
        failureReason,
        transactionReceipt
      });
      await this.client.process(id, updateDto);
      return {
        success: true,
        message: "Saque processado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível processar o saque"
      };
    }
  }

  async getWithdrawSummary(sellerId, startDate, endDate) {
    try {
      const response = await this.client.summary(sellerId, startDate, endDate);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar o resumo de saques"
      };
    }
  }

  async getPendingWithdraws() {
    try {
      const response = await this.client.pending();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar os saques pendentes"
      };
    }
  }
}

export const paymentService = new PaymentService();