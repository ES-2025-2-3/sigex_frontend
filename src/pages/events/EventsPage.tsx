import { useEffect, useState, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useSearchParams, useNavigate } from "react-router-dom";
import { eventIndexStore } from "../../store/event/EventIndexStore";

import Header from "../../commons/header/Header";
import EventCard from "../../commons/eventCard/EventCard";
import Footer from "../../commons/footer/Footer";
import Pagination from "../../commons/pagination/Pagination";
import Button from "../../commons/components/Button";
import Modal from "../../commons/modal/Modal";
import LoadingSpinner from "../../commons/components/LoadingSpinner";

import {
  FaSearch,
  FaArrowLeft,
  FaTimes,
  FaChevronDown,
  FaFilter,
  FaCalendarCheck,
  FaHistory,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EventDomain from "../../domain/event/EventDomain";
import { booking_mock } from "../../../mock/booking";

const EventosPage = observer(() => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { upcomingEvents, loading, fetch, allCategories } = eventIndexStore;

  const [filterTerm, setFilterTerm] = useState(searchParams.get("busca") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("categoria") || "",
  );
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("data") || "",
  );
  const [activeTab, setActiveTab] = useState<"futuros" | "encerrados">(
    "futuros",
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] =
    useState<EventDomain | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setFilterTerm(searchParams.get("busca") || "");
    setSelectedCategory(searchParams.get("categoria") || "");
    setSelectedDate(searchParams.get("data") || "");
    setCurrentPage(1);
  }, [searchParams]);

  const activeFiltersCount = [selectedCategory, selectedDate].filter(
    Boolean,
  ).length;

  const handleFilterChange = (term: string) => {
    setFilterTerm(term);
    setSearchParams({
      busca: term,
      categoria: selectedCategory,
      data: selectedDate,
    });
  };

  const clearFilters = () => {
    setFilterTerm("");
    setSelectedCategory("");
    setSelectedDate("");
    setSearchParams({});
    setIsFilterOpen(false);
  };

  const handleOpenModal = (id: number) => {
    const evento = upcomingEvents.find((e) => e.id === id);
    if (evento) {
      setEventoSelecionado(evento);
      setModalOpen(true);
    }
  };

  const filteredEvents = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return upcomingEvents.filter((evento) => {
      if (evento.isPublic === false) return false;

      const reservaConfirmada = booking_mock.find(
        (b) => b.eventId === evento.id && b.status === "APROVADA",
      );

      if (!reservaConfirmada) return false;

      const matchesSearch =
        evento.title.toLowerCase().includes(filterTerm.toLowerCase()) ||
        evento.tags.some((tag) =>
          tag.toLowerCase().includes(filterTerm.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "" ||
        (evento.tags && evento.tags.includes(selectedCategory));

      const matchesDateFilter =
        selectedDate === "" || reservaConfirmada.date === selectedDate;

      const dataReserva = new Date(reservaConfirmada.date + "T00:00:00");
      const isEncerrado = dataReserva < hoje;
      const matchesTab = activeTab === "futuros" ? !isEncerrado : isEncerrado;

      return (
        matchesSearch && matchesCategory && matchesDateFilter && matchesTab
      );
    });
  }, [upcomingEvents, filterTerm, selectedCategory, selectedDate, activeTab]);

  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-brand-blue font-bold transition-all group text-sm"
          >
            <FaArrowLeft
              size={12}
              className="group-hover:-translate-x-1 transition-transform"
            />
            VOLTAR PARA O INÍCIO
          </button>

          <button
            className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-blue-hover transition shadow-lg shadow-brand-blue/20"
            onClick={() => navigate("/reserva")}
          >
            Solicitar Reserva
          </button>
        </div>

        <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab("futuros");
              setCurrentPage(1);
            }}
            className={`pb-4 flex items-center gap-2 font-bold text-sm transition-all relative ${activeTab === "futuros" ? "text-brand-blue" : "text-gray-400 hover:text-gray-600"}`}
          >
            <FaCalendarCheck size={16} />
            PRÓXIMOS EVENTOS
            {activeTab === "futuros" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("encerrados");
              setCurrentPage(1);
            }}
            className={`pb-4 flex items-center gap-2 font-bold text-sm transition-all relative ${activeTab === "encerrados" ? "text-brand-blue" : "text-gray-400 hover:text-gray-600"}`}
          >
            <FaHistory size={16} />
            EVENTOS ENCERRADOS
            {activeTab === "encerrados" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue rounded-t-full" />
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10 relative">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-12 outline-none focus:ring-4 focus:ring-brand-blue/5 text-text-primary placeholder:text-gray-400 transition-all shadow-sm"
              placeholder="Pesquisar por nome ou tag..."
              value={filterTerm}
              onChange={(e) => handleFilterChange(e.target.value)}
            />
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center h-full gap-2 px-6 py-3.5 rounded-2xl font-bold border transition-all ${
                isFilterOpen || activeFiltersCount > 0
                  ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FaFilter size={14} />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-white text-brand-blue rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                  {activeFiltersCount}
                </span>
              )}
              <FaChevronDown
                size={12}
                className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6 space-y-5 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-gray-800 text-xs uppercase tracking-widest">
                    Refinar Busca
                  </span>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-300 hover:text-gray-600"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSearchParams({
                        busca: filterTerm,
                        categoria: e.target.value,
                        data: selectedDate,
                      });
                    }}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none"
                  >
                    <option value="">Todas as categorias</option>
                    {allCategories?.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Data Específica
                  </label>
                  <DatePicker
                    selected={
                      selectedDate ? new Date(selectedDate + "T00:00:00") : null
                    }
                    onChange={(date: Date | null) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0",
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        const value = `${year}-${month}-${day}`;

                        setSelectedDate(value);
                        setSearchParams({
                          busca: filterTerm,
                          categoria: selectedCategory,
                          data: value,
                        });
                      } else {
                        setSelectedDate("");
                        const params = new URLSearchParams(searchParams);
                        params.delete("data");
                        setSearchParams(params);
                      }
                    }}
                    placeholderText="Selecione a data"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none text-gray-700"
                    calendarClassName="bg-white rounded-2xl shadow-2xl border-none p-4"
                  />
                </div>

                {(selectedCategory || selectedDate) && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-3 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2"
                  >
                    <FaTimes size={12} /> LIMPAR TODOS OS FILTROS
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-8 border-l-4 border-brand-blue pl-4">
          {activeTab === "futuros" ? "Próximos Eventos" : "Eventos Encerrados"}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="medium" />
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

                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredEvents.length / eventsPerPage)}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="text-5xl mb-6">🔍</div>
                <p className="text-gray-500 text-lg font-medium">
                  Nenhum evento encontrado nesta aba.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-brand-blue font-bold hover:underline"
                >
                  Limpar busca e filtros
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <Modal
        isOpen={modalOpen}
        title={eventoSelecionado?.title ?? "Detalhes"}
        onClose={() => setModalOpen(false)}
      >
        {eventoSelecionado && (
          <div className="space-y-4">
            <img
              src={eventoSelecionado.imageUrl}
              className="w-full h-auto max-h-[250px] object-cover rounded-2xl shadow-sm"
            />
            <div className="space-y-2 text-base">
              <p className="text-gray-600">
                <strong className="text-brand-dark font-bold">Data:</strong>{" "}
                {eventoSelecionado.date}
              </p>
              <p className="text-gray-600">
                <strong className="text-brand-dark font-bold">Local:</strong>{" "}
                {eventoSelecionado.location}
              </p>
              <p className="text-gray-600 line-clamp-3">
                <strong className="text-brand-dark font-bold">
                  Descrição:
                </strong>{" "}
                {eventoSelecionado.description}
              </p>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <Button
                variant="primary"
                size="large"
                className="w-full font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/20"
                onClick={() => {
                  setModalOpen(false);
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