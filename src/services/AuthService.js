import {
  Client as AuthClient,
  RegisterDto,
  LoginDto,
  SellerDto,
  UpdateConfigurationDto,
  ApiConfigUpdateDto,
  CommerceCreateDto,
  CommerceUpdateDto,
  CommerceCallbackUpdateDto,
} from "./PulseAuthApiService";
import { setupInterceptors } from "../interceptor/apiInterceptor";

class AuthService {
  constructor() {
    this.authClient = new AuthClient("http://localhost:8081");
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
    setupInterceptors(this.authClient.instance, logoutCallback);
  }

  setAuthorizationHeader(token) {
    if (token) {
      this.authClient.instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete this.authClient.instance.defaults.headers.common["Authorization"];
    }
  }

  async register(dto) {
    const registerDto = new RegisterDto({
      username: dto.name,
      email: dto.email,
      password: dto.password,
      document: dto.document,
      phoneNumber: dto.phone,
      documentType: dto.documentType,
      nationality: dto.nationality || null,
      isForeigner: dto.isForeigner || false
    });
  
    try {
      await this.authClient.register(registerDto);
      return { success: true, message: "Registration successful" };
    } catch (error) {
      return {
        success: false,
        message: `Registration failed: ${error.message}`,
      };
    }
  }

  async login(email, password) {
    const loginDto = new LoginDto({
      email,
      password,
    });

    try {
      const response = await this.authClient.login(loginDto);
      return {
        success: true,
        data: {
          user: {
            name: response.user.name,
            email: response.user.email,
            phoneNumber: response.user.phoneNumber,
          },
          token: response.accessToken,
          expiresIn: response.expiresIn
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, ""),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Não foi possível realizar login, usuário ou senha incorretos`,
      };
    }
  }

  async getConfiguration() {
    try {
      const response = await this.authClient.configurationGET();
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter as configurações",
      };
    }
  }

  async updateConfiguration(apiEndpoint) {
    try {
      const updateDto = new UpdateConfigurationDto({
        apiConfig: new ApiConfigUpdateDto({
          apiEndpoint,
        }),
      });

      const response = await this.authClient.configurationPUT(updateDto);
      return {
        success: true,
        data: response,
        message: "Configurações atualizadas com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar as configurações",
      };
    }
  }

  async createConfiguration(apiEndpoint) {
    try {
      const updateDto = new UpdateConfigurationDto({
        apiConfig: new ApiConfigUpdateDto({
          apiEndpoint,
        }),
      });

      const response = await this.authClient.configurationPOST(updateDto);
      return {
        success: true,
        data: response,
        message: "Configurações criadas com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar as configurações",
      };
    }
  }

  async getSellerCommerces(sellerId) {
    try {
      const response = await this.authClient.sellerAll(sellerId);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os comércios",
      };
    }
  }

  async getSellerWithCommerces(sellerId) {
    try {
      const response = await this.authClient.withCommerces(sellerId);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter o seller com seus comércios",
      };
    }
  }

  async getCommerceById(commerceId) {
    try {
      const response = await this.authClient.commerceGET(commerceId);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter o seller com seus comércios",
      };
    }
  }

  async createCommerce(sellerId, name, url) {
    try {
      const createDto = new CommerceCreateDto({
        name,
        url,
      });

      const response = await this.authClient.commercePOST(sellerId, createDto);
      return {
        success: true,
        data: response,
        message: "Comércio criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar o comércio",
      };
    }
  }

  async updateCommerce(commerceId, name, url) {
    try {
      const updateDto = new CommerceUpdateDto({
        name,
        url,
      });

      const response = await this.authClient.commercePUT(commerceId, updateDto);
      return {
        success: true,
        data: response,
        message: "Comércio atualizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar o comércio",
      };
    }
  }

  async deleteCommerce(commerceId) {
    try {
      await this.authClient.commerceDELETE(commerceId);
      return {
        success: true,
        message: "Comércio excluído com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível excluir o comércio",
      };
    }
  }

  async updateCommerceCallbacks(commerceId, callbacks) {
    try {
      const updateDto = new CommerceCallbackUpdateDto({
        credit: callbacks.credit,
        debit: callbacks.debit,
        boleto: callbacks.boleto,
        webhook: callbacks.webhook,
        securityKey: callbacks.securityKey,
      });

      const response = await this.authClient.callback(commerceId, updateDto);
      return {
        success: true,
        data: response,
        message: "Callbacks atualizados com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar os callbacks",
      };
    }
  }

  async getAvailableSellers() {
    try {
      const response = await this.authClient.available();
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Não foi possível obter os sellers disponíveis",
      };
    }
  }

  async createSeller(name, description) {
    try {
      const sellerDto = {
        name,
        description,
      };
      const response = await this.authClient.sellerPOST(sellerDto);
      return {
        success: true,
        data: response,
        message: "Seller criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível criar o seller",
      };
    }
  }

  async updateSeller(sellerId, name, description) {
    try {
      const sellerDto = {
        id: sellerId,
        name,
        description,
      };

      const response = await this.authClient.sellerPUT(sellerId, sellerDto);
      return {
        success: true,
        data: response,
        message: "Seller atualizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar o seller",
      };
    }
  }

  async deleteSeller(sellerId) {
    try {
      await this.authClient.sellerDELETE(sellerId);
      return {
        success: true,
        message: "Seller excluído com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível excluir o seller",
      };
    }
  }

  // Novas rotas adicionadas a partir daqui
  
  // Rotas administrativas
  async getUsers(page = 1, pageSize = 10) {
    try {
      const response = await this.authClient.users(page, pageSize);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter a lista de usuários"
      };
    }
  }

  async getUserById(userId) {
    try {
      const response = await this.authClient.users2(userId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os dados do usuário"
      };
    }
  }

  async updateUserRoles(userId, roles) {
    try {
      await this.authClient.roles(userId, roles);
      return {
        success: true,
        message: "Roles do usuário atualizadas com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atualizar as roles do usuário"
      };
    }
  }

  async lockUser(userId) {
    try {
      await this.authClient.lock(userId);
      return {
        success: true,
        message: "Usuário bloqueado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível bloquear o usuário"
      };
    }
  }

  async unlockUser(userId) {
    try {
      await this.authClient.unlock(userId);
      return {
        success: true,
        message: "Usuário desbloqueado com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível desbloquear o usuário"
      };
    }
  }

  async assignAdmin(email) {
    try {
      await this.authClient.assignAdmin(email);
      return {
        success: true,
        message: "Permissões de administrador atribuídas com sucesso"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível atribuir permissões de administrador"
      };
    }
  }

  async checkAdmin() {
    try {
      await this.authClient.checkAdmin();
      return {
        success: true,
        isAdmin: true
      };
    } catch (error) {
      return {
        success: false,
        isAdmin: false,
        message: error.message || "Falha ao verificar permissões de administrador"
      };
    }
  }

  async getSellerById(sellerId) {
    try {
      const response = await this.authClient.sellerGET(sellerId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Não foi possível obter os dados do seller"
      };
    }
  }
}

export const authService = new AuthService();