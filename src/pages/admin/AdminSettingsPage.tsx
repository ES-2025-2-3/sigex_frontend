import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTools, FaServer, FaBuilding } from "react-icons/fa";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import Header from "../../commons/header/Header";
import Toast, { ToastType } from "../../commons/toast/Toast";
import { instituteStore } from "../../store/institute/InstituteStore";
import LoadingSpinner from "../../commons/components/LoadingSpinner";

const AdminSettingsPage = observer(() => {
  const { current: institute, isLoading, globalId } = instituteStore;

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    instituteStore.fetchDetails();
  }, []);

  const toggleMaintenance = () => {
    const newValue = !isMaintenanceMode;
    setIsMaintenanceMode(newValue);
    setToast({
      type: newValue ? "warning" : "success",
      message: newValue ? "Modo de manutenção ativado." : "Sistema online.",
    });
  };

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
          <div className="w-full max-w-4xl space-y-8">
            <header>
              <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">
                Sistema
              </p>
              <h1 className="text-4xl font-black text-[#1e293b] tracking-tighter uppercase leading-none">
                Configurações
              </h1>
              <h2 className="mt-4 text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 italic">
                Parâmetros globais e status da unidade
              </h2>
            </header>

            <div className="grid gap-6">
              <section className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <LoadingSpinner size="small" />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-9 h-9 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                    <FaBuilding className="text-brand-blue" size={16} />
                  </div>
                  <h2 className="text-md font-black text-slate-800 uppercase tracking-tight">
                    Dados da Unidade
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Instituição
                    </label>
                    <p className="text-sm font-bold text-slate-700">
                      {institute?.name || "---"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Sigla
                    </label>
                    <p className="text-sm font-bold text-slate-700 uppercase">
                      {institute?.acronym || "---"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Contato
                    </label>
                    <p className="text-sm font-bold text-slate-700">
                      {institute?.contactPhone || "---"}
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                      <FaTools className="text-amber-600" size={16} />
                    </div>
                    <h2 className="text-md font-black text-slate-800 uppercase tracking-tight">
                      Status
                    </h2>
                  </div>
                  <div
                    onClick={toggleMaintenance}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-600">
                      Modo de Manutenção
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors ${isMaintenanceMode ? "bg-amber-500" : "bg-slate-300"}`}
                    >
                      <div
                        className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isMaintenanceMode ? "left-6" : "left-1"}`}
                      ></div>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <FaServer className="text-emerald-600" size={16} />
                    </div>
                    <h2 className="text-md font-black text-slate-800 uppercase tracking-tight">
                      Servidor
                    </h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                      <span>API Status</span>
                      <span className="text-emerald-500 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>{" "}
                        Online
                      </span>
                    </div>
                    <div className="text-[10px] font-bold uppercase text-slate-400 truncate">
                      ID: {globalId || "Não identificado"}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <footer className="flex justify-center pt-4">
              <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">
                <FaCheckCircle className="text-emerald-500" /> Sigex System
                v1.0.2
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
});

export default AdminSettingsPage;
