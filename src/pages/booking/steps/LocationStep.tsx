import React from 'react';
import { observer } from 'mobx-react-lite';
import { FaCheck } from 'react-icons/fa';
import { eventFormStore } from '../../../store/event/EventFormStore';
import { bookingFormStore } from '../../../store/booking/BookingFormStore';

interface Props {
  rooms: any[];
  equipaments?: any[];
}

const LocationStep: React.FC<Props> = observer(({ rooms, equipaments = [] }) => {
  const bDomain = bookingFormStore.domain;
  const eDomain = eventFormStore.domain;

  const handleSelectRoom = (id: number, name: string) => {
    bDomain.roomIds = [id];
    eDomain.location = name;
  };

  const handleToggleEquipment = (id: number) => {
    if (bDomain.equipmentIds.includes(id)) {
      bDomain.equipmentIds = bDomain.equipmentIds.filter((eid) => eid !== id);
    } else {
      bDomain.equipmentIds.push(id);
    }
  };

  return (
    <div className="animate-step space-y-10">
      <header>
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">Escolha um Local</h1>
        <p className="text-slate-400 mt-2">Selecione o espaço principal para seu evento.</p>
      </header>
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

      {equipaments.length > 0 && (
        <>
          <hr className="border-slate-200" />
          <div className="space-y-4">
            <header>
              <h2 className="text-xl font-black text-brand-dark tracking-tight">Materiais Adicionais (Opcional)</h2>
              <p className="text-slate-400 text-sm mt-1">Selecione os materiais que você deseja solicitar.</p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {equipaments.map((equip) => (
                <button
                  key={equip.id}
                  onClick={() => handleToggleEquipment(equip.id)}
                  type="button"
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left
                    ${
                      bDomain.equipmentIds.includes(equip.id)
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all
                    ${
                      bDomain.equipmentIds.includes(equip.id)
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                    {bDomain.equipmentIds.includes(equip.id) ? <FaCheck /> : "📦"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-sm ${bDomain.equipmentIds.includes(equip.id) ? "text-green-700" : "text-slate-700"}`}>
                      {equip.name}
                    </p>
                    <p className="text-xs text-slate-500">{equip.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default LocationStep;