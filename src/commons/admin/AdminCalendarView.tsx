import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";

import { event_mock } from "../../../mock/event";
import { booking_mock } from "../../../mock/booking";
import { BookingShift } from "../../domain/enums/BookingShift";
import { BookingStatus } from "../../domain/enums/BookingStatus";

const AdminCalendarView: React.FC = observer(() => {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDayBookings, setSelectedDayBookings] = useState<any[] | null>(
    null,
  );

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const shiftLabels: Record<string, string> = {
    [BookingShift.MANHA]: "Manhã",
    [BookingShift.TARDE]: "Tarde",
    [BookingShift.NOITE]: "Noite",
  };

  const statusStyles: Record<string, string> = {
    [BookingStatus.APROVADA]: "bg-green-500 text-white",
    [BookingStatus.SOLICITADA]: "bg-amber-500 text-white",
    [BookingStatus.INDEFERIDA]: "bg-red-500 text-white",
  };

  const getBookingsForDay = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return booking_mock.filter((booking) => booking.date === dateString);
  };

  return (
    <div className="relative w-full">
      <div className="w-full bg-slate-100 rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden font-inter">
        <div className="p-8 bg-slate-200/50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-brand-blue text-xl" />
            <h3 className="text-xl font-black text-slate-700 uppercase tracking-tighter italic">
              {monthNames[month]} {year}
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-3 bg-white/50 hover:bg-white rounded-xl text-slate-500 shadow-sm transition-all"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-3 bg-white/50 hover:bg-white rounded-xl text-slate-500 shadow-sm transition-all"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-7 mb-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-slate-200/10 rounded-[1.5rem]"
              />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayBookings = getBookingsForDay(day);

              const uniqueBookingsForGrid = dayBookings.filter(
                (v, idx, a) =>
                  a.findIndex((t) => t.eventId === v.eventId) === idx,
              );

              return (
                <div
                  key={day}
                  onClick={() =>
                    dayBookings.length > 0 &&
                    setSelectedDayBookings(dayBookings)
                  }
                  className={`aspect-square min-h-[120px] bg-slate-200/30 border border-slate-200/60 rounded-[1.5rem] p-4 transition-all group relative
                    ${dayBookings.length > 0 ? "cursor-pointer hover:bg-white hover:shadow-xl hover:scale-[1.02]" : "cursor-default"}`}
                >
                  <span className="text-xl font-black text-slate-400 group-hover:text-brand-blue">
                    {day}
                  </span>

                  <div className="mt-2 space-y-1 overflow-hidden">
                    {uniqueBookingsForGrid.slice(0, 2).map((booking, idx) => {
                      const event = event_mock.find(
                        (e) => e.id === booking.eventId,
                      );
                      return (
                        <div
                          key={idx}
                          className="text-[9px] font-black uppercase bg-brand-blue/10 text-brand-blue px-2 py-1 rounded-md truncate border border-brand-blue/20"
                        >
                          {event?.title || "Evento"}
                        </div>
                      );
                    })}
                    {uniqueBookingsForGrid.length > 2 && (
                      <div className="text-[8px] font-bold text-slate-400 ml-1">
                        +{uniqueBookingsForGrid.length - 2} outros...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDayBookings && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#1e293b]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden font-inter border border-slate-200">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black text-brand-blue uppercase tracking-widest">
                  Solicitações do Dia
                </h4>
                <p className="text-lg font-black text-slate-700 italic uppercase tracking-tighter">
                  Agenda de Reservas
                </p>
              </div>
              <button
                onClick={() => setSelectedDayBookings(null)}
                className="p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedDayBookings.map((booking, idx) => {
                const event = event_mock.find((e) => e.id === booking.eventId);

                return (
                  <div
                    key={idx}
                    className="p-5 bg-slate-50 rounded-3xl border border-slate-200 group hover:border-brand-blue transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full uppercase italic ${statusStyles[booking.status]}`}
                      >
                        {shiftLabels[booking.shift] || booking.shift}
                      </span>
                      <button
                        onClick={() =>
                          navigate(`/reservas/detalhes/${booking.id}`)
                        }
                        className="text-slate-300 group-hover:text-brand-blue transition-colors"
                      >
                        <FaExternalLinkAlt size={14} />
                      </button>
                    </div>

                    <h5 className="text-base font-black text-slate-800 uppercase italic leading-tight mb-1">
                      {event?.title || "Título não encontrado"}
                    </h5>

                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                      Status:
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] ${statusStyles[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </p>

                    <button
                      onClick={() =>
                        navigate(`/reservas/detalhes/${booking.id}`)
                      }
                      className="mt-4 w-full py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all"
                    >
                      Analisar Reserva Completa
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminCalendarView;
