import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import Header from "../../commons/header/Header";
import AdminSidebar from '../../commons/admin/AdminSidebar';
import Footer from '../../commons/footer/Footer';
import Modal from '../../commons/modal/Modal';
import Toast, { ToastType } from '../../commons/toast/Toast';

const AdminSettingsPage = observer(() => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  const handleOpenModal = () => {
    //mock da senha atual do sistema
    const systemCurrentPassword = 'admin123';

    if (currentPassword !== systemCurrentPassword) {
      showToast('error', 'A senha atual está incorreta.');
      return;
    }

    if (newPassword.length < 8) {
      showToast('warning', 'A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', 'As senhas não coincidem.');
      return;
    }

    if (newPassword === currentPassword) {
      showToast('info', 'A nova senha deve ser diferente da senha atual.');
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmChange = () => {
    setIsModalOpen(false);

    // TODO adminStore.changePassword(currentPassword, newPassword);

    showToast('success', 'Senha alterada com sucesso.');

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full font-inter">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-10 space-y-10 flex flex-col items-center">
          <div className="w-full max-w-6xl space-y-10">

            <header>
              <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">
                Configurações
              </p>
              <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase leading-none">
                Segurança
              </h1>
            </header>

            <section className="bg-white rounded-2xl shadow-sm p-10 space-y-8 max-w-2xl">
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                Alterar senha do administrador
              </h2>

              <div className="space-y-6">
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />

                <input
                  type="password"
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />

                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleOpenModal}
                  className="h-12 px-8 rounded-lg font-bold text-white bg-brand-blue"
                >
                  Salvar alterações
                </button>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>

      {/* Modal de confirmação */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmar alteração de senha"
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            Tem certeza que deseja alterar a senha do administrador?
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="h-10 px-6 rounded-lg border border-slate-300 font-semibold"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirmChange}
              className="h-10 px-6 rounded-lg bg-brand-blue text-white font-semibold"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
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

export default AdminSettingsPage;
