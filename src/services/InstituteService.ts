import axios from 'axios';
import InstituteDomain from '../domain/institute/InstituteDomain';

const API_URL = '/api/institutes';

class InstituteService {
  /**
   * Busca todos os institutos cadastrados no sistema.
   */
  async getAllInstitutes() {
    const response = await axios.get(API_URL);
    return response.data; 
  }

  /**
   * Busca um instituto específico pelo ID.
   */
  async getById(id: string) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  /**
   * Cria um novo instituto no banco.
   */
  async create(domain: InstituteDomain) {
    const payload = domain.getBackendObject();
    const response = await axios.post(API_URL, payload);
    return response.data;
  }

  /**
   * Atualiza um instituto existente.
   */
  async update(id: string, domain: InstituteDomain) {
    const payload = domain.getBackendObject();
    const response = await axios.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  /**
   * Deleta um instituto.
   */
  async delete(id: string) {
    await axios.delete(`${API_URL}/${id}`);
  }
}

export default new InstituteService();