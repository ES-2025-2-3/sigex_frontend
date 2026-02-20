import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

import { userSessionStore } from "../../store/auth/UserSessionStore";
import UserService from "../../services/UserService";

import { FaEnvelope, FaUserShield, FaUserCog, FaArrowLeft } from "react-icons/fa";

type FieldKey = "currentPassword" | "newPassword" | "confirmPassword";
type FieldError = { type: ToastType; message: string };

const AdminProfilePage = observer(() => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const user = userSessionStore.currentUser;

  const [draftCurrentPassword, setDraftCurrentPassword] = useState("");
  const [draftNewPassword, setDraftNewPassword] = useState("");
  const [draftConfirmPassword, setDraftConfirmPassword] = useState("");

  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(
    null
  );

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldKey, FieldError>>
  >({});

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (type: ToastType, message: string) => setToast({ type, message });

  const getRoleLabel = () => {
    if (user?.isAdmin) return "Administrador do Sistema";
    if (user?.isStaff) return "Funcionário (Gestor de Unidade)";
    return "Servidor";
  };

  function setFieldError(field: FieldKey, type: ToastType, message: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: { type, message } }));
  }

  function resetPasswordErrors() {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.currentPassword;
      delete next.newPassword;
      delete next.confirmPassword;
      return next;
    });
  }

  const FieldErrorText = ({ field }: { field: FieldKey }) => {
    const err = fieldErrors[field];
    if (!err) return null;

    const color =
      err.type === "error"
        ? "text-red-600"
        : err.type === "warning"
          ? "text-amber-600"
          : "text-slate-500";

    return <p className={`mt-1 text-[11px] font-bold ${color}`}>{err.message}</p>;
  };

  const validatePasswordChange = () => {
    resetPasswordErrors();

    let ok = true;

    if (!draftCurrentPassword) {
      setFieldError("currentPassword", "error", "Informe a senha atual.");
      showToast("error", "Informe a senha atual.");
      ok = false;
    }

    if (draftNewPassword.length < 8) {
      setFieldError("newPassword", "warning", "Mínimo de 8 caracteres.");
      showToast("warning", "A nova senha deve ter no mínimo 8 caracteres.");
      ok = false;
    }

    if (draftNewPassword !== draftConfirmPassword) {
      setFieldError("confirmPassword", "warning", "As senhas não coincidem.");
      showToast("warning", "As senhas novas não coincidem.");
      ok = false;
    }

    return ok;
  };

  async function handleConfirmChangePassword() {
    if (!validatePasswordChange()) return;

    try {
      setIsChangingPassword(true);

      await UserService.changePassword({
        currentPassword: draftCurrentPassword,
        newPassword: draftNewPassword,
      });

      setConfirmPasswordOpen(false);

      setDraftCurrentPassword("");
      setDraftNewPassword("");
      setDraftConfirmPassword("");

      showToast("success", "Senha alterada com sucesso!");
    } catch (err: any) {
      console.error(
        "Erro ao alterar senha:",
        err?.response?.status,
        err?.response?.data,
        err
      );

      const msg =
        err?.response?.data?.message ??
        "Erro ao alterar senha. Verifique a senha atual e tente novamente.";

      showToast("error", msg);


      if (String(msg).toLowerCase().includes("atual")) {
        setFieldError("currentPassword", "error", "Senha atual incorreta.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-10 max-w-7xl">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <LoadingSpinner size="medium" />
          </div>
        ) : (
          <>
            <div className="mb-8 space-y-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-brand-blue font-bold transition-all group text-sm cursor-pointer bg-transparent border-none"
              >
                <FaArrowLeft
                  size={12}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                VOLTAR PARA O INÍCIO
              </button>

              <div className="flex items-center gap-2 text-brand-blue mb-1">
                {user?.isAdmin ? <FaUserShield size={14} /> : <FaUserCog size={14} />}
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Perfil de {user?.isAdmin ? "Administrador" : "Gestor"}
                </span>
              </div>

              <h1 className="text-4xl font-black text-[#1e293b] tracking-tighter uppercase">
                Meus Dados
              </h1>
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
                    <div className="px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-sm transition-all focus-within:ring-4 focus-within:ring-brand-blue/10">
                      <input
                        type="password"
                        placeholder="Senha Atual"
                        value={draftCurrentPassword}
                        onChange={(e) => setDraftCurrentPassword(e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <FieldErrorText field="currentPassword" />
                  </div>

                  <div>
                    <div className="px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-sm transition-all focus-within:ring-4 focus-within:ring-brand-blue/10">
                      <input
                        type="password"
                        placeholder="Nova Senha"
                        value={draftNewPassword}
                        onChange={(e) => setDraftNewPassword(e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <FieldErrorText field="newPassword" />
                  </div>

                  <div>
                    <div className="px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-sm transition-all focus-within:ring-4 focus-within:ring-brand-blue/10">
                      <input
                        type="password"
                        placeholder="Confirmar Nova Senha"
                        value={draftConfirmPassword}
                        onChange={(e) => setDraftConfirmPassword(e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <FieldErrorText field="confirmPassword" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => validatePasswordChange() && setConfirmPasswordOpen(true)}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-brand-blue transition-all shadow-lg active:scale-95 cursor-pointer"
                  >
                    Atualizar Senha
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />

      <Modal
        isOpen={confirmPasswordOpen}
        title="Confirmar Alteração"
        onClose={() => setConfirmPasswordOpen(false)}
      >
        <div className="space-y-6">
          <p className="text-slate-600 font-medium">
            Por motivos de segurança, sua sessão poderá ser reiniciada após a
            alteração da senha. Deseja continuar?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmPasswordOpen(false)}
              className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              disabled={isChangingPassword}
              onClick={handleConfirmChangePassword}
              className={`px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-brand-blue/20 cursor-pointer ${
                isChangingPassword
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-brand-blue text-white"
              }`}
            >
              {isChangingPassword ? "Alterando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
});

export default AdminProfilePage;
