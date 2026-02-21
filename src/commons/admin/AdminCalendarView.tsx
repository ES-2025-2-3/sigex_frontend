import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";

import { eventIndexStore } from "../../store/event/EventIndexStore";
import { ReservationShift } from "../../domain/enums/ReservationShift";
import { ReservationStatus } from "../../domain/enums/ReservationStatus";

const AdminCalendarView: React.FC = observer(() => {
  const navigate = useNavigate();
  const { allReservations, allEvents, fetch, loading } = eventIndexStore;

  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDayReservations, setSelectedDayReservations] = useState<
    any[] | null
  >(null);

  useEffect(() => {
    fetch();
  }, []);

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
    [ReservationShift.MANHA]: "Manhã",
    [ReservationShift.TARDE]: "Tarde",
    [ReservationShift.NOITE]: "Noite",
  };

  const statusStyles: Record<string, string> = {
    [ReservationStatus.APROVADO]: "bg-green-500 text-white",
    [ReservationStatus.PENDENTE]: "bg-amber-500 text-white",
    [ReservationStatus.RECUSADO]: "bg-red-500 text-white",
  };

  const getReservationsForDay = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return allReservations.filter((res) => res.date === dateString);
  };

  return (
    <div className="relative w-full">
      <div className="w-full bg-slate-200 rounded-[2.5rem] shadow-md border border-slate-300 overflow-hidden font-inter">
        <div className="p-8 bg-slate-300/40 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-brand-blue text-xl" />
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">
              {monthNames[month]} {year}
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-3 bg-white hover:bg-brand-blue hover:text-white rounded-xl text-slate-600 cursor-pointer shadow-sm transition-all border-none"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-3 bg-white hover:bg-brand-blue hover:text-white rounded-xl text-slate-600 cursor-pointer shadow-sm transition-all border-none"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-7 mb-6 text-center text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-slate-300/20 rounded-[1.5rem]"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayReservations = getReservationsForDay(day);

              const uniqueReservationsForGrid = dayReservations.filter(
                (v, idx, a) =>
                  a.findIndex((t) => t.eventId === v.eventId) === idx,
              );

              const hasReservations = dayReservations.length > 0;

              return (
                <div
                  key={day}
                  onClick={() =>
                    hasReservations &&
                    setSelectedDayReservations(dayReservations)
                  }
                  className={`aspect-square min-h-[120px] rounded-[1.5rem] p-4 transition-all group relative border bg-slate-300/40
                    ${
                      hasReservations
                        ? "cursor-pointer border-brand-blue/30 hover:bg-slate-300/60 hover:border-brand-blue shadow-inner"
                        : "border-slate-400/10 cursor-default"
                    }`}
                >
                  <span
                    className={`text-xl font-black transition-colors ${hasReservations ? "text-brand-blue" : "text-slate-500"}`}
                  >
                    {day}
                  </span>

                  <div className="mt-2 space-y-1 overflow-hidden">
                    {uniqueReservationsForGrid.slice(0, 2).map((res, idx) => {
                      const event = allEvents.find((e) => e.id === res.eventId);
                      return (
                        <div
                          key={idx}
                          className="text-[9px] font-black uppercase bg-brand-blue/20 text-brand-blue border border-brand-blue/30 px-2 py-1 rounded-md truncate"
                        >
                          {event?.title || "Evento"}
                        </div>
                      );
                    })}
                    {uniqueReservationsForGrid.length > 2 && (
                      <div className="text-[8px] font-bold text-slate-600 ml-1">
                        +{uniqueReservationsForGrid.length - 2} outros...
                      </div>
                    )}
                  </div>

                  {hasReservations && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-brand-blue rounded-full shadow-[0_0_8px_rgba(var(--brand-blue-rgb),0.5)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDayReservations && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#1e293b]/70 backdrop-blur-sm">
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
                onClick={() => setSelectedDayReservations(null)}
                className="p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-colors cursor-pointer bg-transparent border-none"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedDayReservations.map((res, idx) => {
                const event = allEvents.find((e) => e.id === res.eventId);
                return (
                  <div
                    key={idx}
                    className="p-5 bg-slate-50 rounded-3xl border border-slate-200 group hover:border-brand-blue transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full uppercase italic ${statusStyles[res.status] || "bg-slate-400"}`}
                      >
                        {shiftLabels[res.shift] || res.shift}
                      </span>
                      <button
                        onClick={() => navigate(`/admin/solicitacoes`)}
                        className="text-slate-300 group-hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none"
                      >
                        <FaExternalLinkAlt size={14} />
                      </button>
                    </div>
                    <h5 className="text-base font-black text-slate-800 uppercase italic leading-tight mb-1">
                      {event?.title || "Título não encontrado"}
                    </h5>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                      Status:{" "}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] ${statusStyles[res.status] || "bg-slate-400"}`}
                      >
                        {res.status}
                      </span>
                    </p>
                    <button
                      onClick={() => navigate(`/admin/solicitacoes`)}
                      className="mt-4 w-full py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all cursor-pointer shadow-sm"
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
