import { useState, useMemo, useEffect } from "react";
import { observer } from "mobx-react-lite";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";
import Pagination from "../../commons/pagination/Pagination";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

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
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDomain | null>(null);

  const loggedUserEmail = userSessionStore.currentUser?.email;

  const loadData = async () => {
    try {
      setLoading(true);
      const [resData, eventsData] = await Promise.all([
        ReservationService.getAll(),
        EventService.getAll(),
      ]);

      const safeReservations = Array.isArray(resData)
        ? resData
        : (resData as any)?.content || [];

      const safeEvents = Array.isArray(eventsData)
        ? eventsData
        : (eventsData as any)?.content || [];

      setReservations(safeReservations);
      setEvents(safeEvents);
    } catch (error) {
      setToast({
        type: "error",
        message: "Erro ao carregar dados do histórico.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getEventTitle = (res: any): string => {
    if (!res) return "Evento não encontrado";
    if (res.event && (res.event.title || res.event.name)) {
      return res.event.title || res.event.name;
    }
    const eventId = res.eventId || res.event?.id || res.event;
    const eventObj = events.find((e: any) => String(e.id) === String(eventId));
    if (eventObj)
      return (eventObj as any).title || (eventObj as any).name || "Sem título";
    return (
      res.eventTitle ||
      res.title ||
      `Evento #${eventId || res.id}` ||
      "Sem título"
    );
  };

  const filteredReservations = useMemo(() => {
    if (!Array.isArray(reservations)) return [];

    return reservations
      .filter((b: any) => {
        const isFromUser =
          b.bookerEmail?.toLowerCase() === loggedUserEmail?.toLowerCase();

        const isHistoryStatus =
          b.status === ReservationStatus.APROVADA ||
          b.status === ReservationStatus.INDEFERIDA ||
          b.status === "APROVADA" ||
          b.status === "INDEFERIDA";

        const matchesStatus =
          statusFilter === "ALL" || b.status === statusFilter;

        const title = getEventTitle(b).toLowerCase();
        const matchesSearch =
          title.includes(search.toLowerCase()) || String(b.id).includes(search);

        return isFromUser && isHistoryStatus && matchesStatus && matchesSearch;
      })
      .sort((a: any, b: any) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
  }, [search, statusFilter, reservations, events, loggedUserEmail]);

  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-main font-system">
      <Header />
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

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
                <h1 className="text-3xl font-bold text-[#1e293b]">
                  Minhas Reservas
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <FilterDropdown
                  label="Estado"
                  buttonText="FILTRAR STATUS"
                  currentValue={statusFilter}
                  onSelect={setStatusFilter}
                  options={[
                    { label: "TODOS", value: "ALL" },
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar no histórico..."
                    className="pl-11 pr-4 py-3.5 w-72 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-gray-800 text-xs font-bold uppercase">
                    <th className="px-8 py-5">Evento</th>
                    <th className="px-6 py-5">Data</th>
                    <th className="px-6 py-5">Turno</th>
                    <th className="px-6 py-5">Status Final</th>
                    <th className="px-8 py-5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-bold">
                  {paginatedReservations.length > 0 ? (
                    paginatedReservations.map((b: any) => (
                      <tr
                        key={b.id!}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-8 py-6 text-gray-700">
                          <div className="font-bold text-sm">
                            {getEventTitle(b)}
                          </div>
                          <span className="text-[10px] text-gray-400 block mt-1 uppercase">
                            ID: #{b.id}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-gray-600">{b.date}</td>
                        <td className="px-6 py-6 uppercase text-gray-500">
                          {b.shift || b.period}
                        </td>
                        <td className="px-6 py-6">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${
                              b.status === ReservationStatus.APROVADA ||
                              b.status === "APROVADA"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-red-50 text-red-600 border-red-100"
                            }`}
                          >
                            {b.status === ReservationStatus.APROVADA ||
                            b.status === "APROVADA" ? (
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
                            className="p-2.5 text-gray-400 hover:text-brand-blue bg-gray-50 rounded-xl hover:shadow-md transition-all"
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
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                          Nenhum registro histórico encontrado.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
              <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg">
                <FaBookmark size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">
                  {getEventTitle(selectedReservation)}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  ID: #{selectedReservation.id}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-100 rounded-xl text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                  Data
                </span>
                <p className="text-slate-700 font-bold text-sm">
                  {selectedReservation.date}
                </p>
              </div>
              <div className="p-3 bg-white border border-slate-100 rounded-xl text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                  Turno
                </span>
                <p className="text-slate-700 font-bold text-sm uppercase">
                  {selectedReservation.shift ||
                    (selectedReservation as any).period}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-slate-200"
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
