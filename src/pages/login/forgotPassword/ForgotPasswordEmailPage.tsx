import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import HeaderRegister from "../../../commons/header/HeaderRegister";
import Footer from "../../../commons/footer/Footer";
import Button from "../../../commons/components/Button";
import Toast, { ToastType } from "../../../commons/toast/Toast";
import { userSessionStore } from "../../../store/auth/UserSessionStore";
import { useNavigate } from "react-router-dom";

const ForgotPasswordEmailPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || userSessionStore.isLoading) return;

    try {
      await userSessionStore.forgotPassword(email);
      console.log("Sucesso no Java! Redirecionando...");
      window.location.href = "/recuperar-senha/email-enviado";
    } catch (err: any) {
      console.error("Erro capturado:", err);
      setToast({
        type: "error",
        message: "E-mail não encontrado ou erro no servidor.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-main font-system">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <HeaderRegister />

      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="bg-white w-full max-w-[550px] rounded-[40px] p-10 md:p-14 shadow-2xl border border-gray-50 transition-all">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-brand-dark uppercase italic tracking-tighter">
              Recuperar senha
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Informe seu e-mail institucional (@ufcg) para receber o link de
              acesso.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                E-mail Institucional
              </label>
              <input
                type="email"
                placeholder="exemplo@ccc.ufcg.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all font-medium text-slate-700"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="rounded-2xl py-5 font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-blue/20"
              disabled={userSessionStore.isLoading}
            >
              {userSessionStore.isLoading
                ? "PROCESSANDO..."
                : "ENVIAR LINK DE RECUPERAÇÃO"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.history.back()}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors underline underline-offset-4"
            >
              Voltar para o login
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
});

export default ForgotPasswordEmailPage;
