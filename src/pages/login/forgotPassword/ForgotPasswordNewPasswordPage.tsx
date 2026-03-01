import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HeaderRegister from "../../../commons/header/HeaderRegister";
import Footer from "../../../commons/footer/Footer";
import Button from "../../../commons/components/Button";
import Toast, { ToastType } from "../../../commons/toast/Toast";
import { userSessionStore } from "../../../store/auth/UserSessionStore";

const ForgotPasswordNewPasswordPage: React.FC = observer(() => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem("reset_token");

  useEffect(() => {
    if (!token) {
      navigate("/recuperar-senha/erro");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }

    if (userSessionStore.isLoading) return; 

    try {
      await userSessionStore.resetPassword(token as string, password);
      localStorage.removeItem("reset_token");
      window.location.href = "/recuperar-senha/sucesso";
    } catch (err: any) {
      setToast({
        type: "error",
        message: "O link expirou ou é inválido. Solicite um novo.",
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
              Nova Senha
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Crie uma nova credencial de acesso segura para sua conta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-brand-blue/10 ${
                    error && !password
                      ? "border-red-400"
                      : "border-gray-100 focus:border-brand-blue"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-blue transition-colors"
                >
                  {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError("");
                  }}
                  className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-brand-blue/10 ${
                    error === "As senhas não coincidem"
                      ? "border-red-400"
                      : "border-gray-100 focus:border-brand-blue"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-blue transition-colors"
                >
                  {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <span className="text-red-500 text-xs font-bold ml-2 animate-pulse">
                {error}
              </span>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="rounded-2xl py-5 mt-4 font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-blue/20"
              disabled={userSessionStore.isLoading || !token || success}
            >
              {userSessionStore.isLoading
                ? "PROCESSANDO..."
                : success
                  ? "CONCLUÍDO!"
                  : "ATUALIZAR SENHA"}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
});

export default ForgotPasswordNewPasswordPage;
