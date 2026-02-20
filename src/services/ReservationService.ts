import axios from 'axios';
import ReservationDomain from '../domain/reservation/ReservationDomain';

const API_URL = '/reservation';

class ReservationService {

  /**
   * Cria uma nova reserva no sistema.
   * O backend identifica o autor da reserva pelo Token JWT (UserDetails).
   * * @param domain Objeto de domínio.
   * @param eventId ID do evento que já deve ter sido criado previamente.
   */
  async create(domain: ReservationDomain, eventId: string) {
    const payload = {
      roomIds: domain.roomIds, 
      eventId: eventId,        
      date: domain.date,       
      shift: domain.shift,
    };

    const response = await axios.post(API_URL, payload);
    return response.data;
  }

  /**
   * Atualiza uma reserva existente.
   */
  async update(id: string, domain: ReservationDomain) {

    const payload = {
      roomIds: domain.roomIds,
      date: domain.date,
      shift: domain.shift
    };

    const response = await axios.put(`${API_URL}/${id}`, payload);
    return response.data;
  }

  /**
   * Remove uma reserva do sistema.
   */
  async delete(id: string) {
    await axios.delete(`${API_URL}/${id}`);
  }

  /**
   * Busca todas as reservas.
   */
  async getAll() {
    const response = await axios.get(API_URL);
    return response.data;
  }

  /**
   * Busca as reservas vinculadas ao usuário autenticado (Docente).
   * O backend identifica o usuário pelo Token JWT.
   */
  async getMyBookings(): Promise<ReservationDomain[]> {
    const response = await axios.get(`${API_URL}/my`); 
    return response.data;
  }

  /**
   * Busca uma reserva específica pelo ID.
   */
  async getById(id: string) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }
}

export default new ReservationService();