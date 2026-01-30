import { runInAction } from "mobx";
import BookingDomain from "../../domain/booking/BookingDomain";
import FormStoreBase from "../base/FormStoreBase";
import { bookingIndexStore } from "./BookingIndexStore";

class BookingFormStore extends FormStoreBase<BookingDomain> {
  initializeDomain() {
    return new BookingDomain();
  }

  async persist(): Promise<boolean> {
  const { date, shift, roomIds } = this.domain;

  if (!shift) {
    this.setError("Turno inválido");
    return false;
  }

  if (bookingIndexStore.hasConflict(date, shift, roomIds)) {
    this.setError(
      "Já existe uma reserva para essa(s) sala(s) no mesmo dia e turno."
    );
    return false;
  }

  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      runInAction(() => {
        if (!this.domain.id) {
          (this.domain as BookingDomain).id = Date.now();
          bookingIndexStore["allRecords"].push(this.domain);
          bookingIndexStore.setData([...bookingIndexStore["allRecords"]]);
        }
      });
      resolve(true);
    }, 500);
  });
}


  saveBooking(onSuccess?: () => void) {
    return this.save(onSuccess);
  }
}

export const bookingFormStore = new BookingFormStore();