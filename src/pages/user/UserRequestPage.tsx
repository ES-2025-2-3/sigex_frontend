import { useState, useMemo, useEffect } from "react";
import { observer } from "mobx-react-lite";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";
import Pagination from "../../commons/pagination/Pagination";
import Modal from "../../commons/modal/Modal";

import { booking_mock } from "../../../mock/booking";
import { event_mock } from "../../../mock/event";
import { BookingStatus } from "../../domain/enums/BookingStatus";
import { userSessionStore } from "../../store/user/UserSessionStore";
import { Booking } from "../../types/booking/Booking";

import {
  FaCalendarAlt,
  FaEye,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaBookmark,
  FaClock,
  FaTrash,
  FaEdit,
  FaHourglassHalf,
} from "react-icons/fa";
import UserBanner from "../../commons/user/UserBanner";
import { BookingShift } from "../../domain/enums/BookingShift";

const ITEMS_PER_PAGE = 5;

const UserRequestPage = observer(() => {
    const events = event_mock;
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
    const [isCancelSuccessOpen, setIsCancelSuccessOpen] = useState(false);
    const [isCancelErrorOpen, setIsCancelErrorOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventTitleDraft, setEventTitleDraft] = useState("");

    const handleConfirmCancel = async () => {
        try {
            setUserBookings((prev) => {
            const newBookings = prev.filter((b) => b.id !== bookingToCancel!.id);

            const totalPagesAfterDelete = Math.ceil(newBookings.length / ITEMS_PER_PAGE);
            if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
                setCurrentPage(totalPagesAfterDelete);
        }

      return newBookings;
    });

            setIsCancelModalOpen(false);
            setIsCancelSuccessOpen(true);
        } catch (error) {
            setIsCancelModalOpen(false);
            setIsCancelErrorOpen(true);
        }
    };

    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const loggedUserId = userSessionStore.currentUser?.id || 1;

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setUserBookings(
            (booking_mock as Booking[]).filter(b => b.bookerId === loggedUserId)
        );
    }, [loggedUserId]);

    const getEventTitle = (eventId: number) => {
        const event = event_mock.find((e) => e.id === eventId);
        return event ? event.title : `Evento #${eventId}`;
    };

    const filteredBookings = useMemo(() => {
        return userBookings
            .filter((b) => {
            const isPending = b.status === BookingStatus.SOLICITADA;
            const eventTitle = getEventTitle(b.eventId).toLowerCase();
            const matchesSearch =
                eventTitle.includes(search.toLowerCase()) || b.id.toString().includes(search);

            return isPending && matchesSearch;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [search, userBookings]);

    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    const paginatedBookings = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredBookings, currentPage]);
    
    const handleUpdateBooking = () => {
        if (!selectedBooking) return;

        const eventIndex = event_mock.findIndex(e => e.id === selectedBooking.eventId);

        if (eventIndex !== -1) {
            event_mock[eventIndex] = {
            ...event_mock[eventIndex],
            title: eventTitleDraft,}}

        setUserBookings(prev =>
            prev.map(b =>
            b.id === selectedBooking.id ? selectedBooking : b));
            
        setIsEditModalOpen(false);};

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
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
                    <FaClock size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                        Pedidos pendentes
                    </span>
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary">
                    Minhas Solicitações
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">
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
                        <th className="px-6 py-5">Data da Solicitação</th>
                        <th className="px-6 py-5">Turno</th>
                        <th className="px-6 py-5">Status</th>
                        <th className="px-8 py-5 text-center">Açõess</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-bold">
                        {paginatedBookings.length > 0 ? (
                        paginatedBookings.map((b) => (
                            <tr
                            key={b.id}
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
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border-amber-100 border text-[10px] font-bold uppercase">
                                    <FaHourglassHalf size={10}/>
                                    SOLICITADA
                                </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                    onClick={() => {
                                        setSelectedBooking(b);
                                        setIsDetailsModalOpen(true);
                                    }}
                                    className="p-2.5 text-gray-400 hover:text-brand-blue
                                                bg-gray-50 rounded-xl hover:bg-brand-blue/5 transition-all"
                                    >
                                    <FaEye size={15} />
                                    </button>

                                    <button
                                    onClick={() => {
                                        const event = event_mock.find(e => e.id === b.eventId)
                                        setSelectedBooking(b); setEventTitleDraft(event?.title ?? ""); setIsEditModalOpen(true)}}
                                    className="p-2.5 text-gray-400 hover:text-amber-600
                                                bg-gray-50 rounded-xl hover:bg-amber-50 transition-all"
                                    >
                                    <FaEdit size={15}/>
                                    </button>

                                    <button
                                    onClick={() => {setBookingToCancel(b); setIsCancelModalOpen(true)}}
                                    className="p-2.5 text-gray-400 hover:text-red-600
                                                bg-gray-50 rounded-xl hover:bg-red-50 transition-all"
                                    >
                                    <FaTrash size={15}/>
                                    </button>
                                </div>
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
            {selectedBooking && (
            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                    <FaBookmark size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 leading-tight">
                    {getEventTitle(selectedBooking.eventId)}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    REFERÊNCIA: #{selectedBooking.id}
                    </p>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                    Data
                    </span>
                    <p className="text-slate-700 font-bold text-sm">
                    {selectedBooking.date}
                    </p>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                    Período
                    </span>
                    <p className="text-slate-700 font-bold text-sm uppercase">
                    {selectedBooking.shift}
                    </p>
                </div>
                </div>

                <div className="p-4 rounded-xl border flex items-center gap-3
                    bg-amber-50/50 border-amber-100 text-amber-600">
                    <FaHourglassHalf size={14}/>
                    <span className="text-xs font-bold uppercase tracking-wider">
                        Status: SOLICITADA (aguardando aprovação)
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

        <Modal
            isOpen={isCancelModalOpen}
            title="Cancelar Solicitação"
            onClose={() => setIsCancelModalOpen(false)}
            >
            {bookingToCancel && (
                <div className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-red-600 text-white rounded-xl
                                    flex items-center justify-center
                                    shadow-lg shadow-red-600/20">
                    <FaTimesCircle size={18} />
                    </div>
                    <div>
                    <h3 className="font-bold text-slate-800 leading-tight">
                        Cancelar esta solicitação?
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        Esta ação não pode ser revertida
                    </p>
                    </div>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-xl space-y-2">
                    <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                        Evento
                    </span>
                    <p className="text-slate-700 font-bold text-sm">
                        {getEventTitle(bookingToCancel.eventId)}
                    </p>
                    </div>

                    <div className="flex gap-4">
                    <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                        Data
                        </span>
                        <p className="text-slate-700 font-bold text-sm">
                        {bookingToCancel.date}
                        </p>
                    </div>

                    <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                        Turno
                        </span>
                        <p className="text-slate-700 font-bold text-sm uppercase">
                        {bookingToCancel.shift}
                        </p>
                    </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                    onClick={() => setIsCancelModalOpen(false)}
                    className="flex-1 py-3.5 bg-white border border-slate-200
                                text-slate-700 rounded-xl font-bold
                                hover:bg-slate-50 transition-all text-sm"
                    >
                    Voltar
                    </button>

                    <button
                    onClick={handleConfirmCancel}
                    className="flex-1 py-3.5 bg-red-600 text-white rounded-xl
                    font-bold hover:bg-red-700 transition-all
                    text-sm shadow-xl shadow-red-600/20"
                    >
                    Confirmar Cancelamento
                    </button>
                </div>
                </div>
            )}
        </Modal>

        <Modal
            isOpen={isCancelSuccessOpen}
            title="Solicitação Cancelada"
            onClose={() => setIsCancelSuccessOpen(false)}
            >
            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl
                                flex items-center justify-center
                                shadow-lg shadow-emerald-600/20">
                    <FaCheckCircle size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 leading-tight">
                    Solicitação cancelada com sucesso
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    O pedido foi removido da sua lista
                    </p>
                </div>
                </div>

                <div className="p-4 rounded-xl border flex items-center gap-3
                bg-emerald-50/50 border-emerald-100 text-emerald-700">
                <FaCheckCircle />
                <span className="text-xs font-bold">
                    A sua solicitação foi cancelada e já não está aguardando aprovação.
                </span>
                </div>

                <button
                onClick={() => setIsCancelSuccessOpen(false)}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl
                            font-bold hover:bg-slate-800 transition-all
                            text-sm shadow-xl shadow-slate-200"
                >
                Fechar
                </button>
            </div>
        </Modal>

        <Modal
            isOpen={isCancelErrorOpen}
            title="Erro ao Cancelar"
            onClose={() => setIsCancelErrorOpen(false)}
            >
            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-red-600 text-white rounded-xl
                                flex items-center justify-center
                                shadow-lg shadow-red-600/20">
                    <FaTimesCircle size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 leading-tight">
                    Não foi possível cancelar
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    Ocorreu um erro inesperado
                    </p>
                </div>
                </div>

                <div className="p-4 rounded-xl border flex items-center gap-3
                bg-red-50/50 border-red-100 text-red-700">
                <FaTimesCircle />
                <span className="text-xs font-bold">
                    Algo correu mal ao cancelar a solicitação. Tente novamente mais tarde.
                </span>
                </div>

                <button
                onClick={() => setIsCancelErrorOpen(false)}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl
                            font-bold hover:bg-slate-800 transition-all
                            text-sm shadow-xl shadow-slate-200"
                >
                Fechar
                </button>
            </div>
        </Modal>

        <Modal 
            isOpen={isEditModalOpen}
            title="Editar solicitação"
            onClose={() => setIsEditModalOpen(false)}
            >
            
            {selectedBooking && (
                <div className="space-y-6">

                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                        <FaBookmark size={18} />
                    </div>

                    <div className="flex-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                        Evento
                        </span>

                        <input
                        type="text"
                        className="w-full text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        value={eventTitleDraft}
                        onChange={(e) => setEventTitleDraft(e.target.value)}
                        />
                    </div>
                    </div>

                <div className="grid grid-cols-2 gap-3">

                    <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                        Data
                    </span>
                    <input
                        type="date"
                        className="w-full text-sm font-bold text-slate-700 bg-transparent focus:outline-none"
                        value={selectedBooking.date}
                        onChange={(e) =>
                        setSelectedBooking({
                            ...selectedBooking,
                            date: e.target.value,
                        })
                        }
                    />
                    </div>

                    <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                        Período
                    </span>
                    <select
                        className="w-full text-sm font-bold text-slate-700 uppercase bg-transparent focus:outline-none"
                        value={selectedBooking.shift}
                        onChange={(e) =>
                        setSelectedBooking({
                            ...selectedBooking,
                            shift: e.target.value as BookingShift.MANHA | BookingShift.TARDE | BookingShift.NOITE,
                        })
                        }
                    >
                        <option value="MANHA">MANHÃ</option>
                        <option value="TARDE">TARDE</option>
                        <option value="NOITE">NOITE</option>
                    </select>
                    </div>

                </div>

                <div className="p-4 rounded-xl border flex items-center gap-3
                    bg-amber-50/50 border-amber-100 text-amber-600">
                    <FaHourglassHalf size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                    Alterações precisam de nova aprovação
                    </span>
                </div>

                <div className="flex gap-3">
                    <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-full py-3.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
                    >
                    Cancelar
                    </button>

                    <button
                    onClick={handleUpdateBooking}
                    className="w-full py-3.5 bg-brand-blue text-white rounded-xl font-bold hover:opacity-90 transition-all text-sm shadow-xl shadow-brand-blue/30"
                    >
                    Salvar alterações
                    </button>
                </div>

                </div>
            )}
        </Modal>

        <Footer />
        </div>
  );
})

export default UserRequestPage;
