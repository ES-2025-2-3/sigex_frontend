import api from "./api";
import RoomDomain from "../domain/space/SpaceDomain";

const API_URL = "/rooms";

class SpaceService {
  /**
   * Busca todos os espaços.
   */
  async getAll() {
    const response = await api.get(API_URL);
    return response.data;
  }

  /**
   * Busca por ID.
   */
  async getById(id: number | string) {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  }

  /**
   * Cria a sala vinculada ao ID do instituto único.
   */
  async create(domain: RoomDomain) {
    const payload = {
      name: domain.name,
      capacity: domain.capacity,
      description: domain.description,
      instituteId: domain.instituteId,
    };
    const response = await api.post(API_URL, payload);
    return response.data;
  }

  /**
   * Atualiza a sala.
   */
  async update(id: string | number, domain: RoomDomain) {
    const payload = {
      name: domain.name,
      capacity: domain.capacity,
      description: domain.description,
      instituteId: domain.instituteId,
    };
    const response = await api.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  async delete(id: string | number) {
    await api.delete(`${API_URL}/${id}`);
  }
}

export default new SpaceService();
