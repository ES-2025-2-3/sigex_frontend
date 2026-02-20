import api from "./api";

const API_URL = "/users";

class UserService {
  async update(id: string, data: { name: string; email: string }) {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await api.patch(`${API_URL}/me/change-password`, data);
    return response.data;
  }

  async delete(id: string) {
    await api.delete(`${API_URL}/${id}`);
  }
}

export default new UserService();