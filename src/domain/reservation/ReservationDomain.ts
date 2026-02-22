import { observable, action, makeObservable } from "mobx";
import DomainBase from "../DomainBase";
import { ReservationStatus } from "../enums/ReservationStatus";
import { ReservationShift } from "../enums/ReservationShift";

class ReservationDomain extends DomainBase {
  @observable accessor id: string | null = null;
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
    if (b) {
      this.id = (b.id as string) || null;
      this.date = (b.date as string) || "";
      this.period = (b.period as ReservationShift) || null;
      this.status = (b.status as ReservationStatus) || ReservationStatus.PENDENTE;
      this.roomIds = (b.roomIds as number[]) || [];
      this.eventId = (b.eventId as number) || null;
    }
  }

  @action
  validate(field?: string) {
    this.errors = {}; 

    if (field) {
      if (field === "date" && !this.date) this.errors["date"] = "Data obrigatória";
      if (field === "period" && !this.period) this.errors["period"] = "Turno obrigatório";
      if (field === "roomIds" && !this.roomIds.length) this.errors["roomIds"] = "Selecione pelo menos uma sala";
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
