import { makeObservable, action } from "mobx";
import EventDomain from "../../domain/event/EventDomain";
import FormStoreBase from "../base/FormStoreBase";

class EventFormStore extends FormStoreBase<EventDomain> {
  
  constructor() {
    super();
    makeObservable(this);
  }

  initializeDomain() {
    return new EventDomain();
  }

  @action
  async persist(): Promise<boolean> {
    this.domain.validate();

    if (!this.domain.isValid) {
      this.setError("Por favor, preencha todos os campos obrigatórios do evento.");
      return false;
    }

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (!this.domain.id) {
          this.domain.id = Math.floor(Math.random() * 10000);
        }
        this.setError(null);
        resolve(true);
      }, 500);
    });
  }

  saveEvent(onSuccess?: () => void) {
    return this.save(onSuccess);
  }
}

export const eventFormStore = new EventFormStore();