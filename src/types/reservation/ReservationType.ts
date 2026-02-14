import { ReservationShift } from "../../domain/enums/ReservationShift";
import { ReservationStatus } from "../../domain/enums/ReservationStatus";

export interface Reservation {
    id: number;
    bookerId: string;
    roomIds: number[];
    eventId: number;
    date: string;
    shift: ReservationShift;
    status: ReservationStatus;
}