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
      const response = await this.client.seller(sellerId);
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
      const response = await this.client.deposits(walletId, request);
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
}

export const paymentService = new PaymentService();