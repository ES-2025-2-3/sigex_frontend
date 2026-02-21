import { action, makeObservable, runInAction } from "mobx";
import EventDomain from "../../domain/event/EventDomain";
import FormStoreBase from "../base/FormStoreBase";
import eventTypeService from "../../services/EventService";

class EventFormStore extends FormStoreBase<EventDomain> {
  constructor() {
    super();
    makeObservable(this);
  }

  initializeDomain() {
    return new EventDomain();
  }

  @action
  async persist(): Promise<any> {
    this.clearError();

    this.domain.validate();

    if (!this.domain.isValid) {
      this.setError("Por favor, preencha os campos obrigatórios.");
      return null;
    }

    try {
      this.loading = true;

      const payload = this.domain.getBackendObject();
      const savedEvent = await eventTypeService.create(payload);

      runInAction(() => {
        this.domain.id = savedEvent.id;
        this.loading = false;
        this.clearError();
      });

      return savedEvent;
    } catch (error: any) {
      runInAction(() => {
        this.loading = false;
        const message =
          error.response?.data?.message || "Não foi possível criar o evento.";
        this.setError(message);
      });
      return null;
    }
  }

  @action
  reset() {
    this.domain = this.initializeDomain();
    this.clearError();
  }
}

export const eventFormStore = new EventFormStore();
