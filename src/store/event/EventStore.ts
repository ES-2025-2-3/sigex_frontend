import { computed, makeAutoObservable, runInAction } from "mobx";
import { event_mock } from "../../../mock/event";
import EventDomain from "../../domain/event/EventDomain";

class EventStore {
  upcomingEvents: EventDomain[] = []; 
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  fetchEvents = async () => {
    this.isLoading = true;

    setTimeout(() => {
        runInAction(() => {
            this.upcomingEvents = event_mock.map(
              (eventData) => new EventDomain(eventData)
            ); 
            this.isLoading = false;
        });
    }, 1000);
  }

  getEventById(id: number): EventDomain | undefined {
    return this.upcomingEvents.find(event => event.id === id);
  }
}

export const eventStore = new EventStore();