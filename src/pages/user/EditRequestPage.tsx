import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { 
  FaArrowLeft, FaSave, FaImage, FaLink, 
  FaAlignLeft, FaTags, FaRegCalendarAlt 
} from "react-icons/fa";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import { event_mock } from "../../../mock/event";
import { booking_mock } from "../../../mock/booking";
import { BookingShift } from "../../domain/enums/BookingShift";

import "react-datepicker/dist/react-datepicker.css";
import Toast from "../../commons/toast/Toast";

const EditRequestPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bookingData, setBookingData] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);
  
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const booking = booking_mock.find(b => b.id === Number(id));
    if (booking) {
      setBookingData({ ...booking });
      const event = event_mock.find(e => e.id === booking.eventId);
      if (event) setEventData({ ...event });
    }
  }, [id]);

  const handleSave = () => {
    const bIndex = booking_mock.findIndex(b => b.id === Number(id));
    const eIndex = event_mock.findIndex(e => e.id === bookingData.eventId);

    if (bIndex !== -1) booking_mock[bIndex] = bookingData;
    if (eIndex !== -1) event_mock[eIndex] = eventData;

    setShowToast(true);

    setTimeout(() => {
      navigate("/usuario/solicitacoes");
    }, 500);
  };

  if (!bookingData || !eventData) return null;

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      {showToast && (
        <Toast 
          type="success" 
          message="Solicitação atualizada com sucesso!" 
          onClose={() => setShowToast(false)} 
          duration={3000}
        />
      )}

      <main className="flex-grow container mx-auto px-6 py-10 max-w-5xl">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-brand-blue font-black text-[10px] uppercase tracking-widest mb-6 transition-colors"
        >
          <FaArrowLeft size={12} /> Voltar para solicitações
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Editar Solicitação</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Ref: #{id}</p>
          </div>

          <div className="p-8 space-y-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start border-b border-slate-100 pb-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Data do Evento</p>
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex justify-center custom-datepicker">
                  <DatePicker
                    selected={bookingData.date ? new Date(bookingData.date + "T00:00:00") : null}
                    onChange={(date) => {
                      if (date) {
                        const d = date.toISOString().split("T")[0];
                        setBookingData({ ...bookingData, date: d });
                      }
                    }}
                    inline
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <FaRegCalendarAlt className="text-brand-blue" /> Selecionar turno
                </p>
                <div className="grid gap-3">
                  {Object.values(BookingShift).map((s) => {
                    const selected = bookingData.shift === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, shift: s })}
                        className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all duration-200
                          ${selected ? "border-brand-blue/70 bg-blue-50 shadow-sm ring-2 ring-brand-blue/10" : "border-slate-100 bg-white hover:border-slate-200"}`}
                      >
                        <span className={`font-black uppercase text-xs tracking-widest ${selected ? "text-brand-blue" : "text-slate-400"}`}>
                          {s}
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all 
                          ${selected ? "bg-brand-blue border-brand-blue" : "bg-white border-slate-300"}`}>
                          {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título do Evento</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  value={eventData.title}
                  onChange={(e) => setEventData({...eventData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <FaAlignLeft className="text-brand-blue" /> Descrição do Evento
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <FaLink className="text-brand-blue" /> Link de Inscrição
                  </label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                    value={eventData.registrationLink || ""}
                    onChange={(e) => setEventData({...eventData, registrationLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <FaImage className="text-brand-blue" /> URL da Capa
                  </label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                    value={eventData.imageUrl || ""}
                    onChange={(e) => setEventData({...eventData, imageUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <FaTags className="text-brand-blue" /> Tags (Separadas por vírgula)
                </label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  value={eventData.tags?.join(", ") || ""}
                  onChange={(e) => setEventData({...eventData, tags: e.target.value.split(",").map(t => t.trim())})}
                />
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex gap-4">
               <button 
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
               >
                Descartar
               </button>
               <button 
                type="button"
                onClick={handleSave}
                className="flex-1 py-4 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-2"
               >
                <FaSave /> Salvar Alterações
               </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
});

export default EditRequestPage;