import { BookingShift } from "../../domain/enums/BookingShift";
import { BookingStatus } from "../../domain/enums/BookingStatus";

export interface Booking {
    id: number;
    bookerId: number;
    roomIds: number[];
    eventId: number;
    date: string;
    shift: BookingShift;
    status: BookingStatus;
}