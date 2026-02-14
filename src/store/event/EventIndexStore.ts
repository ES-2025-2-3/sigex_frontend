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

  get allReservations(): ReservationDomain[] {
    return this.reservations || [];
  }

  @action
  async fetch() {
    await this.runFetch(async () => {
      const [eventsResponse, reservationsResponse] = await Promise.all([
        EventService.getAll(),
        ReservationService.getAll(),
      ]);

      runInAction(() => {
        this.allRecords = eventsResponse.map((e) => new EventDomain(e));

        this.reservations = reservationsResponse.map(
          (b: Record<string, unknown>) =>
            new BookingDomain({
              ...b,
              eventId: (b as any)?.event?.id ?? (b as any)?.eventId ?? null,
            }),
        );
      });

      return this.allRecords;
    });

    runInAction(() => {
      const approvedEventIds = new Set<number>(
        this.reservations
          .filter(
            (b) =>
              b.status === ReservationStatus.APROVADA &&
              typeof b.eventId === "number",
          )
          .map((b) => b.eventId as number),
      );

      this.upcomingEvents = this.allRecords.filter(
        (event) => event.isPublic && approvedEventIds.has(event.id!),
      );
    });
  }

  get allCategories(): string[] {
    const tags = this.allRecords.flatMap((event) => event.tags || []);
    return Array.from(new Set(tags)).sort();
  }

  getEventById(id: number) {
    return this.getById(id, (e) => e.id);
  }

  getBookingByEventId(eventId: number): BookingDomain | undefined {
    return this.reservations.find(
      (b) => b.eventId === eventId && b.status === ReservationStatus.APROVADA,
    );
  }
}

export const eventIndexStore = new EventIndexStore();
