import React from 'react';
import { observer } from 'mobx-react-lite';
import { eventFormStore } from '../../../store/event/EventFormStore';
import { bookingFormStore } from '../../../store/booking/BookingFormStore';

interface Props {
  rooms: any[];
}

const LocationStep: React.FC<Props> = observer(({ rooms }) => {
  const bDomain = bookingFormStore.domain;
  const eDomain = eventFormStore.domain;

  const handleSelectRoom = (id: number, name: string) => {
    bDomain.roomIds = [id];
    eDomain.location = name;
  };

  return (
    <div className="animate-step space-y-10">
      <header><h1 className="text-3xl font-black text-brand-dark tracking-tight">Escolha um Local</h1></header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleSelectRoom(room.id, room.name)}
            className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center gap-5
              ${bDomain.roomIds.includes(room.id) ? "border-brand-blue bg-blue-50/50" : "border-slate-50 bg-slate-50/30 hover:border-slate-200"}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${bDomain.roomIds.includes(room.id) ? "bg-brand-blue text-white shadow-xl scale-110" : "bg-white text-slate-300"}`}>🏢</div>
            <div>
              <p className={`font-black ${bDomain.roomIds.includes(room.id) ? "text-brand-blue" : "text-brand-dark"}`}>{room.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">{room.block} • {room.capacity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default LocationStep;