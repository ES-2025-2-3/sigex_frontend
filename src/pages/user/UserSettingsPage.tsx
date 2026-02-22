import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import UserBanner from "../../commons/user/UserBanner";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

import { userSessionStore } from "../../store/auth/UserSessionStore";
import { UserType } from "../../domain/enums/UserType";
import UserService from "../../services/UserService";

import { FaEnvelope, FaTrashAlt, FaUserEdit } from "react-icons/fa";

const USER_TYPE_LABEL: Partial<Record<UserType, string>> = {
  [UserType.USUARIO]: "Usuário Comum",
  [UserType.SERVIDOR_TECNICO_ADMINISTRATIVO]: "Servidor Técnico-Administrativo",
};

type FieldKey = "name" | "email" | "currentPassword" | "newPassword" | "confirmPassword";
type FieldError = { type: ToastType; message: string };

function getApiMessage(err: any): string {
  const data = err?.response?.data;
  if (typeof data === "string" && data.trim()) return data;

  const msg = data?.message ?? data?.error ?? data?.details;
  if (msg) return String(msg);

  const status = err?.response?.status;
  return status ? `Erro ${status}` : "Erro";
}

function getFieldErrors(err: any): Partial<Record<string, string>> {
  const data = err?.response?.data;
  const out: Partial<Record<string, string>> = {};

  if (Array.isArray(data?.errors)) {
    for (const e of data.errors) {
      const field = e?.field;
      const msg = e?.defaultMessage ?? e?.message;
      if (field && msg && !out[field]) out[String(field)] = String(msg);
    }
  }

  if (data?.fieldErrors && typeof data.fieldErrors === "object") {
    for (const [k, v] of Object.entries(data.fieldErrors)) {
      if (!out[k] && typeof v === "string") out[k] = v;
    }
  }

  return out;
}

const baseInput =
  "w-full px-4 py-3 rounded-2xl bg-white border font-bold text-sm text-gray-700 outline-none focus:ring-4 focus:ring-brand-blue/10";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

const UserSettingsPage = observer(() => {
  const user = userSessionStore.currentUser;

  const [draftName, setDraftName] = useState(user?.name ?? "");
  const [draftEmail, setDraftEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [confirmProfileOpen, setConfirmProfileOpen] = useState(false);
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const [deleteCountdown, setDeleteCountdown] = useState(5);

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, FieldError>>>({});

  useEffect(() => {
    setDraftName(user?.name ?? "");
    setDraftEmail(user?.email ?? "");
  }, [user?.id, user?.name, user?.email]);

  useEffect(() => {
    if (!deleteAccountOpen) return;

    setDeleteCountdown(5);
    const interval = setInterval(() => {
      setDeleteCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [deleteAccountOpen]);

  const fieldClass = useMemo(() => {
    return (field: FieldKey, extra = "") => {
      const err = errors[field];
      const border =
        err?.type === "error"
          ? "border-red-400 focus:ring-red-500/15"
          : err?.type === "warning"
            ? "border-amber-400 focus:ring-amber-500/15"
            : "border-gray-200";
      return `${baseInput} ${border} ${extra}`.trim();
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
      err.type === "error" ? "text-red-600" : err.type === "warning" ? "text-amber-600" : "text-slate-500";

    return <p className={`mt-1 text-[11px] font-bold ${color}`}>{err.message}</p>;
  };

  const validateProfile = () => {
    clearMany(["name", "email"]);

    const name = draftName.trim();
    const email = draftEmail.trim();

    if (!name) {
      setToast({ type: "error", message: "O nome não pode estar em branco." });
      setFieldError("name", "error", "O nome não pode estar em branco.");
      return false;
    }

    if (!email) {
      setToast({ type: "error", message: "O e-mail não pode estar em branco." });
      setFieldError("email", "error", "O e-mail não pode estar em branco.");
      return false;
    }

    if (!isValidEmail(email)) {
      setToast({ type: "warning", message: "Informe um e-mail válido." });
      setFieldError("email", "warning", "Informe um e-mail válido.");
      return false;
    }

    return true;
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

  const handleUpdateProfile = async () => {
    if (!user?.id) return;
    if (!validateProfile()) return;

    try {
      const payload = { name: draftName.trim(), email: draftEmail.trim() };
      const updated = await UserService.update(user.id, payload);

      userSessionStore.currentUser?.setData(updated);

      const stored = localStorage.getItem("sigex_user_data");
      if (stored) {
        localStorage.setItem("sigex_user_data", JSON.stringify({ ...JSON.parse(stored), ...updated }));
      }

      setConfirmProfileOpen(false);
      setToast({ type: "success", message: "Dados atualizados com sucesso!" });
    } catch (err: any) {
      const msg = getApiMessage(err);
      setToast({ type: "error", message: msg });

      const fm = getFieldErrors(err);
      if (fm.name) setFieldError("name", "error", fm.name);
      if (fm.email) setFieldError("email", "error", fm.email);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    try {
      await UserService.changePassword({
        currentPassword,
        newPassword,
      });

      setConfirmPasswordOpen(false);
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
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    try {
      await UserService.delete(user.id);
      userSessionStore.logout();
      window.location.href = "/login";
    } catch (err: any) {
      setToast({ type: "error", message: getApiMessage(err) });
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-main">
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
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-10 max-w-7xl">
        <UserBanner />

        <div className="mb-8">
          <div className="flex items-center gap-2 text-brand-blue mb-1">
            <FaUserEdit size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Configurações da Conta</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Meus Dados</h1>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Dados Pessoais</h2>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-20 h-20 bg-brand-blue rounded-2xl text-white flex items-center justify-center text-2xl font-black select-none">
                {draftName.trim().charAt(0) || "?"}
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
                    {user.type && USER_TYPE_LABEL[user.type]}
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
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-xs hover:bg-brand-blue transition-all cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Alterar Senha</h2>

            <div>
              <input
                type="password"
                placeholder="Senha Atual"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
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
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
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
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                className={fieldClass("confirmPassword")}
              />
              <FieldErrorText field="confirmPassword" />
            </div>

            <button
              onClick={() => validatePassword() && setConfirmPasswordOpen(true)}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase text-sm hover:bg-brand-blue transition-all cursor-pointer"
            >
              Confirmar Alteração
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <button
              onClick={() => setDeleteAccountOpen(true)}
              className="w-full py-3.5 bg-red-600 text-white rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all cursor-pointer"
            >
              <FaTrashAlt />
              Excluir Conta
            </button>
          </div>
        </div>
      </main>

      <Footer />

      <Modal isOpen={confirmProfileOpen} title="Confirmar Alteração" onClose={() => setConfirmProfileOpen(false)}>
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

      <Modal isOpen={confirmPasswordOpen} title="Alterar Senha" onClose={() => setConfirmPasswordOpen(false)}>
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

      <Modal isOpen={deleteAccountOpen} title="Excluir Conta" onClose={() => setDeleteAccountOpen(false)}>
        <p className="text-sm mb-4">Esta ação é irreversível. Sua conta será excluída permanentemente.</p>

        <p className="text-xs text-red-500 font-bold mb-6">Confirmação disponível em {deleteCountdown}s</p>

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
              deleteCountdown > 0 ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 cursor-pointer"
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