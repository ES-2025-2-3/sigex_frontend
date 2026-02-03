import React from 'react';
import { observer } from 'mobx-react-lite';
import { eventFormStore } from '../../../store/event/EventFormStore';

interface Props {
  tags: string[];
}

const DescriptionStep: React.FC<Props> = observer(({ tags }) => {
  const eDomain = eventFormStore.domain;

  const toggleTag = (tag: string) => {
    if (eDomain.tags.includes(tag)) {
      eDomain.tags = eDomain.tags.filter((t) => t !== tag);
    } else {
      eDomain.tags.push(tag);
    }
  };

  return (
    <div className="animate-step space-y-10 max-w-2xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-black text-brand-dark tracking-tight uppercase italic">
          Detalhes do Evento
        </h1>
        <div className="h-1 w-20 bg-brand-blue mx-auto mt-4 rounded-full"></div>
      </header>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-brand-blue uppercase ml-5">
            Título do evento
          </label>
          <input
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.8rem]
              px-8 py-5 text-sm font-semibold text-brand-dark
              transition-all outline-none
              focus:bg-white focus:border-brand-blue focus:shadow-xl
              placeholder:text-xs placeholder:font-medium placeholder:text-slate-400"
            placeholder="Ex: Workshop de design"
            value={eDomain.title}
            onChange={(e) => (eDomain.title = e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-brand-blue uppercase ml-5">
            Descrição
          </label>
          <textarea
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.2rem]
              px-8 py-6 text-sm font-semibold text-brand-dark
              transition-all outline-none min-h-[180px] resize-none
              focus:bg-white focus:border-brand-blue focus:shadow-xl
              placeholder:text-xs placeholder:font-medium placeholder:text-slate-400"
            placeholder="Escreva uma descrição atrativa do seu evento para os convidados..."
            value={eDomain.description}
            onChange={(e) => (eDomain.description = e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border-2
                ${
                  eDomain.tags.includes(tag)
                    ? "bg-brand-blue border-brand-blue text-white shadow-lg -translate-y-1"
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default DescriptionStep;