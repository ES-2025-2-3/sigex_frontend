import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaLink,
  FaAlignLeft,
  FaTags,
  FaCalendarAlt,
  FaClock,
  FaLock,
} from "react-icons/fa";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";
import Toast, { ToastType } from "../../commons/toast/Toast";

import ReservationService from "../../services/ReservationService";
import EventService from "../../services/EventService";

const EditRequestPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const [reservationData, setReservationData] = useState<any>(null);
  const [eventData, setEventData] = useState<any>({
    title: "",
    description: "",
    registrationLink: "",
    imageUrl: "",
  });
  const [originalEvent, setOriginalEvent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reservation = await ReservationService.getById(String(id));
        setReservationData(reservation);

        const eventId =
          reservation.eventId || reservation.event?.id || reservation.event;

        let event;
        try {
          event = await EventService.getById(String(eventId));
        } catch (e) {
          event = reservation.event || {};
        }

        const normalizedEvent = {
          ...event,
          id: event?.id || eventId,
          title: event?.title || event?.name || reservation.eventTitle || "",
          description: event?.description || reservation.description || "",
          registrationLink:
            event?.registrationLink || reservation.registrationLink || "",
          imageUrl: event?.imageUrl || reservation.imageUrl || "",
        };

        setEventData(normalizedEvent);
        setOriginalEvent(normalizedEvent);
      } catch (error) {
        setToast({
          type: "error",
          message: "Erro ao carregar dados do servidor.",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const finalPayload = {
        ...eventData,
        title: eventData.title?.trim() || originalEvent.title,
        description: eventData.description?.trim() || originalEvent.description,
        registrationLink:
          eventData.registrationLink?.trim() || originalEvent.registrationLink,
        imageUrl: eventData.imageUrl?.trim() || originalEvent.imageUrl,
      };

      await EventService.update(String(eventData.id), finalPayload);
      setToast({
        type: "success",
        message: "Informações atualizadas com sucesso!",
      });
      setTimeout(() => navigate("/usuario/solicitacoes"), 1500);
    } catch (error) {
      setToast({ type: "error", message: "Falha ao salvar as alterações." });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col bg-bg-main">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-bg-main font-inter">
      <Header />
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <main className="flex-grow container mx-auto px-6 py-10 max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-brand-blue font-black text-[10px] uppercase tracking-widest mb-6 transition-colors"
        >
          <FaArrowLeft size={12} /> Voltar para solicitações
        </button>

        <header className="mb-10">
          <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">
            Solicitações
          </p>
          <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase leading-none">
            Editar Pedido
          </h1>
        </header>

        <form
          onSubmit={handleSave}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-slate-50">
            <div className="space-y-2 relative group">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <FaCalendarAlt className="text-brand-blue" /> Data da Reserva
              </label>
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex items-center gap-4 cursor-not-allowed">
                <input
                  readOnly
                  className="bg-transparent outline-none font-bold text-slate-400 text-base w-full cursor-not-allowed"
                  value={reservationData?.date || ""}
                  placeholder="Para alterar a data, faça uma nova reserva"
                />
                <FaLock className="text-slate-300" size={14} />
              </div>
              <div className="absolute z-20 hidden group-hover:block bg-slate-900 text-white text-[10px] p-4 rounded-xl shadow-2xl -top-16 left-0 w-72 border border-white/10">
                A data é vinculada à reserva original e não pode ser editada
                aqui. Se desejar alterar esse campo, cancele a reserva atual e realize uma nova.
                <div className="absolute -bottom-1 left-6 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            </div>

            <div className="space-y-2 relative group">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <FaClock className="text-brand-blue" /> Turno / Período
              </label>
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex items-center gap-4 cursor-not-allowed">
                <input
                  readOnly
                  className="bg-transparent outline-none font-bold text-slate-400 text-base w-full cursor-not-allowed uppercase"
                  value={
                    reservationData?.shift || reservationData?.period || ""
                  }
                  placeholder="Para alterar o turno, faça uma nova reserva"
                />
                <FaLock className="text-slate-300" size={14} />
              </div>
              <div className="absolute z-20 hidden group-hover:block bg-slate-900 text-white text-[10px] p-4 rounded-xl shadow-2xl -top-16 left-0 w-72 border border-white/10">
                O turno é vinculado à reserva original e não pode ser editado
                aqui. Se desejar alterar esse campos, cancele a reserva atual e realize uma nova.
                <div className="absolute -bottom-1 left-6 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Título do Evento
              </label>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
                <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg">
                  <FaTags size={16} />
                </div>
                <input
                  className="flex-1 bg-transparent outline-none font-bold text-slate-700 text-base"
                  value={eventData?.title || ""}
                  onChange={(e) =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                  placeholder={originalEvent?.title || "Insira o título..."}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <FaAlignLeft className="text-brand-blue" /> Detalhamento do
                Evento
              </label>
              <textarea
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                value={eventData?.description || ""}
                onChange={(e) =>
                  setEventData({ ...eventData, description: e.target.value })
                }
                placeholder={
                  originalEvent?.description || "Descreva o evento..."
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <FaLink className="text-brand-blue" /> Link de Inscrição
                </label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 outline-none"
                  value={eventData?.registrationLink || ""}
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      registrationLink: e.target.value,
                    })
                  }
                  placeholder={originalEvent?.registrationLink || "https://..."}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <FaImage className="text-brand-blue" /> URL da Capa
                </label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 outline-none"
                  value={eventData?.imageUrl || ""}
                  onChange={(e) =>
                    setEventData({ ...eventData, imageUrl: e.target.value })
                  }
                  placeholder={originalEvent?.imageUrl || "URL da imagem..."}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <FaAlignLeft className="text-brand-blue" /> Informações Adicionais do
                Evento
              </label>
              <textarea
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                value={eventData?.additionalInfo || ""}
                onChange={(e) =>
                  setEventData({ ...eventData, additionalInfo: e.target.value })
                }
                placeholder={
                  originalEvent?.additionalInfo || "Insira informações adicionais que seus convidados devem saber..."
                }
              />
            </div>

          <div className="flex gap-4 pt-8 border-t border-slate-50">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Descartar
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 py-4 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <FaSave /> Gravar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
});

export default EditRequestPage;
