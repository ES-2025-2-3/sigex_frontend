import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaSearch,
  FaTrashAlt,
  FaUserCheck,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import Pagination from "../../commons/pagination/Pagination";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";
import { userManagementStore } from "../../store/user/UserManagementStore";
import { UserType } from "../../domain/enums/UserType";
import UserDomain from "../../domain/user/UserDomain";

const ITEMS_PER_PAGE = 6;

const AdminStaffManagementPage = observer(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDomain | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const staffMembers = userManagementStore.staffMembers;
  const availableToPromote = userManagementStore.availableServidores.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.registrationNumber.includes(searchTerm),
  );

  const totalPages = Math.ceil(staffMembers.length / ITEMS_PER_PAGE);
  const paginatedStaff = staffMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const formatUserType = (type: UserType | null | undefined) => {
    if (!type) return "Não Definido";
    switch (type) {
      case UserType.ADMIN:
        return "Administrador";
      case UserType.DOCENTE:
        return "Docente";
      case UserType.SERVIDOR_TECNICO_ADMINISTRATIVO:
        return "Servidor Técnico";
      case UserType.FUNCIONARIO:
        return "Funcionário";
      default:
        return "Desconhecido";
    }
  };

  const handlePromote = async (
    userId: string | null | undefined,
    userName: string,
  ) => {
    if (!userId) return;
    try {
      await userManagementStore.promoteToStaff(userId);
      setToast({ type: "success", message: `${userName} agora faz parte da equipe de funcionários!` });
      setIsModalOpen(false);
      setSearchTerm("");
    } catch (error) {
      setToast({ type: "error", message: "Erro ao promover servidor." });
    }
  };

  const openDemoteConfirm = (user: UserDomain) => {
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDemote = async () => {
    if (!selectedUser?.id) return;
    try {
      await userManagementStore.demoteToUser(selectedUser.id);
      setToast({
        type: "warning",
        message: `Acessos de ${selectedUser.name} foram revogados.`,
      });
      setIsConfirmModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setToast({ type: "error", message: "Erro ao remover privilégios." });
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-main w-full font-inter">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-10 flex flex-col items-center">
          <div className="w-full max-w-6xl space-y-10">
            <header className="flex justify-between items-end">
              <div>
                <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">
                  Gestão Interna
                </p>
                <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase">
                  Equipe de Funcionários
                </h1>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer flex items-center gap-2 px-6 py-4 bg-brand-blue text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
              >
                <FaUserPlus /> Promover Servidor
              </button>
            </header>

            <section className="space-y-6">
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">
                Funcionários Ativos
              </h2>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-600">
                      <th className="px-6 py-5">Nome</th>
                      <th className="px-6 py-5">Matrícula</th>
                      <th className="px-6 py-5 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-bold">
                    {paginatedStaff.map((staff) => (
                      <tr
                        key={staff.id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                              {staff.initials}
                            </div>
                            <div>
                              <div>{staff.name}</div>
                              <span className="text-[10px] text-brand-blue uppercase font-black">
                                Operacional
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-slate-500 font-mono italic">
                          {staff.registrationNumber}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => openDemoteConfirm(staff)}
                            className="cursor-pointer p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </section>
          </div>
        </main>

        <Modal
          isOpen={isModalOpen}
          title="Pesquisar Servidor"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="space-y-6">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Nome ou matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-blue/10 transition"
              />
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {availableToPromote.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-blue/30 transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-brand-blue group-hover:text-white rounded-xl flex items-center justify-center transition-all">
                      <FaUser size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-slate-800 leading-tight uppercase">
                        {user.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-bold">
                        REG: {user.registrationNumber || "N/A"}
                      </p>
                    </div>
                    <button
                      onClick={() => handlePromote(user.id, user.name)}
                      className="cursor-pointer p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <FaUserCheck size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isConfirmModalOpen}
          title="Revogar Acesso"
          onClose={() => setIsConfirmModalOpen(false)}
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
              <FaExclamationTriangle className="text-red-500" size={32} />
              <p className="text-sm text-red-800 font-bold">
                Tem certeza que deseja remover os privilégios administrativos de{" "}
                <span className="underline">{selectedUser?.name}</span>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="cursor-pointer flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDemote}
                className="cursor-pointer flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
              >
                Confirmar Remoção
              </button>
            </div>
          </div>
        </Modal>

        <Footer />
      </div>
    </div>
  );
});

export default AdminStaffManagementPage;
