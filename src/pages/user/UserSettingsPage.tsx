import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";
import UserBanner from "../../commons/user/UserBanner";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

import { userSessionStore } from "../../store/user/UserSessionStore";
import { UserType } from "../../domain/enums/UserType";

import { FaUserEdit, FaEnvelope, FaTrashAlt } from "react-icons/fa";

const USER_TYPE_LABEL: Partial<Record<UserType, string>> = {
  [UserType.DOCENTE]: "Docente",
  [UserType.SERVIDOR_TECNICO_ADMINISTRATIVO]:
    "Servidor Técnico-Administrativo",
};

const UserSettingsPage = observer(() => {
  const [loading, setLoading] = useState(true);
  const user = userSessionStore.currentUser;

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [draftCurrentPassword, setDraftCurrentPassword] = useState("");
  const [draftNewPassword, setDraftNewPassword] = useState("");
  const [draftConfirmPassword, setDraftConfirmPassword] = useState("");

  const [confirmProfileOpen, setConfirmProfileOpen] = useState(false);
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const [deleteCountdown, setDeleteCountdown] = useState(5);

  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (confirmProfileOpen) {
      setDraftName(name);
      setDraftEmail(email);
    }
  }, [confirmProfileOpen, name, email]);

  useEffect(() => {
    if (confirmPasswordOpen) {
      setDraftCurrentPassword(currentPassword);
      setDraftNewPassword(newPassword);
      setDraftConfirmPassword(confirmPassword);
    }
  }, [confirmPasswordOpen]);

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

  function validateProfile() {
    if (!draftName.trim()) {
      showToast("error", "O nome não pode estar em branco.");
      return false;
    }

    if (!draftEmail.trim()) {
      showToast("error", "O e-mail não pode estar em branco.");
      return false;
    }

    if (!isValidEmail(draftEmail)) {
      showToast("warning", "Informe um e-mail válido.");
      return false;
    }

    return true;
  }

  function validatePassword() {
    if (!draftCurrentPassword) {
      showToast("error", "Informe a senha atual.");
      return false;
    }

    if (draftNewPassword.length < 8) {
      showToast("warning", "A nova senha deve ter no mínimo 8 caracteres.");
      return false;
    }

    if (draftNewPassword !== draftConfirmPassword) {
      showToast("warning", "As senhas novas não coincidem.");
      return false;
    }

    const senhaAtualCorreta = true;
    if (!senhaAtualCorreta) {
      showToast("error", "Senha atual incorreta.");
      return false;
    }

    return true;
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-10 max-w-7xl">
        <UserBanner />

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
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
              <h1 className="text-3xl font-bold text-text-primary">
                Meus Dados
              </h1>
            </div>

            <div className="space-y-8">
              {/* Dados pessoais */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Dados Pessoais
                </h2>

                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-brand-blue rounded-2xl text-white flex items-center justify-center text-2xl font-black select-none">
                      {draftName.charAt(0) || "?"}
                    </div>

                    <button
                      className="
                        absolute -bottom-2 -right-2 z-10
                        p-2 bg-white border border-slate-300 rounded-lg
                        text-brand-blue shadow-sm
                        hover:bg-brand-blue/5 transition-all
                        focus:outline-none focus:ring-4 focus:ring-brand-blue/10
                      "
                    >
                      <FaUserEdit size={12} />
                    </button>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Nome Completo
                      </label>
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="mt-1 w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 font-bold text-sm text-gray-700 outline-none focus:ring-4 focus:ring-brand-blue/10"
                      />
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
                          onChange={(e) => setDraftEmail(e.target.value)}
                          className="pl-11 pr-4 py-3 w-full rounded-2xl bg-white border border-gray-200 font-bold text-sm text-gray-700 outline-none focus:ring-4 focus:ring-brand-blue/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (validateProfile()) {
                        setConfirmProfileOpen(true);
                      }
                    }}
                    className="px-6 py-3 bg-brand-blue text-white rounded-xl font-black uppercase text-xs"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>

              {/* Alterar senha */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Alterar Senha
                </h2>

                {[
                  {
                    placeholder: "Senha Atual",
                    value: draftCurrentPassword,
                    onChange: setDraftCurrentPassword,
                  },
                  {
                    placeholder: "Nova Senha",
                    value: draftNewPassword,
                    onChange: setDraftNewPassword,
                  },
                  {
                    placeholder: "Confirmar Nova Senha",
                    value: draftConfirmPassword,
                    onChange: setDraftConfirmPassword,
                  },
                ].map((field, i) => (
                  <input
                    key={i}
                    type="password"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 font-bold text-sm text-gray-700 outline-none focus:ring-4 focus:ring-brand-blue/10"
                  />
                ))}

                <button
                  onClick={() => {
                    if (validatePassword()) {
                      setConfirmPasswordOpen(true);
                    }
                  }}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase text-sm"
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
        <p className="text-sm mb-6">
          Deseja confirmar a alteração dos seus dados pessoais?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmProfileOpen(false)}
            className="px-4 py-2 font-bold text-slate-500"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              setName(draftName);
              setEmail(draftEmail);
              setConfirmProfileOpen(false);
              showToast("success", "Dados atualizados com sucesso!");
            }}
            className="px-6 py-2 bg-brand-blue text-white rounded-lg font-bold"
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
        <p className="text-sm mb-6">
          Tem certeza que deseja alterar sua senha?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmPasswordOpen(false)}
            className="px-4 py-2 font-bold text-slate-500"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!validatePassword()) return;

              setCurrentPassword(draftCurrentPassword);
              setNewPassword(draftNewPassword);
              setConfirmPassword(draftConfirmPassword);
              setConfirmPasswordOpen(false);

              showToast("success", "Senha alterada com sucesso!");
            }}
            className="px-6 py-2 bg-brand-blue text-white rounded-lg font-bold"
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
            className="px-4 py-2 font-bold text-slate-500"
          >
            Cancelar
          </button>

          <button
            disabled={deleteCountdown > 0}
            className={`px-6 py-2 rounded-lg font-bold text-white transition ${
              deleteCountdown > 0
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Excluir
          </button>
        </div>
      </Modal>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
});

export default UserSettingsPage;
