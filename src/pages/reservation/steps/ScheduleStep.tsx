import React from "react";
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { FaRegCalendarAlt } from "react-icons/fa";
import { reservationFormStore } from "../../../store/reservation/ReservationFormStore";
import { ReservationShift } from "../../../domain/enums/ReservationShift";

interface Props {
  occupationData: Record<string, string>;
}

const ScheduleStep: React.FC<Props> = observer(({ occupationData }) => {
  const bDomain = reservationFormStore.domain;

  return (
    <div className="animate-step space-y-10">
      <header>
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">
          Quando será o evento?
        </h1>
        <p className="text-slate-400 mt-2">
          Dias destacados possuem reservas existentes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex justify-center custom-datepicker">
          <DatePicker
            selected={
              bDomain.date ? new Date(bDomain.date + "T00:00:00") : null
            }
            onChange={(date) => {
              if (date) {
                bDomain.date = date.toISOString().split("T")[0];
              }
            }}
            inline
            renderDayContents={(day, date) => {
              const dateStr = date!.toISOString().split("T")[0];
              const eventName = occupationData[dateStr];
              return (
                <div className="relative w-full h-full flex items-center justify-center cursor-pointer">
                  {day}
                  {eventName && (
                    <span className="absolute bottom-1 w-1 h-1 bg-brand-blue rounded-full" />
                  )}
                </div>
              );
            }}
          />
        </div>

        <div className="space-y-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FaRegCalendarAlt className="text-brand-blue" /> Selecionar turno
          </p>
          <div className="grid gap-4">
            {Object.values(ReservationShift).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => (bDomain.shift = s)}
                className={`p-6 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all
                  ${bDomain.shift === s ? "border-brand-blue bg-blue-50" : "border-slate-100 bg-white hover:border-slate-200"}`}
              >
                <span
                  className={`font-black uppercase text-xs tracking-widest ${bDomain.shift === s ? "text-brand-blue" : "text-slate-400"}`}
                >
                  {s}
                </span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${bDomain.shift === s ? "bg-brand-blue border-brand-blue" : "bg-white border-slate-300"}`}
                >
                  {bDomain.shift === s && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ScheduleStep;
