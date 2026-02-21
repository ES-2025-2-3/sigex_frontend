import { action, computed, makeObservable, runInAction } from "mobx";
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

  @action
  async fetch() {
    const user = userSessionStore.currentUser;
    if (!user) return;

    await this.runFetch(async () => {
      if (user.type === 'ADMIN' || user.type === 'SERVIDOR_TECNICO_ADMINISTRATIVO') {
        return await BookingService.getAll();;
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

  @computed 
  get allBookings(): BookingDomain[] {
    return Array.isArray(this.allRecords) ? this.allRecords : [];
  }

  hasConflict(date: string, period: ReservationShift, roomIds: number[]): boolean {
    return this.allRecords.some(b =>
      b.date === date &&
      b.period === period &&
      b.roomIds.some(id => roomIds.includes(id))
    );
  }

  @action
  async approve(id: number | null): Promise<boolean> {
    this.setLoading(true);

    try {
      const updated = await BookingService.approve(id);

      runInAction(() => {
        const booking = this.getById(id);
        if (booking) {
          booking.status = updated.status;
        }
        this.setError(null);
      });

      return true;

    } catch (error: any) {
      runInAction(() => {
        this.setError(error?.message ?? "Erro ao aprovar reserva");
      });
      return false;

    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  @action
  async reject(id: number | null): Promise<boolean> {
    this.setLoading(true);

    try {
      const updated = await BookingService.reject(id);

      runInAction(() => {
        const booking = this.getById(id);
        if (booking) {
          booking.status = updated.status;
        }
        this.setError(null);
      });

      return true;

    } catch (error: any) {
      runInAction(() => {
        this.setError(error?.message ?? "Erro ao rejeitar reserva");
      });
      return false;

    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }
}

export const reservationIndexStore = new ReservationIndexStore();