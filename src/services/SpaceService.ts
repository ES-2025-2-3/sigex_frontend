import axios from 'axios';
import RoomDomain from '../domain/space/SpaceDomain';

const API_URL = '/api/rooms';

class SpaceService {
  /**
   * Busca todos os locais (rooms) cadastrados no sistema.
   * No backend, o RoomController já possui o endpoint GET.
   */
  async getAllRooms() {
    const response = await axios.get(API_URL);
    return response.data;
  }

  /**
   * Busca um local específico pelo ID.
   */
  async getById(id: string) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  /**
   * Cria um novo local vinculado a um instituto.
   * O backend valida se o usuário logado é o gerente do instituto.
   */
  async create(domain: RoomDomain) {
    const payload = {
      name: domain.name,
      capacity: domain.capacity,
      description: domain.description,
      instituteId: domain.instituteId
    };
    const response = await axios.post(API_URL, payload);
    return response.data;
  }

  /**
   * Atualiza os dados de um local existente.
   */
  async update(id: string, domain: RoomDomain) {
    const payload = {
      name: domain.name,
      capacity: domain.capacity,
      description: domain.description,
      instituteId: domain.instituteId
    };
    const response = await axios.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  /**
   * Remove um local do sistema.
   */
  async delete(id: string) {
    await axios.delete(`${API_URL}/${id}`);
  }
}

export default new SpaceService();