import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaRocket,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { bookingFormStore } from "../../store/booking/BookingFormStore";
import { eventFormStore } from "../../store/event/EventFormStore";
import { BookingShift } from "../../domain/enums/BookingShift";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import Button from "../../commons/button/Button";
import { room_mock } from "../../../mock/room";
import { event_mock } from "../../../mock/event";

const occupationData = event_mock.reduce<Record<string, string>>(
  (acc, event) => {
    acc[event.date] = `${event.title} • ${event.location}`;
    return acc;
  },
  {},
);

const BookingRequestPage = observer(() => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const bDomain = bookingFormStore.domain;
  const eDomain = eventFormStore.domain;

  const availableTags = [
    "Acadêmico",
    "Cultura",
    "Tecnologia",
    "Esporte",
    "Workshop",
    "Palestra",
  ];

  const registeredRooms = room_mock;

  const handleSelectRoom = (id: number, name: string) => {
    bDomain.roomIds = [id];
    eDomain.location = name;
  };

  const toggleTag = (tag: string) => {
    if (eDomain.tags.includes(tag)) {
      eDomain.tags = eDomain.tags.filter((t) => t !== tag);
    } else {
      eDomain.tags.push(tag);
    }
  };

  const handleFinish = async () => {
    const success = await bookingFormStore.persist();
    if (success) setStep(5);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-main font-system selection:bg-brand-blue selection:text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-5">
        <div className="bg-white w-full max-w-[1100px] rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.07)] overflow-hidden border border-white/50 flex flex-col md:flex-row min-h-[700px]">
          <div className="bg-brand-dark w-full md:w-[320px] p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-white font-black text-2xl tracking-tighter mb-10 flex items-center gap-3">
                <FaRocket className="text-brand-blue" /> SIGEX RESERVAS
              </h2>

              <div className="space-y-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all border-2
                      ${step >= i ? "bg-white border-white text-brand-dark shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "border-slate-700 text-slate-600"}`}
                    >
                      {i}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-[10px] font-black uppercase tracking-[0.2em] ${step >= i ? "text-brand-blue" : "text-slate-600"}`}
                      >
                        Passo 0{i}
                      </span>
                      <span
                        className={`text-sm font-bold ${step >= i ? "text-white" : "text-slate-500"}`}
                      >
                        {i === 1
                          ? "Cronograma"
                          : i === 2
                            ? "Espaço Físico"
                            : i === 3
                              ? "Sobre o Evento"
                              : "Finalização"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
              <p className="text-slate-400 text-[11px] leading-relaxed italic">
                "Sua reserva passará por uma análise técnica antes da aprovação
                final."
              </p>
            </div>
          </div>

          <div className="flex-1 p-8 md:p-16 bg-white relative">
            {step === 1 && (
              <div className="animate-step space-y-10">
                <header>
                  <h1 className="text-3xl font-black text-brand-dark tracking-tight">
                    Quando será o evento?
                  </h1>
                  <p className="text-slate-400 mt-2">
                    Os dias destacados possuem reservas existentes.
                  </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner flex justify-center items-center">
                    <DatePicker
                      selected={
                        bDomain.date
                          ? new Date(bDomain.date + "T00:00:00")
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const d = date.toISOString().split("T")[0];
                          bDomain.date = d;
                          eDomain.date = d;
                        }
                      }}
                      inline
                      dayClassName={(date) => {
                        if (!bDomain.date) return "";

                        const selectedDate = new Date(
                          bDomain.date + "T00:00:00",
                        );

                        const sameDay =
                          date.getDate() === selectedDate.getDate() &&
                          date.getMonth() === selectedDate.getMonth() &&
                          date.getFullYear() === selectedDate.getFullYear();

                        return sameDay ? "day-selected-correct" : "";
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <FaRegCalendarAlt className="text-brand-blue" /> Selecione
                      o Turno
                    </p>
                    <div className="grid gap-4">
                      {Object.values(BookingShift).map((s) => (
                        <button
                          key={s}
                          onClick={() => (bDomain.shift = s)}
                          className={`group p-6 rounded-3xl border-2 transition-all flex items-center justify-between
                            ${bDomain.shift === s ? "border-brand-blue bg-blue-50/50 shadow-lg shadow-brand-blue/5" : "border-slate-50 bg-slate-50/50 hover:border-slate-200"}`}
                        >
                          <span
                            className={`font-black uppercase text-xs tracking-widest ${bDomain.shift === s ? "text-brand-blue" : "text-slate-400"}`}
                          >
                            {s}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${bDomain.shift === s ? "bg-brand-blue border-brand-blue scale-110" : "bg-white border-slate-200"}`}
                          >
                            {bDomain.shift === s && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-step space-y-10">
                <header>
                  <h1 className="text-3xl font-black text-brand-dark tracking-tight">
                    Qual local você quer reservar?
                  </h1>
                  <p className="text-slate-400 mt-2 flex items-center gap-2">
                    <FaMapMarkerAlt /> Escolha o lugar ideal para sua
                    capacidade.
                  </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {registeredRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => handleSelectRoom(room.id, room.name)}
                      className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all relative overflow-hidden
                        ${bDomain.roomIds.includes(room.id) ? "border-brand-blue bg-blue-50/50" : "border-slate-50 bg-slate-50/30 hover:border-slate-200"}`}
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${bDomain.roomIds.includes(room.id) ? "bg-brand-blue text-white shadow-xl shadow-brand-blue/30 scale-110" : "bg-white text-slate-300"}`}
                        >
                          🏢
                        </div>
                        <div>
                          <p
                            className={`font-black ${bDomain.roomIds.includes(room.id) ? "text-brand-blue" : "text-brand-dark"}`}
                          >
                            {room.name}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                            {room.block} • {room.capacity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-step space-y-10 max-w-2xl mx-auto">
                <header className="text-center">
                  <h1 className="text-3xl font-black text-brand-dark tracking-tight uppercase italic">
                    Conteúdo do Mural
                  </h1>
                  <div className="h-1 w-20 bg-brand-blue mx-auto mt-4 rounded-full"></div>
                </header>
                <div className="space-y-5">
                  <div className="group">
                    <input
                      className="input-reserva-modern"
                      placeholder="Título do Evento"
                      value={eDomain.title}
                      onChange={(e) => (eDomain.title = e.target.value)}
                    />
                  </div>
                  <textarea
                    className="input-reserva-modern min-h-[150px] resize-none"
                    placeholder="Descrição atraente para os convidados..."
                    value={eDomain.description}
                    onChange={(e) => (eDomain.description = e.target.value)}
                  />

                  <div className="space-y-4 pt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center italic">
                      Categorize seu Evento
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border-2
                          ${eDomain.tags.includes(tag) ? "bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/20 -translate-y-1" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-step space-y-10">
                <header>
                  <h1 className="text-3xl font-black text-brand-dark tracking-tight">
                    Mídia & Integração
                  </h1>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 relative group">
                      <label className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] mb-4 block">
                        Poster do Evento (URL)
                      </label>
                      <input
                        className="input-reserva-modern !bg-white"
                        placeholder="Link da imagem..."
                        value={eDomain.imageUrl}
                        onChange={(e) => (eDomain.imageUrl = e.target.value)}
                      />
                      <div className="mt-6 aspect-video rounded-[2rem] bg-white overflow-hidden shadow-inner flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-brand-blue/30 transition-all">
                        {eDomain.imageUrl ? (
                          <img
                            src={eDomain.imageUrl}
                            className="w-full h-full object-cover animate-fade-in"
                            alt="Preview"
                          />
                        ) : (
                          <div className="text-center">
                            <FaRegCalendarAlt
                              size={30}
                              className="mx-auto text-slate-200 mb-2"
                            />
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                              Preview
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Inscrição Externa
                      </label>
                      <input
                        className="input-reserva-modern"
                        placeholder="Link do Google Forms ou Sympla"
                        value={eDomain.registrationLink}
                        onChange={(e) =>
                          (eDomain.registrationLink = e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Informações Extras
                      </label>
                      <textarea
                        className="input-reserva-modern min-h-[180px] resize-none"
                        placeholder="Cronograma, palestrantes, pré-requisitos..."
                        value={eDomain.additionalInfo}
                        onChange={(e) =>
                          (eDomain.additionalInfo = e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center py-20 space-y-10 animate-step h-full flex flex-col justify-center">
                <div className="relative mx-auto">
                  <div className="absolute inset-0 bg-green-400 blur-3xl opacity-20 animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-2xl rotate-12 transition-transform hover:rotate-0">
                    ✓
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tighter italic">
                    Solicitação Enviada!
                  </h2>
                  <p className="text-slate-400 mt-4 max-w-sm mx-auto">
                    Recebemos sua solicitação! Ela passará por uma análise técnica e retornaremos em breve.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 text-slate-400 hover:text-brand-blue font-black transition-all group text-xs mx-auto uppercase tracking-widest"
                >
                  <FaArrowLeft
                    size={10}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Voltar para o Painel Inicial
                </button>
              </div>
            )}

            {step < 5 && (
              <div className="mt-auto pt-16 flex justify-between items-center">
                <button
                  onClick={() =>
                    step === 1 ? navigate("/") : setStep((s) => s - 1)
                  }
                  className="flex items-center gap-3 text-slate-400 hover:text-brand-dark font-black transition-all group text-xs tracking-widest uppercase"
                >
                  <FaArrowLeft
                    size={10}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  {step === 1 ? "Cancelar" : "Anterior"}
                </button>
                <div className="flex items-center gap-6">
                  <p className="hidden sm:block text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    Etapa {step}/4
                  </p>
                  <Button
                    variant="primary"
                    className="rounded-3xl px-16 py-5 font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all"
                    onClick={
                      step === 4 ? handleFinish : () => setStep((s) => s + 1)
                    }
                  >
                    {step === 4 ? "Concluir Reserva" : "Próximo"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
});

export default BookingRequestPage;
