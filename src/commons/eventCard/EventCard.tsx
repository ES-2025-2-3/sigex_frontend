import React from "react";
import Button from "../button/Button";
import { Evento } from "../../types/event/EventType";
import "./EventCard.css";

interface EventCardProps extends Evento {
  onClickDetails?: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  titulo,
  data,
  descricao,
  imagemUrl,
  local,
  tags = [],
  onClickDetails,
}) => {
  const [dia, mes] = data.split(" ");

  return (
    <div className="event-card">
      <div className="card-image-wrapper">
        <img src={imagemUrl} alt={titulo} className="card-image" />
        <div className="date-badge">
          <span className="date-day">{dia}</span>
          <span className="date-month">{mes}</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{titulo}</h3>
        <p className="card-local">{local}</p>

        <div className="card-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        <div className="card-footer">
          <Button
            variant="primary"
            size="small"
            onClick={() => onClickDetails?.(id)}
            style={{ width: "100%" }}
          >
            Ver Detalhes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
