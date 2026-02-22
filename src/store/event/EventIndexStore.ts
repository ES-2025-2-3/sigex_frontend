import { runInAction, makeObservable, observable, action } from "mobx";
import EventDomain from "../../domain/event/EventDomain";
import BookingDomain from "../../domain/reservation/ReservationDomain";
import IndexStoreBase from "../base/IndexStoreBase";
import EventService from "../../services/EventService";
import ReservationDomain from "../../domain/reservation/ReservationDomain";
import { ReservationStatus } from "../../domain/enums/ReservationStatus";
import ReservationService from "../../services/ReservationService";

export default class EventIndexStore extends IndexStoreBase<EventDomain> {
  @observable accessor upcomingEvents: EventDomain[] = [];
  @observable accessor reservations: ReservationDomain[] = [];

  constructor() {
    super();
    makeObservable(this);
  }

  get allEvents(): EventDomain[] {
    return this.allRecords || [];
  }

  @action
  fetch = async () => {
    await this.runFetch(async () => {
      const [eventsResponse, reservationsResponse] = await Promise.all([
        EventService.getAll(),
        ReservationService.getAll(),
      ]);

      runInAction(() => {
        this.allRecords = eventsResponse.map((e: any) => new EventDomain(e));

        this.reservations = reservationsResponse.map(
          (b: any) =>
            new BookingDomain({
              ...b,
              eventId: b.event?.id ?? b.eventId ?? null,
            }),
        );
      });

      return this.allRecords;
    });

    runInAction(() => {
      const approvedReservations = this.reservations.filter(
        (b) => b.status === ReservationStatus.APROVADO,
      );

      const approvedEventIds = new Set(
        approvedReservations
          .map((b) => Number(b.eventId))
          .filter((id) => !isNaN(id)),
      );

      this.upcomingEvents = this.allRecords.filter(
        (event) => event.isPublic && approvedEventIds.has(Number(event.id)),
      );
    });
  };

  get allCategories(): string[] {
    const tags = this.allRecords.flatMap((event) => event.tags || []);
    return Array.from(new Set(tags)).sort();
  }

  getBookingByEventId(eventId: number): BookingDomain | undefined {
    return this.reservations.find(
      (b) =>
        Number(b.eventId) === Number(eventId) &&
        b.status === ReservationStatus.APROVADO,
    );
  }
}

export const eventIndexStore = new EventIndexStore();
