import UserDomain from "../domain/user/UserDomain";
import api from "./api";

const API_URL = "/users";

class UserService {
  async getAll() {
    const response = await api.get(API_URL);
    return response.data;
  }

  async getById(id: string) {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  }

  async create(domain: UserDomain) {
    const payload = domain.getBackendObject();
    const response = await api.post(API_URL, payload);
    return response.data;
  }

  async update(id: string, domain: UserDomain) {
    const payload = domain.getBackendObject();
    const response = await api.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  async disable(id: string) {
    const response = await api.patch(`${API_URL}/${id}/disable`);
    return response.data;
  }

  async delete(id: string) {
    await api.delete(`${API_URL}/${id}`);
  }

  async promote(userId: string, instituteId: string) {
    const payload = {
      instituteId: instituteId,
    };

    const response = await api.patch(
      `${API_URL}/admin/promote-user/${userId}`,
      payload,
    );
    return response.data;
  }

  async demote(id: string, instituteId: string) {
    const payload = {
      instituteId: instituteId,
    };
    const response = await api.patch(
      `${API_URL}/admin/demote-user/${id}`,
      payload,
    );
    return response.data;
  }
}

export default new UserService();