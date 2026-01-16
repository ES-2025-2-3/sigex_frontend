import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { eventStore } from "../../store/event/EventStore";
import { Evento } from "../../types/event/EventType";

import Header from "../../commons/header/Header";
import EventCard from "../../commons/eventCard/EventCard";
import Button from "../../commons/button/Button";

import heroBackground from '../../assets/images/jose_farias.jpg';

import { FaSearch } from "react-icons/fa";
import Modal from "../../commons/components/Modal/Modal";

import "./HomePage.css";
import Footer from "../../commons/footer/Footer";
const HomePage = observer(() => {
  const navigate = useNavigate();
  const { upcomingEvents, isLoading, fetchEvents } = eventStore;
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(
    null
  );

  const handleOpenModal = (id: number) => {
    const evento = upcomingEvents.find((e) => e.id === id);
    if (evento) {
      setEventoSelecionado(evento);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEventoSelecionado(null);
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = () => {
    navigate(`/eventos?busca=${searchTerm}`);
  };

  const handleGoToReserva = () => {
    navigate("/reservas/nova");
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      <section
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-overlay-dark to-overlay-medium flex items-center justify-center flex-col px-5">
          <div className="text-center text-white max-w-[800px]">
            <h1 className="font-montserrat text-3xl md:text-[2.5rem] font-bold mb-8 leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
              Descubra e Reserve os Eventos e <br className="hidden md:block" />
              Espaços da Extensão da UFCG.
            </h1>

            <div className="flex flex-col md:flex-row bg-transparent md:bg-white p-0 md:p-1 rounded-xl md:rounded-full shadow-none md:shadow-lg w-full max-w-[600px] mx-auto gap-2 md:gap-0">
              <input
                type="text"
                className="flex-1 border-none px-6 py-4 text-base rounded-lg md:rounded-l-full outline-none text-text-primary"
                placeholder="Buscar por palestra, workshop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="bg-brand-blue hover:bg-brand-blue-hover text-white px-8 py-3 md:py-0 rounded-lg md:rounded-full font-bold flex items-center justify-center gap-2 transition-colors"
                onClick={handleSearch}
              >
                <FaSearch /> Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-bg-main">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-3xl font-semibold text-text-primary mb-8">
            Próximos Eventos
          </h2>

          {isLoading ? (
            <p className="text-center text-gray-600 animate-pulse">
              Carregando eventos...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {upcomingEvents.slice(0, 3).map((evento) => (
                <EventCard
                  key={evento.id}
                  id={evento.id}
                  titulo={evento.titulo}
                  data={evento.data}
                  descricao={evento.descricao}
                  imagemUrl={evento.imagemUrl}
                  local={evento.local}
                  tags={evento.tags}
                  onClickDetails={handleOpenModal}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/eventos")}>
              Ver todos os eventos
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-brand-blue-light to-brand-blue py-20 text-center text-white shadow-none border-none ring-0">
        <div className="max-w-[700px] mx-auto px-5 flex flex-col items-center shadow-none border-none">
          <h2 className="text-4xl font-bold mb-4">Você é um organizador?</h2>
          <p className="text-lg mb-8 opacity-95 leading-relaxed">
            Precisa de um local para seu evento? Verifique a disponibilidade dos
            auditórios e salas de extensão e solicite sua reserva online de
            forma rápida.
          </p>
          <div>
            <Button variant="primary" size="large" onClick={handleGoToReserva}>
              Solicitar Reserva
            </Button>
          </div>
        </div>
      </section>
      <Footer />

      <Modal
        isOpen={modalOpen}
        title={eventoSelecionado?.titulo ?? "Detalhes do Evento"}
        onClose={handleCloseModal}
      >
        {eventoSelecionado && (
          <div>
            <img
              src={eventoSelecionado.imagemUrl}
              alt={eventoSelecionado.titulo}
              className="modal-content"
            />

            <p>
              <strong>Data:</strong> {eventoSelecionado.data}
            </p>
            <p>
              <strong>Local:</strong> {eventoSelecionado.local}
            </p>
            <p>
              <strong>Descrição:</strong> {eventoSelecionado.descricao}
            </p>

            {(eventoSelecionado.tags ?? []).length > 0 && (
              <div style={{ marginTop: 15 }}>
                <strong>Tags:</strong>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  {(eventoSelecionado.tags ?? []).map((t) => (
                    <span key={t} className="tag-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <Button
                variant="primary"
                size="large"
                style={{ width: "100%" }}
                onClick={() =>
                  navigate(`/eventos/${eventoSelecionado.id}/inscricao`)
                }
              >
                Inscreva-se
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
});

export default HomePage;
