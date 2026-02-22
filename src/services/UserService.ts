// services/UserService.ts
import api from "./api";
import UserDomain from "../domain/user/UserDomain";

const API_URL = "/users";

export type UpdateUserPayload = {
  name: string;
  email: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

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

  // ✅ CORREÇÃO: mandar exatamente o que o UpdateUserRequestDTO espera
  async update(id: string, payload: UpdateUserPayload) {
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
    const response = await api.patch(`${API_URL}/admin/promote-user/${userId}`, {
      instituteId,
    });
    return response.data;
  }

  async demote(userId: string, instituteId: string) {
    const response = await api.patch(`${API_URL}/admin/demote-user/${userId}`, {
      instituteId,
    });
    return response.data;
  }

  async changePassword(payload: ChangePasswordPayload) {
    await api.patch(`${API_URL}/me/change-password`, payload);
  }
}

export default new UserService();