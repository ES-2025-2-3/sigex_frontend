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
      this.setError("Preencha todos os campos obrigatórios do evento.");
      return null;
    }

    try {
      const savedEvent = await eventTypeService.create(this.domain);
      runInAction(() => {
        this.domain.id = savedEvent.id;
        this.clearError();
      });
      return savedEvent;
    } catch (error: any) {
      runInAction(() => {
        this.setError("Erro ao salvar o evento no servidor.");
      });
      return null;
    }
  }
}

export const eventFormStore = new EventFormStore();