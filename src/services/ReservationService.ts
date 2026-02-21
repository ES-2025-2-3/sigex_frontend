import api from '../services/api';
import ReservationDomain from '../domain/reservation/ReservationDomain';

const API_URL = '/reservations';

class ReservationService {

  async create(domain: ReservationDomain, eventId: string) {
    const payload = {
      roomIds: domain.roomIds,
      eventId: eventId,
      date: domain.date,
      shift: domain.period,
    };

    const response = await api.post(API_URL, payload);
    return response.data;
  }

  async update(id: string, domain: ReservationDomain) {
    const payload = {
      roomIds: domain.roomIds,
      date: domain.date,
      shift: domain.period
    };

    const response = await api.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  async delete(id: string) {
    await api.delete(`${API_URL}/${id}`);
  }

  async getAll() {
    const response = await api.get(API_URL);
    return response.data;
  }

  async getMyBookings() {
    const response = await api.get(`${API_URL}/my`);
    return response.data;
  }

  async getById(id: string) {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  }

  async approve(id: number | null) {
    if (id === null) throw new Error("ID inválido");

    const response = await api.patch(`${API_URL}/${id}/status`, {
      status: "APROVADO",
    });

    return response.data;
  }

  async reject(id: number | null) {
    if (id === null) throw new Error("ID inválido");

    const response = await api.patch(`${API_URL}/${id}/status`, {
      status: "RECUSADO",
    });

    return response.data;
  }

}

export default new ReservationService();