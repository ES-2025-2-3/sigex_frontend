import { makeAutoObservable, runInAction } from "mobx";
import { event_mock } from "../../../mock/event"; 

class EventStore {
  upcomingEvents: any[] = []; 
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  fetchEvents = async () => {
    this.isLoading = true;

    setTimeout(() => {
        runInAction(() => {
            this.upcomingEvents = event_mock; 
            this.isLoading = false;
        });
    }, 1000);
  }
}

export const eventStore = new EventStore();