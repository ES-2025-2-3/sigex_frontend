import { observer } from "mobx-react-lite";
import { FaShieldAlt, FaDatabase } from "react-icons/fa";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import Header from "../../commons/header/Header";

const AdminSettingsPage = observer(() => {
  return (
    <div className="flex min-h-screen bg-bg-main w-full font-inter">
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
                  <FaShieldAlt className="text-brand-blue" size={20} />
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Segurança e Acesso
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <p className="font-bold text-slate-700 text-sm">
                        Permitir auto-cadastro de usuários
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Novos usuários podem criar conta sem aprovação
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm opacity-60">
                <div className="flex items-center gap-3 mb-6">
                  <FaDatabase className="text-slate-400" size={20} />
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Manutenção de Dados
                  </h2>
                </div>
                <p className="text-sm font-bold text-slate-500 italic uppercase">
                  Configurações de backup e logs em desenvolvimento...
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});

export default AdminSettingsPage;
