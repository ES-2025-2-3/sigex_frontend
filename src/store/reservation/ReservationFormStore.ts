import { runInAction, makeObservable, action } from "mobx";
import FormStoreBase from "../base/FormStoreBase";
import { reservationIndexStore } from "./ReservationIndexStore";
import ReservationDomain from "../../domain/reservation/ReservationDomain";
import ReservationService from "../../services/ReservationService";

class ReservationFormStore extends FormStoreBase<ReservationDomain> {
  constructor() {
    super();
    makeObservable(this);
  }

  initializeDomain() {
    return new ReservationDomain();
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
    const { shift, roomIds, date } = this.domain;

    if (!shift || roomIds.length === 0 || !date) {
      this.setError("Selecione a data, o turno e as salas da reserva.");
      return false;
    }

    if (!eventId) {
      this.setError("O ID do evento é obrigatório.");
      return false;
    }

    try {
      const reservationRequestDTO = {
        eventId: eventId,
        roomIds: [...roomIds], 
        date: date, 
        period: shift, 
        status: "PENDING", 
      };

      console.log("Enviando Payload para o Java:", reservationRequestDTO);
      const savedReservation = await ReservationService.create(reservationRequestDTO);

      runInAction(() => {
        this.domain.id = savedReservation.id;
        this.domain.status = savedReservation.status;
        reservationIndexStore.addRecord(this.domain);
        this.setError(null);
      });

      return true;
    } catch (error: any) {
      runInAction(() => {
        const message = error.response?.data?.message;
        if (error.response?.status === 409) {
          this.setError("Conflito: Local já ocupado neste horário.");
        } else {
          this.setError(message || "Erro técnico ao salvar a reserva.");
        }
      });
      return false;
    }
  }
}

export const reservationFormStore = new ReservationFormStore();
