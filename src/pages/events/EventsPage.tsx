import { useEffect, useState, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useSearchParams, useNavigate } from "react-router-dom";
import { eventStore } from "../../store/event/EventStore";

import Header from "../../commons/header/Header";
import EventCard from "../../commons/eventCard/EventCard";
import Footer from "../../commons/footer/Footer";
import Pagination from "../../commons/pagination/Pagination";

import { FaSearch, FaArrowLeft } from "react-icons/fa";
import Button from "../../commons/button/Button";
import Modal from "../../commons/modal/Modal";
import EventDomain from "../../domain/event/EventDomain";

const EventosPage = observer(() => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { upcomingEvents, isLoading, fetchEvents } = eventStore;

  const [filterTerm, setFilterTerm] = useState(searchParams.get("busca") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  const [modalOpen, setModalOpen] = useState(false);

  const [eventoSelecionado, setEventoSelecionado] =
    useState<EventDomain | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const busca = searchParams.get("busca") || "";
    setFilterTerm(busca);
    setCurrentPage(1);
  }, [searchParams]);

  const handleFilterChange = (term: string) => {
    setFilterTerm(term);
    setSearchParams({ busca: term });
  };

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

  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter(
      (evento) =>
        evento.titulo.toLowerCase().includes(filterTerm.toLowerCase()) ||
        evento.tags.some((tag) =>
          tag.toLowerCase().includes(filterTerm.toLowerCase()),
        ),
    );
  }, [upcomingEvents, filterTerm]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent,
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-brand-blue font-bold transition-all group"
          >
            <FaArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Voltar para o Início
          </button>

          <button
            className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-blue-hover transition shadow-sm"
            onClick={() => navigate("/reservas/nova")}
          >
            Cadastrar Evento
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              className="w-full bg-gray-100 border-none rounded-full py-3 px-12 outline-none focus:ring-2 focus:ring-brand-blue/30 text-text-primary placeholder:text-gray-400 shadow-inner"
              placeholder="Buscar por palestra, workshop..."
              value={filterTerm}
              onChange={(e) => handleFilterChange(e.target.value)}
            />
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {["CATEGORIA", "DATA"].map((label) => (
              <select
                key={label}
                className="bg-white border border-gray-200 rounded-md px-4 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer hover:bg-gray-50 transition"
              >
                <option value="">{label}</option>
              </select>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-8 border-l-4 border-brand-blue pl-4">
          {filterTerm ? `Resultados para "${filterTerm}"` : "Todos os Eventos"}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <>
            {currentEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentEvents.map((evento) => (
                    <EventCard
                      key={evento.id}
                      id={evento.id!}
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

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg font-medium">
                  Nenhum evento encontrado para esta busca.
                </p>
                <button
                  onClick={() => handleFilterChange("")}
                  className="mt-4 text-brand-blue font-bold hover:underline"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <Modal
        isOpen={modalOpen}
        title={eventoSelecionado?.titulo ?? "Detalhes do Evento"}
        onClose={handleCloseModal}
      >
        {eventoSelecionado && (
          <div className="space-y-4">
            <img
              src={eventoSelecionado.imagemUrl}
              alt={eventoSelecionado.titulo}
              className="w-full h-auto max-h-[250px] object-cover rounded-lg shadow-sm"
            />

            <div className="space-y-2 text-base">
              <p className="text-gray-600">
                <strong className="text-brand-dark font-bold">Data:</strong>{" "}
                {eventoSelecionado.data}
              </p>
              <p className="text-gray-600">
                <strong className="text-brand-dark font-bold">Local:</strong>{" "}
                {eventoSelecionado.local}
              </p>
              <p className="text-gray-600 line-clamp-3">
                <strong className="text-brand-dark font-bold">
                  Descrição:
                </strong>{" "}
                {eventoSelecionado.descricao}
              </p>
            </div>

            {(eventoSelecionado.tags ?? []).length > 0 && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {(eventoSelecionado.tags ?? []).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100">
              <Button
                variant="primary"
                size="large"
                className="w-full font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/20"
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

export default EventosPage;
