import { runInAction, makeObservable, observable } from "mobx";
import { event_mock } from "../../../mock/event";
import EventDomain from "../../domain/event/EventDomain";
import IndexStoreBase from "../base/IndexStoreBase";

export default class EventIndexStore extends IndexStoreBase<EventDomain> {
  @observable accessor upcomingEvents: EventDomain[] = []; 

  constructor() {
    super();
    makeObservable(this);
  }

  async fetch() {
    await this.runFetch(async () => {
      return new Promise<EventDomain[]>((resolve) => {
        setTimeout(() => {
          resolve(event_mock.map((e) => new EventDomain(e)));
        }, 800);
      });
    });

    runInAction(() => {
      this.upcomingEvents = this.allRecords;
    });
  }

  get allCategories(): string[] {
    const tags = this.allRecords.flatMap((event) => event.tags || []);
    return Array.from(new Set(tags)).sort();
  }

  getEventById(id: number) {
    return this.getById(id, (e) => e.id);
  }
}

export const eventIndexStore = new EventIndexStore();
