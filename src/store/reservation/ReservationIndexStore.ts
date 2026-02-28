import { action, computed, makeObservable, runInAction } from "mobx";
import IndexStoreBase from "../base/IndexStoreBase";
import { ReservationShift } from "../../domain/enums/ReservationShift";
import { userSessionStore } from "../auth/UserSessionStore";
import reservationService from "../../services/ReservationService";
import ReservationDomain from "../../domain/reservation/ReservationDomain";

class ReservationIndexStore extends IndexStoreBase<ReservationDomain> {
  constructor() {
    super();
    makeObservable(this);
  }

  @action
  fetch = async () => {
    const user = userSessionStore.currentUser;
    if (!user) {
      console.warn("Usuário não identificado.");
    }

    await this.runFetch(async () => {
      return await reservationService.getAll();
    });
  };

  @action
  addRecord(record: ReservationDomain) {
    this.setData([...this.allRecords, record]);
  }

  getByDate(date: string) {
    return this.allRecords.filter((b) => b.date === date);
  }

  @computed
  get allBookings(): ReservationDomain[] {
    return Array.isArray(this.allRecords) ? this.allRecords : [];
  }

  hasConflict(
    date: string,
    period: ReservationShift,
    roomIds: number[],
  ): boolean {
    return this.allRecords.some(
      (b) =>
        b.date === date &&
        b.period === period &&
        b.roomIds.some((id) => roomIds.includes(id)),
    );
  }

  @action
  async approve(id: string | null): Promise<boolean> {
    this.setLoading(true);

    try {
      const updated = await reservationService.approve(id);

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
  async reject(id: string | null): Promise<boolean> {
    this.setLoading(true);

    try {
      const updated = await reservationService.reject(id);

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

  @action
  async downloadReport(startDate: string, endDate: string): Promise<boolean> {
    this.setLoading(true);

    try {
      const blob = await reservationService.downloadReport(startDate, endDate);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "relatorio_reservas.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      runInAction(() => {
        this.setError(null);
      });

      return true;

    } catch (error: any) {

      runInAction(() => {
        this.setError(error?.message ?? "Erro ao baixar relatório");
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
