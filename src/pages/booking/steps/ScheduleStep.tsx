import React from "react";
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { FaRegCalendarAlt } from "react-icons/fa";
import { bookingFormStore } from "../../../store/booking/BookingFormStore";
import { eventFormStore } from "../../../store/event/EventFormStore";
import { BookingShift } from "../../../domain/enums/BookingShift";

interface Props {
  occupationData: Record<string, string>;
}

const ScheduleStep: React.FC<Props> = observer(({ occupationData }) => {
  const bDomain = bookingFormStore.domain;
  const eDomain = eventFormStore.domain;

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
        <div
          className="
            bg-white
            p-6
            rounded-[2.5rem]
            border border-slate-200/60
            shadow-[0_8px_30px_rgba(0,0,0,0.03)]
            flex justify-center
            custom-datepicker
          "
        >
          <DatePicker
            selected={
              bDomain.date ? new Date(bDomain.date + "T00:00:00") : null
            }
            onChange={(date) => {
              if (date) {
                const d = date.toISOString().split("T")[0];
                bDomain.date = d;
                eDomain.date = d;
              }
            }}
            inline
            renderDayContents={(day, date) => {
              const dateStr = date!.toISOString().split("T")[0];
              const eventName = occupationData[dateStr];

              return (
                <div className="relative group w-full h-full flex items-center justify-center">
                  {day}

                  {eventName && (
                    <>
                      <span className="absolute bottom-1 w-1 h-1 bg-brand-blue/80 rounded-full" />
                      <div
                        className="
                          pointer-events-none
                          absolute bottom-6 z-50 hidden
                          w-max max-w-[220px]
                          rounded-xl
                          bg-brand-dark/95
                          px-3 py-1.5
                          text-xs font-medium text-white
                          shadow-lg
                          opacity-0 translate-y-1
                          transition-all duration-200
                          group-hover:block
                          group-hover:opacity-100
                          group-hover:translate-y-0
                        "
                      >
                        {eventName}
                      </div>
                    </>
                  )}
                </div>
              );
            }}
          />
        </div>

        <div className="space-y-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
            <FaRegCalendarAlt className="text-brand-blue" /> Selecionar turno
          </p>

          <div className="grid gap-4">
            {Object.values(BookingShift).map((s) => {
              const selected = bDomain.shift === s;

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => (bDomain.shift = s)}
                  className={`p-6 rounded-3xl border-2
                    flex items-center justify-between
                    transition-all duration-200
                    ${
                      selected
                        ? "border-brand-blue/70 bg-blue-50 shadow-sm ring-2 ring-brand-blue/10"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                >
                  <span
                    className={`font-black uppercase text-xs tracking-widest
                      ${selected ? "text-brand-blue" : "text-slate-400"}`}
                  >
                    {s}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full border-2
                      flex items-center justify-center
                      transition-all duration-200
                      ${
                        selected
                          ? "bg-brand-blue border-brand-blue"
                          : "bg-white border-slate-300"
                      }`}
                  >
                    {selected && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ScheduleStep;
