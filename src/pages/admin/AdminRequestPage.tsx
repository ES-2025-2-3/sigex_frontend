import { observer } from "mobx-react-lite";
import { useEffect, useState, useMemo } from "react";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaEye,
  FaUser,
  FaCalendarAlt,
  FaBookmark,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

import Header from "../../commons/header/Header";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import Footer from "../../commons/footer/Footer";
import Pagination from "../../commons/pagination/Pagination";
import Modal from "../../commons/modal/Modal";

import { event_mock } from "../../../mock/event";

import { ReservationStatus } from "../../domain/enums/ReservationStatus";
import Toast, { ToastType } from "../../commons/toast/Toast";

import { mockStaff, mockAdmin, mockCommonUser } from "../../../mock/user";
import { reservation_mock } from "../../../mock/reservation";
import { Reservation } from "../../types/reservation/ReservationType";

type ConfirmAction = "APPROVE" | "REJECT";

const ITEMS_PER_PAGE = 6;

const AdminRequestPage = observer(() => {
  const allUsers = [mockStaff, mockAdmin, mockCommonUser];

  const getEventTitle = (eventId: number): string => {
    const event = event_mock.find((e) => e.id === eventId);
    return event ? event.title : "Evento desconhecido";
  };

  const getEventDescription = (eventId: number): string => {
    const event = event_mock.find((e) => e.id === eventId);
    return event?.description || "Descrição não disponível.";
  };

  const getUserName = (userId: string | number): string => {
    const user = allUsers.find((u) => String(u.id) === String(userId));
    return user ? user.name : "Usuário desconhecido";
  };

  const getUserEmail = (userId: string | number): string => {
    const user = allUsers.find((u) => String(u.id) === String(userId));
    return user ? user.email : "-";
  };

  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "ALL">(
    "ALL",
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const [confirmReservation, setConfirmReservation] = useState<Reservation | null>(null);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const openApproveConfirm = (reservation: Reservation) => {
    setConfirmReservation(reservation);
    setConfirmAction("APPROVE");
    setIsConfirmModalOpen(true);
  };

  const openRejectConfirm = (reservation: Reservation) => {
    setConfirmReservation(reservation);
    setConfirmAction("REJECT");
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!confirmReservation || !confirmAction) return;

    if (confirmAction === "APPROVE") {
      handleApprove(confirmReservation);
    } else {
      handleReject(confirmReservation);
    }

    setIsConfirmModalOpen(false);
    setConfirmReservation(null);
    setConfirmAction(null);
  };

  const handleApprove = (reservation: Reservation) => {
    setToast({
      type: "success",
      message: `Reserva #${reservation.id} aprovada com sucesso`,
    });
    setIsDetailsModalOpen(false);
  };

  const handleReject = (Reservation: Reservation) => {
    setToast({
      type: "success",
      message: `Reserva #${Reservation.id} recusada com sucesso`,
    });
    setIsDetailsModalOpen(false);
  };

  const handleStatusChange = (status: ReservationStatus | "ALL") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const statusOptions: Array<ReservationStatus | "ALL"> = [
    "ALL",
    ReservationStatus.SOLICITADA,
    ReservationStatus.APROVADA,
    ReservationStatus.INDEFERIDA,
  ];

  const statusIconMap = {
    [ReservationStatus.APROVADA]: <FaCheckCircle />,
    [ReservationStatus.INDEFERIDA]: <FaTimesCircle />,
    [ReservationStatus.SOLICITADA]: <FaHourglassHalf />,
  };

  const statusStyleMap = {
    [ReservationStatus.APROVADA]:
      "bg-emerald-50 text-emerald-600 border-emerald-100",
    [ReservationStatus.SOLICITADA]: "bg-amber-50 text-amber-600 border-amber-100",
    [ReservationStatus.INDEFERIDA]: "bg-red-50 text-red-600 border-red-100",
  };

  const filteredReservations = useMemo(() => {
    return reservation_mock.filter((b) => {
      const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
      const term = search.toLowerCase();
      const matchesSearch =
        getEventTitle(b.eventId).toLowerCase().includes(term) ||
        getUserName(b.bookerId).toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, search]);

  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex min-h-screen bg-bg-main w-full font-inter">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-10 flex flex-col items-center">
          <div className="w-full max-w-6xl space-y-10">
            <header>
              <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">
                Visão Geral
              </p>
              <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase">
                Solicitações
              </h1>
            </header>

            <section className="space-y-6">
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">
                Gerenciamento de Reservas
              </h2>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-3">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                        statusFilter === status
                          ? "bg-brand-blue text-white"
                          : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {status === "ALL" ? "Todas" : status}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-80">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Buscar por evento ou usuário..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-blue/10"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-600">
                      <th className="px-6 py-5">Usuário</th>
                      <th className="px-6 py-5">Evento</th>
                      <th className="px-6 py-5">Data</th>
                      <th className="px-6 py-5">Turno</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5 text-center">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-bold">
                    {paginatedReservations.length > 0 ? (
                      paginatedReservations.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-slate-400" />
                              <div>
                                <div>{getUserName(b.bookerId)}</div>
                                <span className="text-[10px] text-slate-400 uppercase">
                                  {getUserEmail(b.bookerId)}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div>{getEventTitle(b.eventId)}</div>
                            <span className="text-[10px] text-slate-400 uppercase">
                              #{b.id}
                            </span>
                          </td>

                          <td className="px-6 py-5">{b.date}</td>

                          <td className="px-6 py-5 uppercase text-slate-500">
                            {b.shift}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border
                                ${statusStyleMap[b.status]}`}
                            >
                              {b.status}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-center gap-2">
                              <button
                                disabled={b.status !== ReservationStatus.SOLICITADA}
                                onClick={() => openApproveConfirm(b)}
                                className="cursor-pointer p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-40"
                              >
                                <FaCheck />
                              </button>

                              <button
                                disabled={b.status !== ReservationStatus.SOLICITADA}
                                onClick={() => openRejectConfirm(b)}
                                className="cursor-pointer p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-40"
                              >
                                <FaTimes />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedReservation(b);
                                  setIsDetailsModalOpen(true);
                                }}
                                className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-brand-blue"
                              >
                                <FaEye />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-20 text-center">
                          <FaCalendarAlt
                            className="mx-auto text-slate-200 mb-4"
                            size={36}
                          />
                          <p className="text-slate-400 text-sm font-black uppercase tracking-wider">
                            Nenhuma solicitação encontrada
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </section>
          </div>
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
                  <p className="text-xs text-slate-500 mt-1 leading-snug max-w-md">
                    {getEventDescription(selectedReservation.eventId)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold mt-2">
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
                className={`p-4 rounded-xl border flex items-center gap-3 ${statusStyleMap[selectedReservation.status]}`}
              >
                {statusIconMap[selectedReservation.status]}
                <span className="text-xs font-bold uppercase tracking-wider">
                  Status: {selectedReservation.status}
                </span>
              </div>

              {selectedReservation.status === ReservationStatus.SOLICITADA && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedReservation)}
                    className="flex-1 py-3 rounded-xl cursor-pointer bg-emerald-600 text-white text-sm font-bold shadow-sm hover:bg-emerald-700 hover:shadow transition-all"
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => handleReject(selectedReservation)}
                    className="flex-1 py-3 rounded-xl cursor-pointer bg-red-600 text-white text-sm font-bold shadow-sm hover:bg-red-700 hover:shadow transition-all"
                  >
                    Recusar
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full cursor-pointer py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-xl shadow-slate-200"
              >
                Fechar
              </button>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isConfirmModalOpen}
          title="Confirmação"
          onClose={() => setIsConfirmModalOpen(false)}
        >
          <div className="space-y-6">
            <p className="text-sm text-slate-600 font-medium">
              {confirmAction === "APPROVE"
                ? "Você realmente deseja aprovar esta reserva?"
                : "Você realmente deseja recusar esta reserva?"}
            </p>

            {confirmReservation && (
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                  <FaBookmark size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">
                    {getEventTitle(confirmReservation.eventId)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug max-w-md">
                    {getEventDescription(confirmReservation.eventId)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold mt-2">
                    REFERÊNCIA: #{confirmReservation.id}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="cursor-pointer flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmAction()}
                className={`cursor-pointer flex-1 py-3 rounded-xl text-white font-bold transition
                  ${
                    confirmAction === "APPROVE"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>

        <Footer />
      </div>
    </div>
  );
});

export default AdminRequestPage;
