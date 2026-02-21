import api from './api';
const API_URL = '/rooms'; 

class SpaceService {
  async getAll() {
    const response = await api.get(API_URL);
    return response.data;
  }

  async create(payload: any) {
    const response = await api.post(API_URL, payload);
    return response.data;
  }

  async update(id: number | string, payload: any) {
    const response = await api.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  async delete(id: number | string) {
    await api.delete(`${API_URL}/${id}`);
  }

  async getById(id: number | string) {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  }
}

export default new SpaceService();
