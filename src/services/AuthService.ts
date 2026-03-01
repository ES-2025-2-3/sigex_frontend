import api from '../services/api'; 
import { AuthenticatedUserResponse } from '../types/auth/AuthenticatedUserResponseType';

const API_URL = '/auth';

class AuthService {
  /**
   * Realiza a tentativa de login enviando LoginRequestDTO.
   */
  async login(credentials: any): Promise<AuthenticatedUserResponse> {
    const response = await api.post<AuthenticatedUserResponse>(`${API_URL}/login`, credentials);
    return response.data;
  }

  /**
   * Registra um novo usuário enviando RegisterRequestDTO.
   */
  async register(registrationData: any): Promise<AuthenticatedUserResponse> {
    const response = await api.post<AuthenticatedUserResponse>(`${API_URL}/register`, registrationData);
    return response.data;
  }

  /**
   * Solicita o link de recuperação de senha.
   */
  async forgotPassword(email: string): Promise<void> {
    return api.post(`${API_URL}/forgot-password`, { email });
  }

  /**
   * Redefine a senha utilizando o token recebido por e-mail.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post(`${API_URL}/reset-password`, { token, newPassword });
  }
}

export default new AuthService();