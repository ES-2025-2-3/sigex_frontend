import React from "react";
import { observer } from "mobx-react-lite";
import { FaRegCalendarAlt } from "react-icons/fa";
import { eventFormStore } from "../../../store/event/EventFormStore";

const MediaStep: React.FC = observer(() => {
  const eDomain = eventFormStore.domain;

  return (
    <div className="animate-step space-y-10">
      <header>
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">
          Mídia e adicionais
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6 bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
          <label className="text-[10px] font-black text-brand-blue uppercase mb-4 block">
            Imagem do evento (URL)
          </label>

          <input
            className="w-full bg-white border-2 border-slate-100 rounded-2xl
              px-5 py-3 text-sm font-semibold text-brand-dark
              outline-none focus:border-brand-blue transition-all
              placeholder:text-xs placeholder:font-medium placeholder:text-slate-400"
            placeholder="Link da imagem..."
            value={eDomain.imageUrl}
            onChange={(e) => (eDomain.imageUrl = e.target.value)}
          />

          <div className="mt-6 aspect-video rounded-[2rem] bg-white overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center shadow-inner">
            {eDomain.imageUrl ? (
              <img
                src={eDomain.imageUrl}
                className="w-full h-full object-cover"
                alt="Pré-visualização"
              />
            ) : (
              <div className="text-center text-slate-300">
                <FaRegCalendarAlt
                  size={30}
                  className="mx-auto mb-2 text-slate-400 opacity-40"
                />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Pré-visualização
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-blue uppercase mb-4 block">
              Link de inscrição
            </label>
            <input
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl
                px-7 py-5 text-sm font-semibold text-brand-dark
                outline-none focus:bg-white focus:border-brand-blue transition-all
                placeholder:text-xs placeholder:font-medium placeholder:text-slate-400"
              placeholder="Link externo de inscrição..."
              value={eDomain.registrationLink}
              onChange={(e) => (eDomain.registrationLink = e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-blue uppercase mb-4 block">
              Informações adicionais
            </label>
            <textarea
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl
                px-7 py-5 text-sm font-semibold text-brand-dark
                outline-none focus:bg-white focus:border-brand-blue transition-all
                min-h-[180px] resize-none
                placeholder:text-xs placeholder:font-medium placeholder:text-slate-400"
              placeholder="Programação, palestrantes, requisitos..."
              value={eDomain.additionalInfo}
              onChange={(e) => (eDomain.additionalInfo = e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default MediaStep;