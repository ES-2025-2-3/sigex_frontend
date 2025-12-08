import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { eventStore } from "../../store/event/EventStore";
import { Evento } from '../../types/event/EventType';

import Header from "../../commons/header/Header";
import EventCard from "../../commons/eventCard/EventCard";
import Button from "../../commons/button/Button";

import heroBackground from '../../assets/images/jose_farias.jpg';

import { FaSearch } from "react-icons/fa";

import "./HomePage.css";
import Footer from "../../commons/footer/Footer";
import Modal from "../../commons/components/Modal/Modal";

const HomePage = observer(() => {
  const navigate = useNavigate();
  const { upcomingEvents, isLoading, fetchEvents } = eventStore;
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);

  const handleOpenModal = (evento: Evento) => {
    setEventoSelecionado(evento);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEventoSelecionado(null);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = () => {
    navigate(`/eventos?busca=${searchTerm}`);
  };

  const handleGoToReserva = () => {
    navigate("/reservas/nova");
  };

  return (
    <div className="homepage-container">
      <Header />

      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Descubra e Reserve os Eventos e <br />
              Espaços da Extensão da UFCG.
            </h1>

            <div className="search-bar-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por palestra, workshop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-button" onClick={handleSearch}>
                <FaSearch /> Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="events-section">
        <div className="container">
          <h2 className="section-title">Próximos Eventos</h2>

          {isLoading ? (
            <p className="loading-text">Carregando eventos...</p>
          ) : (
            <div className="events-grid">
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

          <div className="view-more-container">
            <Button variant="outline" onClick={() => navigate("/eventos")}>
              Ver todos os eventos
            </Button>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-content">
          <h2 className="cta-title">Você é um organizador?</h2>
          <p className="cta-text">
            Precisa de um local para seu evento? Verifique a disponibilidade dos
            auditórios e salas de extensão e solicite sua reserva online de
            forma rápida.
          </p>
          <div className="cta-button-wrapper">
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

            <p><strong>Data:</strong> {eventoSelecionado.data}</p>
            <p><strong>Local:</strong> {eventoSelecionado.local}</p>
            <p><strong>Descrição:</strong> {eventoSelecionado.descricao}</p>

            {eventoSelecionado.tags?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <strong>Tags:</strong>
                <div style={{ marginTop: 5 }}>
                  {eventoSelecionado.tags.map((t) => (
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
                onClick={() => navigate(`/eventos/${eventoSelecionado.id}/inscricao`)}
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
