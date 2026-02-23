import React from "react";
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
        <h1 className="text-3xl font-black text-brand-dark tracking-tight italic uppercase">
          Data e Horário
        </h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="bg-white p-6 rounded-[2.5rem] border flex justify-center custom-datepicker">
          <DatePicker
            selected={
              bDomain.date ? new Date(bDomain.date + "T00:00:00") : null
            }
            onChange={(date) => {
              if (date) bDomain.date = date.toISOString().split("T")[0];
            }}
            inline
          />
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            {" "}
            <FaRegCalendarAlt className="text-brand-blue" /> Selecione o
            Turno{" "}
          </p>
          <div className="grid gap-3">
            {Object.values(ReservationShift).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => (bDomain.period = s)}
                className={`p-5 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${bDomain.period === s ? "border-brand-blue bg-blue-50" : "border-slate-100 bg-white"}`}
              >
                <span
                  className={`font-black uppercase text-xs tracking-widest ${bDomain.period === s ? "text-brand-blue" : "text-slate-400"}`}
                >
                  {s}
                </span>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${bDomain.period === s ? "bg-brand-blue border-brand-blue" : "bg-white border-slate-300"}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ScheduleStep;
