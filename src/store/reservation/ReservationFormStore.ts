import { runInAction, makeObservable, action } from "mobx";
import BookingDomain from "../../domain/reservation/ReservationDomain";
import FormStoreBase from "../base/FormStoreBase";
import { reservationIndexStore } from "./ReservationIndexStore";
import BookingService from "../../services/ReservationService";

class ReservationFormStore extends FormStoreBase<BookingDomain> {
  
  constructor() {
    super();
    makeObservable(this);
  }

  initializeDomain() {
    return new BookingDomain();
  }

  @action
  reset() {
    runInAction(() => {
      this.domain = this.initializeDomain();
      this.clearError();
    });
  }

  /**
   * Persiste a reserva vinculando-a ao evento criado.
   */
  @action
  async persist(eventId?: number): Promise<boolean> {
    const { shift, roomIds } = this.domain;

    if (!shift || roomIds.length === 0) {
      this.setError("Selecione o turno e as salas da reserva.");
      return false;
    }

    if (!eventId) {
      this.setError("O ID do evento é obrigatório para realizar a reserva.");
      return false;
    }

    try {
      const savedBooking = await BookingService.create(this.domain, eventId);

      runInAction(() => {
        this.domain.id = savedBooking.id;
        this.domain.status = savedBooking.status;
        reservationIndexStore.addRecord(this.domain);
        this.setError(null);
      });

      return true;
    } catch (error: any) {
      runInAction(() => {
        if (error.response?.status === 409) {
          this.setError("Conflito: Esta sala já está ocupada neste horário.");
        } else {
          this.setError("Erro técnico ao salvar a reserva.");
        }
      });
      return false;
    }
  }
}

export const reservationFormStore = new ReservationFormStore();