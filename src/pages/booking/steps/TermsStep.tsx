import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import { bookingFormStore } from "../../../store/booking/BookingFormStore";
import { eventFormStore } from "../../../store/event/EventFormStore";

interface Props {
  rooms: any[];
  equipaments: any[];
  onGoToStep: (step: number) => void;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}

const TERMS_KEY = 'system_terms_v1';
const TEMPLATE_KEY = 'system_event_template_v1';

const TermsStep: React.FC<Props> = observer(({ rooms, equipaments, onGoToStep, termsAccepted, onTermsChange }) => {
  const bDomain = bookingFormStore.domain;
  const eDomain = eventFormStore.domain;

  const [termsText, setTermsText] = useState<string | null>(null);
  const [acceptMessage, setAcceptMessage] = useState<string | null>(null);

  const selectedRooms = rooms.filter((r) => bDomain.roomIds.includes(r.id));
  const selectedEquipaments = bDomain.equipmentIds?.length
    ? equipaments.filter((e) => bDomain.equipmentIds?.includes(e.id))
    : [];

  useEffect(() => {
    const load = () => {
      const t = localStorage.getItem(TERMS_KEY);
      const tmp = localStorage.getItem(TEMPLATE_KEY);
      setTermsText(t);
      setAcceptMessage(tmp);
    };

    load();

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === TERMS_KEY) setTermsText(ev.newValue);
      if (ev.key === TEMPLATE_KEY) setAcceptMessage(ev.newValue);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleRemoveRoom = (id: number) => {
    if (selectedRooms.length === 1) {
      alert("Você deve selecionar pelo menos um espaço.");
      return;
    }
    bDomain.roomIds = bDomain.roomIds.filter((rid) => rid !== id);
  };

  const handleRemoveEquipament = (id: number) => {
    if (!bDomain.equipmentIds) return;
    bDomain.equipmentIds = bDomain.equipmentIds.filter((eid) => eid !== id);
  };

  return (
    <div className="animate-step space-y-8">
      <header>
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">
          Resumo e Termos
        </h1>
        <p className="text-slate-400 mt-2">
          Revise suas seleções antes de enviar a solicitação.
        </p>
      </header>

      {/* Espaços Selecionados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-600">Espaços Selecionados</h2>
          <button
            onClick={() => onGoToStep(2)}
            className="text-brand-blue hover:text-brand-blue/80 font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <FaEdit size={14} /> Editar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selectedRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg">
                  📍
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-700 text-sm">{room.name}</p>
                  <p className="text-xs text-slate-500">{room.block} • Cap: {room.capacity}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveRoom(room.id)}
                className="text-red-500 hover:text-red-700 transition-colors ml-2"
                title="Remover espaço"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Equipamentos Selecionados */}
      {selectedEquipaments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-600">Materiais Solicitados</h2>
            <button
              onClick={() => onGoToStep(2)}
              className="text-brand-blue hover:text-brand-blue/80 font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <FaEdit size={14} /> Editar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedEquipaments.map((equip) => (
              <div
                key={equip.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">
                    📦
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-700 text-sm">{equip.name}</p>
                    <p className="text-xs text-slate-500">{equip.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveEquipament(equip.id)}
                  className="text-red-500 hover:text-red-700 transition-colors ml-2"
                  title="Remover material"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Termos e Condições (lidos do localStorage, atualizáveis pelo admin) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="font-black text-slate-700 text-sm uppercase tracking-wide">📋 Termos e Condições</h3>

        {termsText ? (
          <div className="space-y-3 text-sm text-slate-600">
            {termsText.split(/\n\n|\r\n\r\n|\n/).map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        ) : (
          <div className="space-y-3 text-sm text-slate-600">
            <p>✓ Confirmo que os dados fornecidos são precisos e acordo em cumprir as políticas de uso dos espaços e materiais do instituto.</p>
            <p>✓ Entendo que a solicitação será analisada pelo administrador e receberei confirmação por e-mail.</p>
            <p>✓ Os espaços e materiais devem ser utilizados apenas para fins institucionais ou autorizados.</p>
            <p>✓ Sou responsável por qualquer dano aos espaços ou materiais durante o evento.</p>
          </div>
        )}

        <button
          onClick={() => onTermsChange(!termsAccepted)}
          className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3 font-bold text-sm uppercase
            ${termsAccepted ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
        >
          <input type="checkbox" checked={termsAccepted} onChange={() => onTermsChange(!termsAccepted)} className="cursor-pointer w-5 h-5" />
          Concordo com os termos e condições
        </button>
      </div>

      {!termsAccepted && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 text-sm">
          <span className="text-lg">⚠️</span>
          <p className="font-semibold">Você precisa aceitar os termos e condições para enviar a solicitação.</p>
        </div>
      )}

      {termsAccepted && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3 text-green-800 text-sm animate-in fade-in">
          <FaCheckCircle className="text-lg flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            {acceptMessage ? (
              acceptMessage
                .replace(/\[Nome do Evento\]/gi, eDomain.title || 'Seu evento')
                .replace(/\[Data\]/gi, bDomain.date || '')
                .replace(/\[Horário\]/gi, bDomain.shift || '')
                .replace(/\[Local\]/gi, eDomain.location || '')
                .split('\n')
                .map((line, idx) => (
                  <p key={idx} className={idx === 0 ? 'font-semibold' : 'text-sm'}>{line}</p>
                ))
            ) : (
              <p className="font-semibold">Tudo pronto! Clique em "Enviar Solicitação" para finalizar.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default TermsStep;
