import exp from "constants";
import {
  Client as AuthClient,
  RegisterDto,
  LoginDto,
  SellerDto,
} from "./PulseAuthApiService";

class AuthService {
  constructor() {
    this.authClient = new AuthClient("http://localhost:8081");
  }

  async register(dto) {
    const registerDto = new RegisterDto({
      username: dto.name,
      email: dto.email,
      password: dto.password,
      document: dto.document,
      phoneNumber: dto.phone,
      documentType: dto.documentType,
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

  async postSeller(name, description) {
    const sellerDto = new SellerDto({
      name,
      description,
    });

    try {
      const response = await this.authClient.seller(sellerDto);
      return { success: true, message: "Comércio criado com sucesso" };
    } catch (error) {
      return {
        success: false,
        message: `Não foi possível criar seu novo comércio`,
      };
    }
  }

  async getSellers(name, description) {
    const sellerDto = new SellerDto({
      name,
      description,
    });

    try {
      const response = await this.authClient.seller(sellerDto);
      return { success: true, message: "Comércio criado com sucesso" };
    } catch (error) {
      return {
        success: false,
        message: `Não foi possível criar seu novo comércio`,
      };
    }
  }
}

export const authService = new AuthService();
