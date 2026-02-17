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
}

export default new AuthService();