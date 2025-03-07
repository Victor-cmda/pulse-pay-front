import {
  Client,
  BankAccountCreateDto,
  BankAccountUpdateDto,
  CreateTransactionRequest,
  WalletCreateDto,
  WalletUpdateDto,
  UpdateTransactionStatusRequest,
  FundsOperationRequest
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
      this.initializeInterceptors(this._logoutCallback);
    }
  }

  initializeInterceptors(logoutCallback) {
    setupInterceptors(this.client.instance, logoutCallback);
  }

  setAuthorizationHeader(token) {
    if (token) {
      this.client.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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

  async deleteBankAccount(id, sellerId) {
    try {
      await this.client.bankDELETE(id, sellerId);
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
      const response = await this.client.seller(sellerId);
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
      const response = await this.client.walletsGET(sellerId);
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

  async getWalletWithTransactions(sellerId, count) {
    try {
      const response = await this.client.withTransactions(sellerId, count);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível recuperar a carteira com transações"
      };
    }
  }

  async createWallet(sellerId) {
    try {
      const dto = new WalletCreateDto({ sellerId });
      await this.client.walletsPOST(dto);
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

  async addFunds(sellerId, amount, description, reference) {
    try {
      const request = new FundsOperationRequest({
        amount,
        description,
        reference
      });
      await this.client.deposits(sellerId, request);
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

  async deductFunds(sellerId, amount, description, reference) {
    try {
      const request = new FundsOperationRequest({
        amount,
        description,
        reference
      });
      await this.client.withdrawals(sellerId, request);
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

  async getWalletTransactions(sellerId, startDate, endDate, page, pageSize) {
    try {
      const response = await this.client.transactions(
        sellerId,
        startDate,
        endDate,
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
        message: error.message || "Não foi possível recuperar as transações da carteira"
      };
    }
  }

  // --------- TRANSACTION OPERATIONS ---------

  async createTransaction(transactionData) {
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

  async getTransaction(transactionId) {
    try {
      const response = await this.client.walletTransactionsGET(transactionId);
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
}

export const paymentService = new PaymentService();