import React from "react";
import Button from "../components/Button";
import { Evento } from "../../types/event/EventType";
import { FaImage } from "react-icons/fa";

interface EventCardProps extends Evento {
  onClickDetails?: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  titulo,
  data,
  imagemUrl,
  local,
  tags = [],
  onClickDetails,
}) => {
  const getFormattedDate = (dateString: string) => {
    try {
      const date = new Date(dateString + "T00:00:00");

      const dia = date.getDate().toString().padStart(2, "0");
      const mes = date
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", "")
        .toUpperCase();

      return { dia, mes };
    } catch (e) {
      return { dia: "00", mes: "---" };
    }
  };

  const { dia, mes } = getFormattedDate(data);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group border border-gray-100 h-full">
      <div className="relative h-[180px] overflow-hidden bg-brand-blue/35 flex items-center justify-center border-b border-brand-blue/5">
        {imagemUrl && imagemUrl.trim() !== "" ? (
          <img
            src={imagemUrl}
            alt={titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.classList.add(
                "no-image",
              );
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center mb-1">
              <FaImage size={24} className="text-brand-blue/80" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue/80">
              Sem Imagem
            </span>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-brand-blue text-white py-2 px-3 rounded-lg flex flex-col items-center shadow-lg z-10">
          <span className="text-xl font-bold leading-none">{dia}</span>
          <span className="text-[0.7rem] uppercase font-bold tracking-wider">
            {mes}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {titulo}
        </h3>
        <p className="text-sm text-gray-500 mb-4 flex-1">{local}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-blue-50 text-brand-blue text-[0.7rem] px-2.5 py-1 rounded-md font-bold uppercase border border-blue-100/50"
            >
              {tag}
            </span>
          ))}
        </div>

        <Button
          variant="primary"
          size="small"
          onClick={() => onClickDetails?.(id)}
          className="w-full font-bold"
        >
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
