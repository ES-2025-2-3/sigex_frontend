import { useState, useMemo, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaClock,
  FaHourglassHalf,
  FaEye,
  FaEdit,
  FaTrash,
  FaBookmark,
} from "react-icons/fa";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";
import Pagination from "../../commons/pagination/Pagination";
import Modal from "../../commons/modal/Modal";
import UserBanner from "../../commons/user/UserBanner";
import Toast, { ToastType } from "../../commons/toast/Toast";

import { userSessionStore } from "../../store/auth/UserSessionStore";
import ReservationService from "../../services/ReservationService";
import EventService from "../../services/EventService";
import ReservationDomain from "../../domain/reservation/ReservationDomain";
import EventDomain from "../../domain/event/EventDomain";

const ITEMS_PER_PAGE = 5;

const UserRequestPage = observer(() => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDomain | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] =
    useState<ReservationDomain | null>(null);

  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);
  const [reservations, setReservations] = useState<ReservationDomain[]>([]);
  const [events, setEvents] = useState<EventDomain[]>([]);

  const loggedUserEmail = userSessionStore.currentUser?.email;

  const loadData = async () => {
    try {
      setLoading(true);
      const [resData, eventsData] = await Promise.all([
        ReservationService.getAll(),
        EventService.getAll(),
      ]);

      setReservations(
        Array.isArray(resData) ? resData : (resData as any)?.content || [],
      );
      setEvents(
        Array.isArray(eventsData)
          ? eventsData
          : (eventsData as any)?.content || [],
      );
    } catch (error) {
      setToast({ type: "error", message: "Erro ao carregar dados." });
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

  const handleConfirmCancel = async () => {
    try {
      if (!reservationToCancel?.id) return;
      setIsCancelling(true);

      const eventId =
        reservationToCancel.eventId ||
        (reservationToCancel as any).event?.id ||
        (reservationToCancel as any).event;

      await ReservationService.delete(String(reservationToCancel.id));

      if (eventId && typeof eventId !== "object") {
        try {
          await EventService.delete(String(eventId));
        } catch (e) {
          console.warn(
            "Evento não pôde ser apagado ou já foi removido automaticamente pelo servidor.",
          );
        }
      }

      setReservations((prev) =>
        prev.filter((b) => b.id !== reservationToCancel.id),
      );

      setIsCancelModalOpen(false);
      setToast({
        type: "success",
        message: "Solicitação e evento removidos com sucesso!",
      });
    } catch (error) {
      setToast({ type: "error", message: "Erro ao processar a exclusão." });
    } finally {
      setIsCancelling(false);
      setReservationToCancel(null);
    }
  };

  const filteredReservations = useMemo(() => {
    return reservations
      .filter((b: any) => {
        const isFromUser =
          b.bookerEmail?.toLowerCase() === loggedUserEmail?.toLowerCase();
        const isPending =
          b.status === "PENDING" || b.status === 0 || b.status === "0";
        const title = getEventTitle(b).toLowerCase();
        return isFromUser && isPending && title.includes(search.toLowerCase());
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
  }, [search, reservations, events, loggedUserEmail]);

  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);
  const paginated = filteredReservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
          <div className="flex justify-center items-center py-32">
            <LoadingSpinner size="medium" />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-brand-blue mb-1">
                  <FaClock size={14} />
                  <span className="text-xs font-bold uppercase">
                    Pedidos pendentes
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-[#1e293b]">
                  Minhas Solicitações
                </h1>
              </div>

              <div className="relative group">
                <FaSearch
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar evento..."
                  className="pl-11 pr-4 py-3.5 w-72 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-blue/10"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-gray-800 text-xs font-bold uppercase">
                    <th className="px-8 py-5">Evento</th>
                    <th className="px-6 py-5">Data</th>
                    <th className="px-6 py-5">Turno</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-8 py-5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-bold">
                  {paginated.map((b: any) => (
                    <tr
                      key={b.id}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-8 py-6 text-gray-700">
                        <div className="font-bold text-sm">
                          {getEventTitle(b)}
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-1">
                          ID: #{b.id}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-gray-600">{b.date}</td>
                      <td className="px-6 py-6 uppercase text-gray-500">
                        {b.shift || b.period}
                      </td>
                      <td className="px-6 py-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase">
                          <FaHourglassHalf size={10} /> Pendente
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedReservation(b);
                              setIsDetailsModalOpen(true);
                            }}
                            className="p-2.5 text-gray-400 hover:text-brand-blue bg-gray-50 rounded-xl"
                          >
                            <FaEye size={15} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/usuario/solicitacoes/editar/${b.id}`)
                            }
                            className="p-2.5 text-gray-400 hover:text-amber-600 bg-gray-50 rounded-xl"
                          >
                            <FaEdit size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setReservationToCancel(b);
                              setIsCancelModalOpen(true);
                            }}
                            className="p-2.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-xl"
                          >
                            <FaTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  ID: #{selectedReservation.id}
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
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold"
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isCancelModalOpen}
        title="Cancelar Solicitação"
        onClose={() => setIsCancelModalOpen(false)}
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-slate-600 font-medium">
              Deseja remover esta solicitação permanentemente?
            </p>
            <p className="text-[10px] text-red-500 font-bold uppercase mt-2 tracking-widest">
              O evento vinculado também será excluído.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isCancelling ? "Removendo..." : "Confirmar Exclusão"}
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
});

export default UserRequestPage;
