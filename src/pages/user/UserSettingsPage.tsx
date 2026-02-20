import { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";
import UserBanner from "../../commons/user/UserBanner";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

import { userSessionStore } from "../../store/auth/UserSessionStore";
import { UserType } from "../../domain/enums/UserType";
import UserService from "../../services/UserService";

import { FaUserEdit, FaEnvelope, FaTrashAlt } from "react-icons/fa";

const USER_TYPE_LABEL: Partial<Record<UserType, string>> = {
  [UserType.USUARIO]: "Usuário Comum",
  [UserType.SERVIDOR_TECNICO_ADMINISTRATIVO]: "Servidor Técnico-Administrativo",
};

type FieldKey =
  | "name"
  | "email"
  | "currentPassword"
  | "newPassword"
  | "confirmPassword";

type FieldError = { type: ToastType; message: string };

const UserSettingsPage = observer(() => {
  const user = userSessionStore.currentUser;

  const [loading, setLoading] = useState(true);

  const [draftName, setDraftName] = useState(user?.name ?? "");
  const [draftEmail, setDraftEmail] = useState(user?.email ?? "");

  const [draftCurrentPassword, setDraftCurrentPassword] = useState("");
  const [draftNewPassword, setDraftNewPassword] = useState("");
  const [draftConfirmPassword, setDraftConfirmPassword] = useState("");

  const [confirmProfileOpen, setConfirmProfileOpen] = useState(false);
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const [deleteCountdown, setDeleteCountdown] = useState(5);

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, FieldError>>>(
    {}
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setDraftName(user?.name ?? "");
    setDraftEmail(user?.email ?? "");
  }, [user?.id, user?.name, user?.email]);

  useEffect(() => {
    if (!deleteAccountOpen) return;

    setDeleteCountdown(5);
    const interval = setInterval(() => {
      setDeleteCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [deleteAccountOpen]);

  function showToast(type: ToastType, message: string) {
    setToast({ type, message });
  }

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function clearFieldError(field: FieldKey) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function setFieldError(field: FieldKey, type: ToastType, message: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: { type, message } }));
  }

  const baseInputClass =
    "w-full px-4 py-3 rounded-2xl bg-white border font-bold text-sm text-gray-700 outline-none focus:ring-4 focus:ring-brand-blue/10";

  function fieldClass(field: FieldKey, extra?: string) {
    const err = fieldErrors[field];
    const border =
      err?.type === "error"
        ? "border-red-400 focus:ring-red-500/15"
        : err?.type === "warning"
          ? "border-amber-400 focus:ring-amber-500/15"
          : "border-gray-200";
    return `${baseInputClass} ${border} ${extra ?? ""}`;
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

    return (
      <p className={`mt-1 text-[11px] font-bold ${color}`}>
        {err.message}
      </p>
    );
  };

  function validateProfile() {
    let ok = true;
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.name;
      delete next.email;
      return next;
    });

    if (!draftName.trim()) {
      setFieldError("name", "error", "O nome não pode estar em branco.");
      showToast("error", "O nome não pode estar em branco.");
      ok = false;
    }

    if (!draftEmail.trim()) {
      setFieldError("email", "error", "O e-mail não pode estar em branco.");
      showToast("error", "O e-mail não pode estar em branco.");
      ok = false;
    } else if (!isValidEmail(draftEmail)) {
      setFieldError("email", "warning", "Informe um e-mail válido.");
      showToast("warning", "Informe um e-mail válido.");
      ok = false;
    }

    return ok;
  }

  function validatePassword() {
    let ok = true;
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.currentPassword;
      delete next.newPassword;
      delete next.confirmPassword;
      return next;
    });

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
  }

  async function handleUpdateProfile() {
    if (!user?.id) return;

    if (!validateProfile()) return;

    try {
      const updated = await UserService.update(user.id, {
        name: draftName.trim(),
        email: draftEmail.trim(),
      });

      userSessionStore.currentUser?.setData(updated);

      const stored = localStorage.getItem("sigex_user_data");
      if (stored) {
        localStorage.setItem(
          "sigex_user_data",
          JSON.stringify({ ...JSON.parse(stored), ...updated })
        );
      }

      setConfirmProfileOpen(false);
      showToast("success", "Dados atualizados com sucesso!");
    } catch (err: any) {
      console.error("Erro ao atualizar:", err?.response?.status, err?.response?.data, err);

      const msg = err?.response?.data?.message ?? "Erro ao atualizar dados, tente outro e-mail.";
      showToast("error", msg);
    }
  }

  async function handleChangePassword() {
    if (!validatePassword()) return;

    try {
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
      console.error("Erro ao alterar senha:", err?.response?.status, err?.response?.data, err);
      showToast("error", "Erro ao alterar senha. Verifique se sua senha atual está correta");
    }
  }

  async function handleDeleteAccount() {
    if (!user?.id) return;

    try {
      await UserService.delete(user.id);
      userSessionStore.logout();
      window.location.href = "/login";
    } catch (err: any) {
      console.error("Erro ao excluir conta:", err?.response?.status, err?.response?.data, err);
      showToast("error", "Erro ao excluir conta.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-10 max-w-7xl">
        <UserBanner />

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <LoadingSpinner size="medium" />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 text-brand-blue mb-1">
                <FaUserEdit size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Configurações da Conta
                </span>
              </div>
              <h1 className="text-3xl font-bold text-text-primary">Meus Dados</h1>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Dados Pessoais
                </h2>

                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-20 h-20 bg-brand-blue rounded-2xl text-white flex items-center justify-center text-2xl font-black select-none">
                    {draftName.charAt(0) || "?"}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Nome Completo
                      </label>
                      <input
                        value={draftName}
                        onChange={(e) => {
                          setDraftName(e.target.value);
                          clearFieldError("name");
                        }}
                        className={fieldClass("name", "mt-1")}
                      />
                      <FieldErrorText field="name" />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Identificação
                      </label>
                      <div className="mt-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm text-slate-600">
                        {user?.type && USER_TYPE_LABEL[user.type]}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        E-mail
                      </label>
                      <div className="relative mt-1">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={draftEmail}
                          onChange={(e) => {
                            setDraftEmail(e.target.value);
                            clearFieldError("email");
                          }}
                          className={fieldClass("email", "pl-11 pr-4")}
                        />
                      </div>
                      <FieldErrorText field="email" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => validateProfile() && setConfirmProfileOpen(true)}
                    className="px-6 py-3 bg-brand-blue text-white rounded-xl font-black uppercase text-xs cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Alterar Senha
                </h2>

                <div>
                  <input
                    type="password"
                    placeholder="Senha Atual"
                    value={draftCurrentPassword}
                    onChange={(e) => {
                      setDraftCurrentPassword(e.target.value);
                      clearFieldError("currentPassword");
                    }}
                    className={fieldClass("currentPassword")}
                  />
                  <FieldErrorText field="currentPassword" />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Nova Senha"
                    value={draftNewPassword}
                    onChange={(e) => {
                      setDraftNewPassword(e.target.value);
                      clearFieldError("newPassword");
                    }}
                    className={fieldClass("newPassword")}
                  />
                  <FieldErrorText field="newPassword" />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Confirmar Nova Senha"
                    value={draftConfirmPassword}
                    onChange={(e) => {
                      setDraftConfirmPassword(e.target.value);
                      clearFieldError("confirmPassword");
                    }}
                    className={fieldClass("confirmPassword")}
                  />
                  <FieldErrorText field="confirmPassword" />
                </div>

                <button
                  onClick={() => validatePassword() && setConfirmPasswordOpen(true)}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase text-sm cursor-pointer"
                >
                  Confirmar Alteração
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <button
                  onClick={() => setDeleteAccountOpen(true)}
                  className="w-full py-3.5 bg-red-600 text-white rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaTrashAlt />
                  Excluir Conta
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />

      <Modal
        isOpen={confirmProfileOpen}
        title="Confirmar Alteração"
        onClose={() => setConfirmProfileOpen(false)}
      >
        <p className="text-sm mb-6">Deseja confirmar a alteração dos seus dados pessoais?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmProfileOpen(false)}
            className="px-4 py-2 font-bold text-slate-500 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpdateProfile}
            className="px-6 py-2 bg-brand-blue text-white rounded-lg font-bold cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={confirmPasswordOpen}
        title="Alterar Senha"
        onClose={() => setConfirmPasswordOpen(false)}
      >
        <p className="text-sm mb-6">Tem certeza que deseja alterar sua senha?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmPasswordOpen(false)}
            className="px-4 py-2 font-bold text-slate-500 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleChangePassword}
            className="px-6 py-2 bg-brand-blue text-white rounded-lg font-bold cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={deleteAccountOpen}
        title="Excluir Conta"
        onClose={() => setDeleteAccountOpen(false)}
      >
        <p className="text-sm mb-4">
          Esta ação é irreversível. Sua conta será excluída permanentemente.
        </p>

        <p className="text-xs text-red-500 font-bold mb-6">
          Confirmação disponível em {deleteCountdown}s
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteAccountOpen(false)}
            className="px-4 py-2 font-bold text-slate-500 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            disabled={deleteCountdown > 0}
            onClick={handleDeleteAccount}
            className={`px-6 py-2 rounded-lg font-bold text-white transition ${
              deleteCountdown > 0
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 cursor-pointer"
            }`}
          >
            Excluir
          </button>
        </div>
      </Modal>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
});

export default UserSettingsPage;