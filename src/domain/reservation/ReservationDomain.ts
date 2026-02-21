import { observable, action, computed, makeObservable } from "mobx";
import DomainBase from "../DomainBase";
import { ReservationStatus } from "../enums/ReservationStatus";
import { ReservationShift } from "../enums/ReservationShift";

class ReservationDomain extends DomainBase {
  @observable accessor id: number | null = null;
  @observable accessor requesterId: string | null = null;
  @observable accessor instituteId: string | null = null;
  @observable accessor roomIds: number[] = [];
  @observable accessor eventId: number | null = null;
  @observable accessor date = "";
  @observable accessor period: ReservationShift | null = null;
  @observable accessor status: ReservationStatus = ReservationStatus.PENDENTE;


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
      if (!this.requesterId) this.errors["bookerId"] = "Usuário obrigatório";
      if (!this.roomIds.length)
        this.errors["roomIds"] = "Selecione pelo menos uma sala";
      if (!this.date) this.errors["date"] = "Data obrigatória";
      if (!this.period) {
        this.errors["period"] = "Turno obrigatório";
      }
      if (!this.eventId) this.errors["eventId"] = "Evento obrigatório";
    });
  }

  getBackendObject() {
    return {
      id: this.id,
      date: this.date,
      period: this.period,
      status: this.status,

      booker: this.requesterId ? { id: this.requesterId } : null,
      rooms: this.roomIds.map((id) => ({ id })),
      event: this.eventId ? { id: this.eventId } : null,
    };
  }
}

export default ReservationDomain;
