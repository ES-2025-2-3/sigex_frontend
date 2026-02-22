import api from "./api";
import ReservationDomain from "../domain/reservation/ReservationDomain";

const API_URL = "/reservations";

class ReservationService {
  /**
   * Cria uma nova reserva no sistema.
   */
  async create(payload: any) {
    const response = await api.post(API_URL, payload);
    return response.data;
  }

  /**
   * Atualiza uma reserva existente (apenas se estiver PENDENTE).
   */
  async update(id: string | number, payload: any) {
    const response = await api.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  /**
   * Atualiza o status de uma reserva (Ação de Admin).
   */
  async updateStatus(id: string | number, status: string) {
    const response = await api.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  }

  /**
   * Remove uma reserva do sistema.
   */
  async delete(id: string | number) {
    await api.delete(`${API_URL}/${id}`);
  }

  async getAll() {
    const response = await api.get(API_URL);
    return response.data;
  }

  /**
   * Busca uma reserva específica pelo ID.
   */
  async getById(id: string) {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  }

  /**
   * Aprova uma reserva.
   */
  async approve(id: string | null) {
    if (id === null) throw new Error("ID inválido");

    const response = await api.patch(`${API_URL}/${id}/status`, {
      status: "APROVADO",
    });

    return response.data;
  }

  /**
   * Rejeita uma reserva.
   */
  async reject(id: string | null) {
    if (id === null) throw new Error("ID inválido");

    const response = await api.patch(`${API_URL}/${id}/status`, {
      status: "RECUSADO",
    });

    return response.data;
  }

}

const reservationService = new ReservationService();
export default reservationService;
