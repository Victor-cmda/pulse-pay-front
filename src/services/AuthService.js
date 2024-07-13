import {
  Client as AuthClient,
  RegisterDto,
  LoginDto,
} from "./PulseAuthApiService";

class AuthService {
  constructor() {
    this.authClient = new AuthClient("http://localhost:8081");
  }

  async register(username, email, password) {
    const registerDto = new RegisterDto({
      username,
      email,
      password,
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
      await this.authClient.login(loginDto);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: `Não foi possível realizar login, usuário ou senha incorretos`,
      };
    }
  }
}

export const authService = new AuthService();
