import React from "react";
import Button from "../button/Button";
import { Evento } from "../../types/event/EventType";

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
  const [dia, mes] = data.split(" ");

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group border border-gray-100">
      <div className="relative h-[180px] overflow-hidden">
        <img
          src={imagemUrl}
          alt={titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-brand-blue text-white py-2 px-3 rounded-lg flex flex-col items-center">
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
          {tags.map((tag, index) => (
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
          style={{ width: "100%", fontWeight: "bold" }}
        >
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
