import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { eventIndexStore } from "../../store/event/EventIndexStore";
import EventDomain from "../../domain/event/EventDomain";
import { FaSearch } from "react-icons/fa";

import Header from "../../commons/header/Header";
import EventCard from "../../commons/eventCard/EventCard";
import Button from "../../commons/button/Button";
import Modal from "../../commons/modal/Modal";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";

import heroBackground from "../../assets/images/jose_farias.jpg";

const HomePage = observer(() => {
  const navigate = useNavigate();
  const { upcomingEvents, loading } = eventIndexStore;
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventDomain | null>(
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
    eventIndexStore.fetch();
  }, []);

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

          {loading ? (
            <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="medium"/>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {upcomingEvents.slice(0, 3).map((evento) => (
                <EventCard
                  key={evento.id}
                  id={evento.id!}
                  titulo={evento.title}
                  data={evento.date}
                  descricao={evento.description}
                  imagemUrl={evento.imageUrl}
                  local={evento.location}
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

      <section className="bg-gradient-to-br from-brand-blue-light to-brand-blue py-20 text-center text-white">
        <div className="max-w-[700px] mx-auto px-5 flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-4">Você é um organizador?</h2>
          <p className="text-lg mb-8 opacity-95 leading-relaxed">
            Precisa de um local para seu evento? Verifique a disponibilidade dos
            auditórios e salas de extensão e solicite sua reserva online.
          </p>
          <Button variant="primary" size="large" onClick={handleGoToReserva}>
            Solicitar Reserva
          </Button>
        </div>
      </section>

      <Footer />

      <Modal
        isOpen={modalOpen}
        title={eventoSelecionado?.title ?? "Detalhes do Evento"}
        onClose={handleCloseModal}
      >
        {eventoSelecionado && (
          <div className="space-y-5">
            <img
              src={eventoSelecionado.imageUrl}
              alt={eventoSelecionado.title}
              className="w-full h-auto max-h-[250px] object-cover rounded-2xl shadow-sm"
            />

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {(eventoSelecionado.tags ?? []).map((t) => (
                  <span key={t} className="px-2 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase rounded-md">
                    {t}
                  </span>
                ))}
              </div>

              <div className="space-y-2 text-base text-gray-600">
                <p><strong>Data:</strong> {eventoSelecionado.date}</p>
                <p><strong>Local:</strong> {eventoSelecionado.location}</p>
                <p className="line-clamp-3"><strong>Descrição:</strong> {eventoSelecionado.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button
                variant="primary"
                size="large"
                className="w-full py-4 font-bold rounded-xl shadow-lg shadow-brand-blue/20"
                onClick={() => {
                  handleCloseModal();
                  navigate(`/eventos/${eventoSelecionado.id}`);
                }}
              >
                Ver mais detalhes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
});

export default HomePage;
