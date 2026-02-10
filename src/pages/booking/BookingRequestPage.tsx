import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRocket, FaCheckCircle } from "react-icons/fa";

import { bookingFormStore } from "../../store/booking/BookingFormStore";
import { eventFormStore } from "../../store/event/EventFormStore";
import { userSessionStore } from "../../store/user/UserSessionStore";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import Button from "../../commons/components/Button";
import Toast, { ToastType } from "../../commons/toast/Toast";

import ScheduleStep from "./steps/ScheduleStep";
import LocationStep from "./steps/LocationStep";
import DescriptionStep from "./steps/DescriptionStep";
import MediaStep from "./steps/MediaStep";
import TermsStep from "./steps/TermsStep";

import { room_mock } from "../../../mock/room";
import { equipament_mock } from "../../../mock/equipament";
import { event_mock } from "../../../mock/event";

const occupationData = event_mock.reduce<Record<string, string>>(
  (acc, event) => {
    acc[event.date] = `${event.title} • ${event.location}`;
    return acc;
  },
  {},
);

const BookingRequestPage = observer(() => {
  const isLoggedIn = userSessionStore.user;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [toastConfig, setToastConfig] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const bDomain = bookingFormStore.domain;
  const eDomain = eventFormStore.domain;

  const availableTags = [
    "Acadêmico",
    "Cultura",
    "Tecnologia",
    "Humanidades",
    "Workshop",
    "Palestra",
  ];

  const isPublic = eDomain.isPublic;
  const lastStep = isPublic ? 5 : 4;

  useEffect(() => {
    bookingFormStore.reset();
    if (eventFormStore.reset) eventFormStore.reset();

    return () => {
      bookingFormStore.reset();
      if (eventFormStore.reset) eventFormStore.reset();
    };
  }, []);

  const showToast = (message: string, type: ToastType = "error") => {
    setToastConfig({ message, type });
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!bDomain.date || !bDomain.shift) {
        showToast("Selecione a data e o turno desejado.");
        return false;
      }
    }

    if (step === 2) {
      if (bDomain.roomIds.length === 0) {
        showToast("Selecione pelo menos um local para a reserva.");
        return false;
      }
    }

    if (step === 3) {
      if (!eDomain.title.trim()) {
        showToast("O título do evento é obrigatório.");
        return false;
      }
      if (!eDomain.description.trim()) {
        showToast("Informe uma breve descrição.");
        return false;
      }
    }

    if (step === (isPublic ? 5 : 4)) {
      if (!termsAccepted) {
        showToast("Você precisa aceitar os termos e condições.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === lastStep) {
        handleFinish();
      } else {
        setStep((s) => s + 1);
      }
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const success = await bookingFormStore.persist();
      if (success) {
        showToast("Solicitação enviada com sucesso!", "success");
        setStep(isPublic ? 6 : 5); 
      } else {
        showToast("Não foi possível processar sua reserva agora.");
      }
    } catch (error) {
      showToast("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-main">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white max-w-md w-full rounded-[2.5rem] p-10 text-center shadow-lg border border-gray-100">
            <div className="text-5xl mb-6">🔒</div>
            <h1 className="text-2xl font-black text-brand-dark mb-4">Acesso Restrito</h1>
            <p className="text-slate-400 text-sm mb-8">Faça login para solicitar reservas.</p>
            <Button variant="primary" className="rounded-3xl px-10 py-4 font-black text-xs uppercase" onClick={() => navigate("/login")}>
              Fazer Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-main font-system">
      <Header />

      {toastConfig && (
        <Toast type={toastConfig.type} message={toastConfig.message} onClose={() => setToastConfig(null)} />
      )}

      <main className="flex-1 flex items-center justify-center py-12 px-5">
        <div className="bg-white w-full max-w-[1100px] rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.07)] overflow-hidden border border-white/50 flex flex-col md:flex-row min-h-[700px]">
          
          <div className="bg-[#1e293b] w-full md:w-[320px] p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-white font-black text-2xl tracking-tighter mb-10 flex items-center gap-3 italic">
                <FaRocket className="text-brand-blue" /> SIGEX
              </h2>

              <div className="space-y-8">
                {[
                  { label: "Agenda", num: 1 },
                  { label: "Local", num: 2 },
                  { label: "Detalhes", num: 3 },
                  ...(isPublic ? [{ label: "Mídia", num: 4 }] : []),
                  { label: "Termos", num: isPublic ? 5 : 4 },
                ].map((m) => (
                  <div key={m.num} className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all border-2 
                      ${step >= m.num ? "bg-white border-white text-slate-900 shadow-xl" : "border-slate-700 text-slate-600"}`}>
                      {m.num}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${step >= m.num ? "text-brand-blue" : "text-slate-600"}`}>
                        Etapa 0{m.num}
                      </span>
                      <span className={`text-sm font-bold ${step >= m.num ? "text-white" : "text-slate-500"}`}>
                        {m.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 md:p-16 bg-white relative flex flex-col">
            <div className="flex-1">
              {step === 1 && <ScheduleStep occupationData={occupationData} />}
              {step === 2 && <LocationStep rooms={room_mock} equipaments={equipament_mock} />}
              {step === 3 && <DescriptionStep tags={availableTags} />}
              {step === 4 && isPublic && <MediaStep />}
              {step === (isPublic ? 5 : 4) && (
                <TermsStep 
                  rooms={room_mock} 
                  equipaments={equipament_mock} 
                  onGoToStep={setStep}
                  termsAccepted={termsAccepted}
                  onTermsChange={setTermsAccepted}
                />
              )}

              {step === (isPublic ? 6 : 5) && (
                <div className="text-center py-20 space-y-10 animate-step h-full flex flex-col justify-center">
                  <div className="w-32 h-32 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-2xl animate-bounce">
                    <FaCheckCircle />
                  </div>
                  <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tighter italic">Solicitado!</h2>
                  <p className="text-slate-400 mt-4 max-w-sm mx-auto">Sua reserva foi encaminhada. Você será notificado por e-mail após a análise do administrador.</p>
                  <button onClick={() => navigate("/")} className="text-brand-blue font-black transition-all text-xs uppercase tracking-widest flex items-center gap-2 mx-auto hover:underline">
                    <FaArrowLeft size={10} /> Voltar ao Início
                  </button>
                </div>
              )}
            </div>

            {step < (isPublic ? 6 : 5) && (
              <div className="mt-auto pt-10 flex justify-between items-center border-t border-slate-50">
                <button
                  onClick={() => (step === 1 ? navigate("/") : setStep((s) => s - 1))}
                  className="flex items-center gap-3 text-slate-400 hover:text-brand-dark font-black transition-all text-xs uppercase tracking-widest"
                >
                  <FaArrowLeft size={10} /> {step === 1 ? "Cancelar" : "Voltar"}
                </button>

                <div className="flex items-center gap-6">
                  <p className="hidden sm:block text-[10px] font-black text-slate-200 uppercase tracking-widest">
                    Passo {step} de {lastStep + 1}
                  </p>
                  <Button
                    variant="primary"
                    disabled={isSubmitting || (step === (isPublic ? 5 : 4) && !termsAccepted)}
                    className="rounded-3xl px-12 py-5 font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all"
                    onClick={handleNext}
                  >
                    {isSubmitting ? "Enviando..." : step === lastStep + 1 ? "Enviar Solicitação" : "Próximo Passo"}
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