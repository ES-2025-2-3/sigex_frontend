import { ReservationShift } from "../../domain/enums/ReservationShift";
import { ReservationStatus } from "../../domain/enums/ReservationStatus";

export interface Reservation {
    id: number;
    requesterId: string;
    roomIds: number[];
    eventId: number;
    date: string;
    period: ReservationShift;
    status: ReservationStatus;
}