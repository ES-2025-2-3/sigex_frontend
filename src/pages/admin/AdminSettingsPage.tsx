import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FaCheckCircle, FaTools, FaServer } from "react-icons/fa";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import Header from "../../commons/header/Header";
import Toast, { ToastType } from "../../commons/toast/Toast";

const AdminSettingsPage = observer(() => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const toggleMaintenance = () => {
    const newValue = !isMaintenanceMode;
    setIsMaintenanceMode(newValue);
    
    setToast({
      type: newValue ? "warning" : "success",
      message: newValue 
        ? "Modo de manutenção ativado. O acesso está restrito à gestão." 
        : "Sistema online. Todos os usuários podem acessar os eventos.",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full font-inter">
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
          <div className="w-full max-w-4xl space-y-10">
            <header>
              <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">
                Sistema
              </p>
              <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase">
                Configurações
              </h1>
            </header>

            <div className="grid gap-6">
              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <FaTools className="text-amber-600" size={18} />
                  </div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Disponibilidade
                  </h2>
                </div>

                <div className="space-y-4">
                  <div 
                    onClick={toggleMaintenance}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:border-amber-200 transition-all group"
                  >
                    <div>
                      <p className="font-extrabold text-slate-700 text-sm uppercase tracking-tight">
                        Modo de Manutenção
                      </p>
                      <p className="text-xs text-slate-500 font-bold mt-1">
                        {isMaintenanceMode 
                          ? "O sistema está visível apenas para administradores." 
                          : "O sistema está aberto para solicitações de reserva."}
                      </p>
                    </div>

                    <div className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${isMaintenanceMode ? 'bg-amber-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${isMaintenanceMode ? 'left-8' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                    <FaServer className="text-brand-blue" size={18} />
                  </div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Infraestrutura
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Conexão Backend</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-bold text-slate-700">API Online</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Banco de Dados</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-bold text-slate-700">Conectado (PostgreSQL)</span>
                        </div>
                    </div>
                </div>
              </section>
            </div>
            
            <footer className="flex justify-center pt-4">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <FaCheckCircle className="text-emerald-500" /> Sigex System v1.0.2
                </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
});

export default AdminSettingsPage;
