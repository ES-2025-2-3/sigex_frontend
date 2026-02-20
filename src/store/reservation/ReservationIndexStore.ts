import { action, makeObservable } from "mobx";
import BookingDomain from "../../domain/reservation/ReservationDomain";
import IndexStoreBase from "../base/IndexStoreBase";
import { ReservationShift } from "../../domain/enums/ReservationShift";
import BookingService from "../../services/ReservationService";
import { userSessionStore } from "../auth/UserSessionStore";

class ReservationIndexStore extends IndexStoreBase<BookingDomain> {
  constructor() {
    super();
    makeObservable(this);
  }

  async fetch() {
    const user = userSessionStore.currentUser;
    if (!user) return;

    await this.runFetch(async () => {
      if (user.type === 'ADMIN' || user.type === 'SERVIDOR_TECNICO_ADMINISTRATIVO') {
        return await BookingService.getAll();
      } else {
        return await BookingService.getMyBookings();
      }
    });
  }

  @action
  addRecord(record: BookingDomain) {
    this.setData([...this.allRecords, record]);
  }

  getByDate(date: string) {
    return this.allRecords.filter(b => b.date === date);
  }

  hasConflict(date: string, shift: ReservationShift, roomIds: number[]): boolean {
    return this.allRecords.some(b =>
      b.date === date &&
      b.shift === shift &&
      b.roomIds.some(id => roomIds.includes(id))
    );
  }
}

export const reservationIndexStore = new ReservationIndexStore();