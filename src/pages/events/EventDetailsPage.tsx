import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";

import Button from "../../commons/components/Button";
import Footer from "../../commons/footer/Footer";
import Header from "../../commons/header/Header";
import LoadingSpinner from "../../commons/components/LoadingSpinner";

import { eventIndexStore } from "../../store/event/EventIndexStore";
import { reservationIndexStore } from "../../store/reservation/ReservationIndexStore";
import { spaceStore } from "../../store/space/SpaceStore";

interface DetailedEvent {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  date: string;
  location: string;
  registrationLink?: string;
  additionalInfo?: string;
}

const EventDetailsPage: React.FC = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    eventIndexStore.fetch();
    reservationIndexStore.fetch();
    spaceStore.fetchSpaces();
  }, []);

  const eventData = useMemo((): DetailedEvent | null => {
    const reservation = reservationIndexStore.allBookings.find(
      (b) =>
        String(b.eventId) === String(id) &&
        String(b.status).toUpperCase() === "APROVADO",
    );

    const baseEvent = eventIndexStore.allEvents.find(
      (e) => String(e.id) === String(id),
    );

    if (!baseEvent || !reservation) return null;

    const space = spaceStore.spaces.find(
      (s) => String(s.id) === String(reservation.roomIds?.[0]),
    );

    let displayDate = reservation.date;
    if (displayDate && displayDate.includes("-")) {
      const [year, month, day] = displayDate.split("-");
      displayDate = `${day}/${month}/${year}`;
    }

    return {
      ...baseEvent,
      id: baseEvent.id,
      title: baseEvent.title,
      description: baseEvent.description,
      imageUrl: baseEvent.imageUrl,
      tags: baseEvent.tags || [],
      date: displayDate,
      location: space?.name || "Local a definir",
      registrationLink: (baseEvent as any).registrationLink,
      additionalInfo: (baseEvent as any).additionalInfo,
    } as DetailedEvent;
  }, [
    id,
    eventIndexStore.allEvents.length,
    reservationIndexStore.allBookings.length,
    spaceStore.spaces.length,
  ]);

  if (eventIndexStore.loading || reservationIndexStore.loading) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-main">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-main">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
          <h2 className="text-2xl font-bold text-brand-dark">
            Evento não encontrado
          </h2>
          <p className="text-gray-500 mt-2">
            O evento pode não estar disponível ou a reserva não foi aprovada.
          </p>
          <Button
            className="mt-6 font-bold"
            onClick={() => navigate("/eventos")}
          >
            Voltar para a listagem
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-main font-system antialiased">
      <Header />
      <div className="max-w-5xl mx-auto w-full px-5 pt-8">
        <button
          onClick={() => navigate("/eventos")}
          className="flex items-center gap-2 text-gray-400 hover:text-brand-blue font-bold transition-all group bg-transparent border-none cursor-pointer outline-none"
        >
          <FaArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Voltar para eventos
        </button>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-8">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-brand-dark/5 p-6 md:p-12 border border-white">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-[300px] shrink-0">
              <div className="aspect-square rounded-[32px] overflow-hidden shadow-inner bg-gray-100 border border-gray-100">
                <img
                  src={eventData.imageUrl}
                  alt={eventData.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 py-2">
              <div className="flex flex-wrap gap-2 mb-6">
                {eventData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-8 leading-tight tracking-tight">
                {eventData.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-gray-50 rounded-2xl text-brand-blue shadow-sm">
                    <FaCalendarAlt size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Data do Evento
                    </p>
                    <p className="text-base font-bold text-brand-dark">
                      {eventData.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-gray-50 rounded-2xl text-brand-blue shadow-sm">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Localização
                    </p>
                    <p className="text-base font-bold text-brand-dark">
                      {eventData.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-12 border-gray-100" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h3 className="text-xl font-bold text-brand-dark mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-blue rounded-full" />
                  Sobre o Evento
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {eventData.description}
                </p>
              </div>

              {eventData.additionalInfo && (
                <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100 flex gap-5">
                  <div className="bg-blue-100 p-2.5 h-fit rounded-lg text-brand-blue">
                    <FaInfoCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-dark uppercase mb-2">
                      Informações Importantes
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {eventData.additionalInfo}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {eventData.registrationLink ? (
                <div className="sticky top-10">
                  <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase text-center mb-6 tracking-widest">
                      Participação
                    </h4>
                    <Button
                      variant="primary"
                      className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/30 font-bold text-lg"
                      onClick={() =>
                        window.open(eventData.registrationLink, "_blank")
                      }
                    >
                      Fazer Inscrição
                      <FaExternalLinkAlt size={14} />
                    </Button>
                    <p className="text-[10px] text-center text-gray-400 mt-5 font-medium leading-tight">
                      Você será redirecionado para a plataforma oficial do
                      organizador.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="sticky top-10 p-8 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[32px] text-center">
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">
                    Inscrições não disponíveis por link externo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
});

export default EventDetailsPage;
