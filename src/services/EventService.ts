import axios from 'axios';
import EventDomain from '../domain/event/EventDomain';

const API_URL = '/event-types';

class EventTypeService {
  /**
   * Lista todos os tipos de eventos ativos no sistema.
   */
  async getAll() {
    const response = await axios.get(API_URL);
    return response.data;
  }

  /**
   * Busca um tipo de evento específico pelo ID.
   */
  async getById(id: string) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  /**
   * Cria uma nova categoria de evento (Ação do Admin/Funcionário).
   */
  async create(domain: EventDomain) {
    const payload = domain.getBackendObject();
    const response = await axios.post(API_URL, payload);
    return response.data;
  }

  /**
   * Atualiza nome ou descrição de uma categoria.
   */
  async update(id: string, domain: EventDomain) {
    const payload = domain.getBackendObject();
    const response = await axios.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  /**
   * Desativa uma categoria sem excluí-la.
   */
  async disable(id: string) {
    const response = await axios.patch(`${API_URL}/${id}/disable`);
    return response.data;
  }

  /**
   * Remove permanentemente uma categoria.
   */
  async delete(id: string) {
    await axios.delete(`${API_URL}/${id}`);
  }
}

export default new EventTypeService();