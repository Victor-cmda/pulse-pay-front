import axios from "axios";
import { Client as PulseAuthClient } from "./PulseAuthApiService";
import { Client as PulsePayClient } from "./PulsePayApiService";
import { LoginDto, SellerResponseDto } from "./PulseAuthApiService"; // Importando o tipo LoginDto
import Cookies from "js-cookie";

class PulseService {
  constructor(authBaseUrl, payBaseUrl) {
    this.authClient = new PulseAuthClient("http://localhost:8081");
    this.payClient = new PulsePayClient("http://localhost:5232");

    const token = Cookies.get("accessToken");
    const paymentToken = Cookies.get("paymentToken");
    
    if (token) this.setBearerToken(token);
    if (paymentToken) this.setPaymentToken(paymentToken);
  }

  setBearerToken(token) {
    this.authClient.instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  setPaymentToken(paymentToken) {
    this.payClient.instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${paymentToken}`;
  }

  setBasicAuth() {
    const clientId = Cookies.get("clientId");
    const clientSecret = Cookies.get("clientSecret");
    const basicAuth = "Basic " + btoa(`${clientId}:${clientSecret}`);
    this.authClient.instance.defaults.headers.common["Authorization"] =
      basicAuth;
  }

  async register(userData) {
    try {
      await this.authClient.register(userData);
      return {
        success: true,
        message: "Registro bem-sucedido",
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro no registro",
      };
    }
  }

  async login(email, password) {
    try {
      const loginData = new LoginDto({ email, password });
      const response = await this.authClient.login(loginData);

      if (response && response.accessToken) {
        this.setBearerToken(response.accessToken);
        Cookies.set("accessToken", response.accessToken, { expires: 1 });
        await this.getConfigByUser();
        return {
          success: true,
          message: "Login bem-sucedido",
          accessToken: response.accessToken,
        };
      } else {
        return {
          success: false,
          message: "Resposta inválida do servidor",
        };
      }
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro desconhecido",
      };
    }
  }

  async generateToken() {
    try {
      this.setBasicAuth(); 
      const response = await this.authClient.generateToken();
      this.setPaymentToken(response.accessToken);
      Cookies.set("paymentToken", response.accessToken, { expires: 1 });
      delete this.authClient.instance.defaults.headers.common["Authorization"];
      return {
        success: true,
        message: "Token gerado com sucesso",
        accessToken: response.accessToken,
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro ao gerar token",
      };
    }
  }

  async getSellersByUserId() {
    try {
      const response = await this.authClient.getSellersByUserId();
      const listIdSellers = response.map((seller) => seller.id);
      return {
        success: true,
        message: "Dados dos vendedores obtidos com sucesso",
        data: response,
        listIdSellers: listIdSellers
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro ao obter dados dos vendedores",
      };
    }
  }

  async postSeller(sellerData) {
    try {
      const response = await this.authClient.postSeller(sellerData);
      return {
        success: true,
        message: "Vendedor cadastrado com sucesso",
        data: response,
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro ao cadastrar vendedor",
      };
    }
  }

  async getConfigByUser() {
    try {
      const token = Cookies.get("accessToken");
      if (token) this.setBearerToken(token);
      const response = await this.authClient.getConfigByUser();
      Cookies.set("clientId", response.clientId, { expires: 1 });
      Cookies.set("clientSecret", response.clientSecret, { expires: 1 });
      return {
        success: true,
        message: "Configuração do usuário obtida com sucesso",
        data: response,
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro ao obter configuração do usuário",
      };
    }
  }

  async getDashboard() {
    try {
      const sellers = await this.getSellersByUserId();
      await this.generateToken();
      const response = await this.payClient.dashboard(sellers.listIdSellers);
      return {
        success: true,
        message: "Dados do dashboard obtidos com sucesso",
        data: response,
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro ao obter dados do dashboard",
      };
    }
  }

  async createPixPayment(paymentData) {
    try {
      await this.payClient.pix(paymentData);
      return {
        success: true,
        message: "Pagamento PIX criado com sucesso",
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro ao criar pagamento PIX",
      };
    }
  }

  async createBoletoPayment(paymentData) {
    try {
      await this.payClient.boleto(paymentData);
      return {
        success: true,
        message: "Pagamento por boleto criado com sucesso",
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro ao criar pagamento por boleto",
      };
    }
  }

  async createCreditCardPayment(paymentData) {
    try {
      await this.payClient.credit(paymentData);
      return {
        success: true,
        message: "Pagamento com cartão de crédito criado com sucesso",
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message:
          error.message || "Erro ao criar pagamento com cartão de crédito",
      };
    }
  }

  async getPdf(id) {
    try {
      await this.payClient.pdf(id);
      return {
        success: true,
        message: "PDF obtido com sucesso",
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: error.message || "Erro ao obter PDF",
      };
    }
  }

  handleError(error) {
    if (error.response) {
      console.error("API error:", error.response);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

export default new PulseService();
