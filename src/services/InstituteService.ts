import api from './api';
import InstituteDomain from '../domain/institute/InstituteDomain';

const API_URL = '/institutes';

class InstituteService {

  /**
   * Busca o UUID do instituto único do sistema
   */
  async getGlobalId(): Promise<string> {
    const response = await api.get(`${API_URL}/global-id`);
    return response.data;
  }

  /**
   * Busca por ID.
   */
  async getById(id: string) {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  }

  /**
   * Cria o instituto.
   */
  async create(domain: InstituteDomain) {
    const payload = domain.getBackendObject();
    const response = await api.post(API_URL, payload);
    return response.data;
  }

  /**
   * Atualiza o instituto.
   */
  async update(id: string, domain: InstituteDomain) {
    const payload = domain.getBackendObject();
    const response = await api.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  async delete(id: string) {
    await api.delete(`${API_URL}/${id}`);
  }
}

export default new InstituteService();