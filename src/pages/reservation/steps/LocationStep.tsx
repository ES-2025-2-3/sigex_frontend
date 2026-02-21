import React from "react";
import { observer } from "mobx-react-lite";
import { reservationFormStore } from "../../../store/reservation/ReservationFormStore";

interface Props {
  rooms: any[];
  isLoading: boolean;
}

const LocationStep: React.FC<Props> = observer(({ rooms, isLoading }) => {
  const bDomain = reservationFormStore.domain;

  const toggleRoom = (roomId: number) => {
    const currentIds = [...bDomain.roomIds];
    const index = currentIds.indexOf(roomId);

    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(roomId);
    }

    bDomain.roomIds = currentIds;
  };

  if (isLoading)
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
          Buscando salas disponíveis...
        </p>
      </div>
    );

  return (
    <div className="animate-step space-y-10">
      <header>
        <h1 className="text-3xl font-black text-brand-dark tracking-tight italic uppercase">
          Escolha os Locais
        </h1>
        <p className="text-slate-400 text-sm">
          Você pode selecionar uma ou mais salas para sua reserva.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map((room) => {
          const isSelected = bDomain.roomIds.includes(room.id);

          return (
            <div
              key={room.id}
              onClick={() => toggleRoom(room.id)}
              className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center gap-5
                ${
                  isSelected
                    ? "border-brand-blue bg-blue-50/50 shadow-md scale-[1.02]"
                    : "border-slate-50 bg-slate-50/30 hover:border-slate-200"
                }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all 
                ${isSelected ? "bg-brand-blue text-white shadow-lg" : "bg-white text-slate-300"}`}
              >
                🏢
              </div>
              <div className="flex-1">
                <p
                  className={`font-black ${isSelected ? "text-brand-blue" : "text-brand-dark"}`}
                >
                  {room.name}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  {room.block} • {room.capacity} pessoas
                </p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center text-white text-[10px]">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {bDomain.roomIds.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {bDomain.roomIds.length} sala(s) selecionada(s)
          </p>
        </div>
      )}
    </div>
  );
});

export default LocationStep;
