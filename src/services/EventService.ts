import api from "./api";

const API_URL = "/event-types";

class EventTypeService {
  /**
   * Lista todos os eventos ativos no sistema.
   */
  async getAll() {
    const response = await api.get(API_URL);
    return response.data;
  }

  /**
   * Busca um evento específico pelo ID.
   */
  async getById(id: number | string) {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  }

  /**
   * Cria um novo evento.
   */
  async create(payload: any) {
    const response = await api.post(API_URL, payload);
    return response.data;
  }

  /**
   * Atualiza um evento.
   */
  async update(id: number | string, payload: any) {
    const response = await api.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  /**
   * Busca de um evento por tags.
   */
  async findByTags(tags: string[]) {
    const params = new URLSearchParams();
    tags.forEach((tag) => params.append("tags", tag));
    const response = await api.get(`${API_URL}/by-tags`, { params });
    return response.data;
  }

  /**
   * Remove um evento.
   */
  async delete(id: number | string) {
    await api.delete(`${API_URL}/${id}`);
  }
}

const eventTypeService = new EventTypeService();
export default eventTypeService;
