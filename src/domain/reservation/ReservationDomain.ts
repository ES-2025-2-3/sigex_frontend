import { observable, action, makeObservable } from "mobx";
import DomainBase from "../DomainBase";
import { ReservationStatus } from "../enums/ReservationStatus";
import { ReservationShift } from "../enums/ReservationShift";

class ReservationDomain extends DomainBase {
  @observable accessor id: string | null = null;
  @observable accessor roomIds: number[] = [];
  @observable accessor eventId: number | null = null;
  @observable accessor date = "";
  @observable accessor shift: ReservationShift | null = null;
  @observable accessor status: ReservationStatus = ReservationStatus.SOLICITADA;

  constructor(b?: Record<string, unknown>) {
    super();
    makeObservable(this);
    if (b) {
      this.id = (b.id as string) || null;
      this.date = (b.date as string) || "";
      this.shift = (b.period as ReservationShift) || null;
      this.status = (b.status as ReservationStatus) || ReservationStatus.SOLICITADA;
      this.roomIds = (b.roomIds as number[]) || [];
      this.eventId = (b.eventId as number) || null;
    }
  }

  @action
  validate(field?: string) {
    this.errors = {}; 

    if (field) {
      if (field === "date" && !this.date) this.errors["date"] = "Data obrigatória";
      if (field === "shift" && !this.shift) this.errors["shift"] = "Turno obrigatório";
      if (field === "roomIds" && !this.roomIds.length) this.errors["roomIds"] = "Selecione pelo menos uma sala";
      return;
    }

    if (!this.date) this.errors["date"] = "Data obrigatória";
    if (!this.shift) this.errors["shift"] = "Turno obrigatório";
    if (!this.roomIds.length) this.errors["roomIds"] = "Selecione pelo menos uma sala";
  }

  getBackendObject() {
  return {
    eventId: this.eventId,
    roomIds: [...this.roomIds], 
    date: this.date, 
    period: this.shift, 
    status: "PENDING" 
  };
}
}

export default ReservationDomain;
