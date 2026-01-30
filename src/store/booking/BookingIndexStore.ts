import BookingDomain from "../../domain/booking/BookingDomain";
import IndexStoreBase from "../base/IndexStoreBase";
import { BookingShift } from "../../domain/enums/BookingShift";

class BookingIndexStore extends IndexStoreBase<BookingDomain> {
  constructor() {
    super();
  }

  async fetch() {
    await this.runFetch(async () => {
      return new Promise<BookingDomain[]>((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, 600);
      });
    });
  }

  getByDate(date: string) {
    return this.allRecords.filter(b => b.date === date);
  }

  getByRoomId(roomId: number) {
    return this.allRecords.filter(b => b.roomIds.includes(roomId));
  }

  hasConflict(
    date: string,
    shift: BookingShift,
    roomIds: number[]
  ): boolean {
    return this.allRecords.some(b =>
      b.date === date &&
      b.shift === shift &&
      b.roomIds.some(id => roomIds.includes(id))
    );
  }
}

export const bookingIndexStore = new BookingIndexStore();



