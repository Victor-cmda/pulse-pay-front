import Cookies from "js-cookie";
import { Client as AuthClient, LoginDto } from "./PulseAuthApiService";
import { Client as PaymentClient } from "./PulsePayApiService";

class AuthService {
  constructor() {
    this.authClient = new AuthClient("https://localhost:8081");
    this.paymentClient = new PaymentClient("https://localhost:5232");
  }

  async login(email, password) {
    const loginDto = new LoginDto({ email, password });

    try {
      const response = await this.authClient.login(loginDto);
      const token = response.accessToken;
      if (token) {
        Cookies.set("authToken", token, { expires: 1 });
        return { success: true, token };
      }
      return { success: false, message: "Login failed, no token returned" };
    } catch (error) {
      return {
        success: false,
        message: "Não foi possível realizar login, usuário ou senha incorretos",
      };
    }
  }

  async getPaymentToken() {
    try {
      const response = await this.authClient.token();
      return response.accessToken;
    } catch (error) {
      throw new Error("Failed to obtain payment token");
    }
  }

  async getUserConfig() {
    const authToken = Cookies.get("authToken");
    debugger;
    if (!authToken) {
      throw new Error("Missing authentication token");
    }
    try {
      const response = await this.authClient.config({
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response;
    } catch (error) {
      debugger;
      throw new Error("Failed to fetch user config");
    }
  }

  async getDashboardData(sellers) {
    const paymentToken = await this.getPaymentToken();

    if (!paymentToken) {
      throw new Error("Missing authentication tokens");
    }

    try {
      const response = await this.paymentClient.dashboard(sellers, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-Payment-Token": paymentToken,
        },
      });
      return response;
    } catch (error) {
      throw new Error("Failed to fetch dashboard data");
    }
  }
}

export default new AuthService();
