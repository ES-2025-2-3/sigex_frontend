import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRocket, FaCheckCircle } from "react-icons/fa";

import { reservationFormStore } from "../../store/reservation/ReservationFormStore";
import { eventFormStore } from "../../store/event/EventFormStore";
import { userSessionStore } from "../../store/auth/UserSessionStore";
import { spaceStore } from "../../store/space/SpaceStore";
import { equipmentStore } from "../../store/equipment/EquipmentStore";
import { instituteStore } from "../../store/institute/InstituteStore";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import Button from "../../commons/components/Button";
import Toast, { ToastType } from "../../commons/toast/Toast";

import ScheduleStep from "./steps/ScheduleStep";
import LocationStep from "./steps/LocationStep";
import DescriptionStep from "./steps/DescriptionStep";
import MediaStep from "./steps/MediaStep";
import EquipmentStep from "./steps/EquipamentStep";

const ReservationRequestPage = observer(() => {
  const isLoggedIn = userSessionStore.currentUser;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastConfig, setToastConfig] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const bDomain = reservationFormStore.domain;
  const eDomain = eventFormStore.domain;

  const isPublic = eDomain.isPublic;

  // O último passo agora é Equipamentos (4 para privado, 5 para público)
  const lastStep = isPublic ? 5 : 4;

  useEffect(() => {
    reservationFormStore.reset();
    eventFormStore.reset();
    spaceStore.fetchSpaces();

    // Busca os equipamentos do instituto assim que carregar a página
    if (instituteStore.globalId) {
      equipmentStore.fetchStocks(instituteStore.globalId);
    }
  }, [instituteStore.globalId]);

  const showToast = (message: string, type: ToastType = "error") => {
    setToastConfig({ message, type });
  };

  const validateStep = (): boolean => {
    // Validação de Descrição e Mídia
    if (step === 1 || (isPublic && step === 2)) {
      eDomain.validate(step.toString());
      if (Object.keys(eDomain.errors).length > 0) {
        const firstError = Object.values(eDomain.errors)[0] as string;
        showToast(firstError);
        return false;
      }
    }

    // Validação de Agenda
    const isScheduleStep =
      (isPublic && step === 3) || (!isPublic && step === 2);
    if (isScheduleStep && (!bDomain.date || !bDomain.period)) {
      showToast("Selecione a data e o turno da reserva.");
      return false;
    }

    // Validação de Local
    const isLocationStep =
      (isPublic && step === 4) || (!isPublic && step === 3);
    if (isLocationStep && bDomain.roomIds.length === 0) {
      showToast("Selecione pelo menos um local para a reserva.");
      return false;
    }

    return true;
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const savedEvent = await eventFormStore.persist();
      if (savedEvent?.id) {
        bDomain.eventId = savedEvent.id;
        const success = await reservationFormStore.persist(savedEvent.id);
        if (success) {
          showToast("Solicitação enviada com sucesso!", "success");
          setStep(lastStep + 1); // Vai para a tela de sucesso
        } else {
          showToast(
            reservationFormStore.error || "Erro ao processar a reserva.",
          );
        }
      } else {
        showToast(
          eventFormStore.error || "Erro ao criar as informações do evento.",
        );
      }
    } catch (error) {
      showToast("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen font-black uppercase text-slate-400 tracking-widest">
        Verificando sessão...
      </div>
    );
  }

  // Define os itens da sidebar dinamicamente
  const stepsMenu = [
    { label: "Detalhes", num: 1 },
    ...(isPublic ? [{ label: "Mídia", num: 2 }] : []),
    { label: "Agenda", num: isPublic ? 3 : 2 },
    { label: "Local", num: isPublic ? 4 : 3 },
    { label: "Equipamentos", num: isPublic ? 5 : 4 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-main font-system">
      <Header />
      {toastConfig && (
        <Toast
          type={toastConfig.type}
          message={toastConfig.message}
          onClose={() => setToastConfig(null)}
        />
      )}

      <main className="flex-1 flex items-center justify-center py-12 px-5">
        <div className="bg-white w-full max-w-[1100px] rounded-[3rem] shadow-xl overflow-hidden border flex flex-col md:flex-row min-h-[700px]">
          {/* SIDEBAR */}
          <div className="bg-[#1e293b] w-full md:w-[320px] p-10 flex flex-col relative overflow-hidden">
            <h2 className="text-white font-black text-2xl tracking-tighter mb-10 italic flex items-center gap-3">
              <FaRocket className="text-brand-blue" /> SIGEX
            </h2>
            <div className="space-y-8">
              {stepsMenu.map((m) => (
                <div
                  key={m.num}
                  className="flex items-center gap-4 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold border-2 transition-colors 
                    ${step >= m.num ? "bg-white text-slate-900 shadow-xl border-white" : "border-slate-700 text-slate-600"}`}
                  >
                    {m.num}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${step >= m.num ? "text-brand-blue" : "text-slate-600"}`}
                    >
                      Etapa 0{m.num}
                    </span>
                    <span
                      className={`text-sm font-bold ${step >= m.num ? "text-white" : "text-slate-500"}`}
                    >
                      {m.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1 p-8 md:p-16 bg-white flex flex-col">
            <div className="flex-1">
              {step === 1 && <DescriptionStep />}

              {/* Fluxo se for Público */}
              {isPublic && (
                <>
                  {step === 2 && <MediaStep />}
                  {step === 3 && <ScheduleStep occupationData={{}} />}
                  {step === 4 && (
                    <LocationStep
                      rooms={spaceStore.spaces}
                      isLoading={spaceStore.isLoading}
                    />
                  )}
                  {step === 5 && <EquipmentStep />}
                </>
              )}

              {/* Fluxo se for Privado */}
              {!isPublic && (
                <>
                  {step === 2 && <ScheduleStep occupationData={{}} />}
                  {step === 3 && (
                    <LocationStep
                      rooms={spaceStore.spaces}
                      isLoading={spaceStore.isLoading}
                    />
                  )}
                  {step === 4 && <EquipmentStep />}
                </>
              )}

              {/* Tela de Sucesso */}
              {step === lastStep + 1 && (
                <div className="text-center py-20 animate-step">
                  <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6 drop-shadow-lg" />
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter text-brand-dark">
                    Solicitado!
                  </h2>
                  <p className="text-slate-400 mt-4 max-w-xs mx-auto">
                    Sua reserva foi enviada com sucesso e agora está sob análise
                    da coordenação.
                  </p>
                  <Button
                    onClick={() => navigate("/")}
                    className="mt-10 rounded-3xl px-12 py-4 font-black uppercase text-xs"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              )}
            </div>

            {/* BOTÕES DE NAVEGAÇÃO */}
            {step <= lastStep && (
              <div className="mt-auto pt-10 flex justify-between border-t border-slate-50">
                <button
                  onClick={() =>
                    step === 1 ? navigate("/") : setStep((s) => s - 1)
                  }
                  className="text-slate-400 font-black uppercase text-xs flex items-center gap-2 hover:text-brand-dark transition-colors"
                >
                  <FaArrowLeft size={10} /> {step === 1 ? "Cancelar" : "Voltar"}
                </button>

                <Button
                  variant="primary"
                  disabled={isSubmitting}
                  className="rounded-3xl px-12 py-5 font-black text-xs uppercase tracking-widest"
                  onClick={() =>
                    step === lastStep ? handleFinish() : handleNext()
                  }
                >
                  {isSubmitting
                    ? "Enviando..."
                    : step === lastStep
                      ? "Finalizar Solicitação"
                      : "Próximo Passo"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
});

export default ReservationRequestPage;
