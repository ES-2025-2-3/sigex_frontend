import { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

import { userSessionStore } from "../../store/auth/UserSessionStore";
import UserService from "../../services/UserService";

import { FaArrowLeft, FaEnvelope, FaUserCog, FaUserShield } from "react-icons/fa";

type FieldKey = "currentPassword" | "newPassword" | "confirmPassword";
type FieldError = { type: ToastType; message: string };

function getApiMessage(err: any): string {
  const data = err?.response?.data;
  if (typeof data === "string" && data.trim()) return data;

  const msg = data?.message ?? data?.error ?? data?.details;
  if (msg) return String(msg);

  const status = err?.response?.status;
  return status ? `Erro ${status}` : "Erro";
}

const baseInput =
  "w-full bg-transparent outline-none";

const UserInputShellBase =
  "px-5 py-4 rounded-2xl bg-white border font-bold text-sm transition-all";

const AdminProfilePage = observer(() => {
  const navigate = useNavigate();
  const user = userSessionStore.currentUser;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, FieldError>>>({});

  const getRoleLabel = () => {
    if (user?.isAdmin) return "Administrador do Sistema";
    if (user?.isStaff) return "Funcionário (Gestor de Unidade)";
    return "Servidor";
  };

  const fieldClass = useMemo(() => {
    return (field: FieldKey) => {
      const err = errors[field];
      const border =
        err?.type === "error"
          ? "border-red-400 focus-within:ring-4 focus-within:ring-red-500/20"
          : err?.type === "warning"
            ? "border-amber-400 focus-within:ring-4 focus-within:ring-amber-500/20"
            : "border-slate-200 focus-within:ring-4 focus-within:ring-brand-blue/10";
      return `${UserInputShellBase} ${border}`;
    };
  }, [errors]);

  const setFieldError = (field: FieldKey, type: ToastType, message: string) => {
    setErrors((p) => ({ ...p, [field]: { type, message } }));
  };

  const clearFieldError = (field: FieldKey) => {
    setErrors((p) => {
      const n = { ...p };
      delete n[field];
      return n;
    });
  };

  const clearMany = (fields: FieldKey[]) => {
    setErrors((p) => {
      const n = { ...p };
      fields.forEach((f) => delete n[f]);
      return n;
    });
  };

  const FieldErrorText = ({ field }: { field: FieldKey }) => {
    const err = errors[field];
    if (!err) return null;

    const color =
      err.type === "error"
        ? "text-red-600"
        : err.type === "warning"
          ? "text-amber-600"
          : "text-slate-500";

    return <p className={`mt-1 text-[11px] font-bold ${color}`}>{err.message}</p>;
  };

  const validatePassword = () => {
    clearMany(["currentPassword", "newPassword", "confirmPassword"]);

    if (!currentPassword) {
      setToast({ type: "error", message: "Informe a senha atual." });
      setFieldError("currentPassword", "error", "Informe a senha atual.");
      return false;
    }

    if (newPassword.length < 8) {
      setToast({ type: "warning", message: "A nova senha deve ter no mínimo 8 caracteres." });
      setFieldError("newPassword", "warning", "Mínimo de 8 caracteres.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setToast({ type: "warning", message: "As senhas novas não coincidem." });
      setFieldError("confirmPassword", "warning", "As senhas não coincidem.");
      return false;
    }

    return true;
  };

  async function handleChangePassword() {
    if (!validatePassword()) return;

    try {
      setIsSubmitting(true);

      await UserService.changePassword({
        currentPassword,
        newPassword,
      });

      setConfirmOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setToast({ type: "success", message: "Senha alterada com sucesso!" });
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 401) {
        setToast({ type: "error", message: "Senha atual incorreta." });
        setFieldError("currentPassword", "error", "Senha atual incorreta.");
        return;
      }

      setToast({ type: "error", message: getApiMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8fafc]">
        <Header />
        <main className="flex-grow container mx-auto px-6 py-10 max-w-7xl">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 font-bold text-slate-600">
            Usuário não carregado.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-10 max-w-7xl">
        <div className="mb-8 space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-brand-blue font-bold transition-all group text-sm cursor-pointer bg-transparent border-none"
          >
            <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            VOLTAR
          </button>

          <div className="flex items-center gap-2 text-brand-blue mb-1">
            {user?.isAdmin ? <FaUserShield size={14} /> : <FaUserCog size={14} />}
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Perfil de {user?.isAdmin ? "Administrador" : "Gestor"}
            </span>
          </div>

          <h1 className="text-4xl font-black text-[#1e293b] tracking-tighter uppercase">Meus Dados</h1>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Informações da Conta
            </h2>

            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="w-24 h-24 bg-brand-blue rounded-[2rem] text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-brand-blue/20">
                {user?.name?.charAt(0) || "?"}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Nome Completo
                  </label>
                  <p className="px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm text-slate-700">
                    {user?.name ?? "Não informado"}
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Cargo / Identificação
                  </label>
                  <div className="px-5 py-3.5 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 font-black text-[11px] text-brand-blue uppercase tracking-wider">
                    {getRoleLabel()}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    E-mail Institucional
                  </label>
                  <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm text-slate-700">
                    <FaEnvelope className="text-slate-300" />
                    {user?.email ?? "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Segurança e Senha
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className={fieldClass("currentPassword")}>
                  <input
                    type="password"
                    placeholder="Senha Atual"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      clearFieldError("currentPassword");
                    }}
                    className={baseInput}
                  />
                </div>
                <FieldErrorText field="currentPassword" />
              </div>

              <div>
                <div className={fieldClass("newPassword")}>
                  <input
                    type="password"
                    placeholder="Nova Senha"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      clearFieldError("newPassword");
                    }}
                    className={baseInput}
                  />
                </div>
                <FieldErrorText field="newPassword" />
              </div>

              <div>
                <div className={fieldClass("confirmPassword")}>
                  <input
                    type="password"
                    placeholder="Confirmar Nova Senha"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError("confirmPassword");
                    }}
                    className={baseInput}
                  />
                </div>
                <FieldErrorText field="confirmPassword" />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => validatePassword() && setConfirmOpen(true)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-brand-blue transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                Atualizar Senha
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Modal isOpen={confirmOpen} title="Confirmar Alteração" onClose={() => setConfirmOpen(false)}>
        <div className="space-y-6">
          <p className="text-slate-600 font-medium">
            Por motivos de segurança, sua sessão poderá ser reiniciada após a alteração da senha. Deseja continuar?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase text-xs cursor-pointer"
            >
              Cancelar
            </button>

            <button
              disabled={isSubmitting}
              onClick={handleChangePassword}
              className={`px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-brand-blue/20 cursor-pointer ${
                isSubmitting
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-brand-blue text-white"
              }`}
            >
              {isSubmitting ? "Alterando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
});

export default AdminProfilePage;