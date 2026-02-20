import { useState, useMemo, useEffect } from "react";
import { observer } from "mobx-react-lite";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";
import Pagination from "../../commons/pagination/Pagination";
import Modal from "../../commons/modal/Modal";

import { ReservationStatus } from "../../domain/enums/ReservationStatus";
import { userSessionStore } from "../../store/auth/UserSessionStore";

import {
  FaCalendarAlt,
  FaEye,
  FaSearch,
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaBookmark,
} from "react-icons/fa";
import UserBanner from "../../commons/user/UserBanner";
import FilterDropdown from "../../commons/components/FilterDropdown";
import ReservationService from "../../services/ReservationService";
import ReservationDomain from "../../domain/reservation/ReservationDomain";
import EventDomain from "../../domain/event/EventDomain";
import EventService from "../../services/EventService";

const ITEMS_PER_PAGE = 5;

const UserReservationPage = observer(() => {
  const [reservations, setReservations] = useState<ReservationDomain[]>([]);
  const [events, setEvents] = useState<EventDomain[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDomain | null>(null);

  const loggedUserId = userSessionStore.currentUser?.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [resData, eventsData] = await Promise.all([
          ReservationService.getMyBookings(),
          EventService.getAll(),
        ]);

        setReservations(resData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getEventTitle = (eventId: number | string | null) => {
    if (!eventId) return "Evento não identificado";
    const event = events.find((e) => String(e.id) === String(eventId));
    return event ? event.title : `Evento #${eventId}`;
  };

  const filteredReservations = useMemo(() => {
    return reservations
      .filter((b) => {
        const isFromLoggedUser = b.bookerId === loggedUserId;

        const matchesStatus =
          statusFilter === "ALL" || b.status === statusFilter;

        const eventTitle = getEventTitle(b.eventId).toLowerCase();
        const reservationId = b.id ? b.id.toString() : "";

        const matchesSearch =
          eventTitle.includes(search.toLowerCase()) ||
          reservationId.includes(search);

        return isFromLoggedUser && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
  }, [search, statusFilter, reservations, events, loggedUserId]);

  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);
  const paginatedReservations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReservations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReservations, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-10 max-w-7xl">
        <UserBanner />

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <LoadingSpinner size="medium" />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-brand-blue mb-1">
                  <FaHistory size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Histórico de Atividades
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-text-primary">
                  Minhas Reservas
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <FilterDropdown
                  label="Estado da Reserva"
                  buttonText="STATUS"
                  currentValue={statusFilter}
                  onSelect={setStatusFilter}
                  options={[
                    { label: "TODOS OS STATUS", value: "ALL" },
                    { label: "APROVADAS", value: ReservationStatus.APROVADA },
                    {
                      label: "INDEFERIDAS",
                      value: ReservationStatus.INDEFERIDA,
                    },
                  ]}
                />

                <div className="relative group">
                  <FaSearch
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar evento..."
                    className="pl-11 pr-4 py-3.5 w-72 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all placeholder:text-gray-400 placeholder:font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-gray-800 text-xs font-bold uppercase tracking-widest">
                      <th className="px-8 py-5">Evento</th>
                      <th className="px-6 py-5">Data da Reserva</th>
                      <th className="px-6 py-5">Turno</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-8 py-5 text-center">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-bold">
                    {paginatedReservations.length > 0 ? (
                      paginatedReservations.map((b) => (
                        <tr
                          key={b.id!}
                          className="group hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-8 py-6 text-gray-700">
                            <div className="font-bold text-sm">
                              {getEventTitle(b.eventId)}
                            </div>
                            <span className="text-[10px] text-gray-400 block font-bold mt-1 uppercase tracking-tighter">
                              ID: #{b.id}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-gray-600">{b.date}</td>
                          <td className="px-6 py-6 uppercase text-gray-500">
                            {b.shift}
                          </td>
                          <td className="px-6 py-6">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${
                                b.status === ReservationStatus.APROVADA
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-red-50 text-red-600 border-red-100"
                              }`}
                            >
                              {b.status === ReservationStatus.APROVADA ? (
                                <FaCheckCircle />
                              ) : (
                                <FaTimesCircle />
                              )}
                              {b.status}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <button
                              onClick={() => {
                                setSelectedReservation(b);
                                setIsDetailsModalOpen(true);
                              }}
                              className="p-2.5 text-gray-400 hover:text-brand-blue bg-gray-50 rounded-xl hover:bg-brand-blue/5 transition-all"
                            >
                              <FaEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-24 text-center">
                          <FaCalendarAlt
                            size={40}
                            className="mx-auto text-slate-200 mb-4"
                          />
                          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">
                            Nenhuma reserva encontrada.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      <Modal
        isOpen={isDetailsModalOpen}
        title="Resumo da Reserva"
        onClose={() => setIsDetailsModalOpen(false)}
      >
        {selectedReservation && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                <FaBookmark size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">
                  {getEventTitle(selectedReservation.eventId)}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  REFERÊNCIA: #{selectedReservation.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-100 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                  Data
                </span>
                <p className="text-slate-700 font-bold text-sm">
                  {selectedReservation.date}
                </p>
              </div>
              <div className="p-3 bg-white border border-slate-100 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                  Período
                </span>
                <p className="text-slate-700 font-bold text-sm uppercase">
                  {selectedReservation.shift}
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                selectedReservation.status === ReservationStatus.APROVADA
                  ? "bg-emerald-50/50 border-emerald-100 text-emerald-700"
                  : "bg-red-50/50 border-red-100 text-red-700"
              }`}
            >
              {selectedReservation.status === ReservationStatus.APROVADA ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}
              <span className="text-xs font-bold uppercase tracking-wider">
                Status: {selectedReservation.status}
              </span>
            </div>

            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-xl shadow-slate-200"
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
});

export default UserReservationPage;
