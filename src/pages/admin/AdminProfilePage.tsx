import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import LoadingSpinner from "../../commons/components/LoadingSpinner";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

import { userSessionStore } from "../../store/user/UserSessionStore";

import { FaUserEdit, FaEnvelope } from "react-icons/fa";

const AdminProfilePage = observer(() => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const user = userSessionStore.currentUser;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [draftCurrentPassword, setDraftCurrentPassword] = useState("");
  const [draftNewPassword, setDraftNewPassword] = useState("");
  const [draftConfirmPassword, setDraftConfirmPassword] = useState("");

  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);

  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (confirmPasswordOpen) {
      setDraftCurrentPassword(currentPassword);
      setDraftNewPassword(newPassword);
      setDraftConfirmPassword(confirmPassword);
    }
  }, [confirmPasswordOpen]);

  function showToast(type: ToastType, message: string) {
    setToast({ type, message });
  }

  function validatePasswordChange() {
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
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <LoadingSpinner size="medium" />
          </div>
        ) : (
          <>
            <div className="mb-8 space-y-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue text-sm font-bold text-brand-blue hover:bg-brand-blue/10 transition-all"
              >
                ← Voltar para início
              </button>

              <div className="flex items-center gap-2 text-brand-blue mb-1">
                <FaUserEdit size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Configurações da Conta
                </span>
              </div>

              <h1 className="text-3xl font-bold text-text-primary">
                Dados do Administrador
              </h1>
            </div>

            <div className="space-y-8">
              {/* DADOS PESSOAIS */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Dados Pessoais
                </h2>

                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-20 h-20 bg-brand-blue rounded-2xl text-white flex items-center justify-center text-2xl font-black">
                    {user?.name?.charAt(0) || "?"}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Nome Completo
                      </label>
                      <input
                        value={user?.name ?? ""}
                        disabled
                        className="mt-1 w-full px-4 py-3 rounded-2xl bg-slate-100 border border-gray-200 font-bold text-sm text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Identificação
                      </label>
                      <div className="mt-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm text-slate-600">
                        Administrador
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        E-mail
                      </label>
                      <div className="relative mt-1">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={user?.email ?? ""}
                          disabled
                          className="pl-11 pr-4 py-3 w-full rounded-2xl bg-slate-100 border border-gray-200 font-bold text-sm text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ALTERAR SENHA */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Alterar Senha
                </h2>

                {[{
                  placeholder: "Senha Atual",
                  value: draftCurrentPassword,
                  setter: setDraftCurrentPassword
                },{
                  placeholder: "Nova Senha",
                  value: draftNewPassword,
                  setter: setDraftNewPassword
                },{
                  placeholder: "Confirmar Nova Senha",
                  value: draftConfirmPassword,
                  setter: setDraftConfirmPassword
                }].map((field, i) => (
                  <input
                    key={i}
                    type="password"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 font-bold text-sm focus:ring-4 focus:ring-brand-blue/10"
                  />
                ))}

                <button
                  onClick={() => validatePasswordChange() && setConfirmPasswordOpen(true)}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase text-sm"
                >
                  Confirmar Alteração
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />

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

export default AdminProfilePage;
