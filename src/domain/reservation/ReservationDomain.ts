import { observable, action, computed, makeObservable } from "mobx";
import DomainBase from "../DomainBase";
import { ReservationStatus } from "../enums/ReservationStatus";
import { ReservationShift } from "../enums/ReservationShift";

class ReservationDomain extends DomainBase {
  @observable accessor id: string | null = null;
  @observable accessor bookerId: string | null = null;
  @observable accessor instituteId: string | null = null;
  @observable accessor roomIds: number[] = [];
  @observable accessor eventId: number | null = null;
  @observable accessor date = "";
  @observable accessor shift: ReservationShift | null = null;
  @observable accessor status: ReservationStatus = ReservationStatus.SOLICITADA;

  constructor(b?: Record<string, unknown>) {
    super();
    makeObservable(this);
    if (b) this.setData(b);
  }

  @action
  validate(field?: string) {
    if (field) {
      super.validate(field);
      return;
    }

    super.validate(undefined, () => {
      if (!this.bookerId) this.errors["bookerId"] = "Usuário obrigatório";
      if (!this.roomIds.length)
        this.errors["roomIds"] = "Selecione pelo menos uma sala";
      if (!this.date) this.errors["date"] = "Data obrigatória";
      if (!this.shift) {
        this.errors["shift"] = "Turno obrigatório";
      }
      if (!this.eventId) this.errors["eventId"] = "Evento obrigatório";
    });
  }

  getBackendObject() {
    return {
      id: this.id,
      date: this.date,
      shift: this.shift,
      status: this.status,

      booker: this.bookerId ? { id: this.bookerId } : null,
      rooms: this.roomIds.map((id) => ({ id })),
      event: this.eventId ? { id: this.eventId } : null,
    };
  }
}

export default ReservationDomain;
