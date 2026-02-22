import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { FaSearch, FaEye, FaUser, FaArrowDown } from "react-icons/fa";

import Header from "../../commons/header/Header";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import Footer from "../../commons/footer/Footer";
import Pagination from "../../commons/pagination/Pagination";
import { User } from "../../types/user/UserType";
import Modal from "../../commons/modal/Modal";

import Toast, { ToastType } from "../../commons/toast/Toast";
import { UserType } from "../../domain/enums/UserType";
import { userIndexStore } from "../../store/user/UserIndexStore";

type ConfirmAction = "DEMOTE" | "VIEW";

const ITEMS_PER_PAGE = 6;

const AdminStaffManagementPage = observer(() => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    userIndexStore.fetch();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const openDemoteConfirm = (user: User) => {
    setConfirmUser(user);
    setConfirmAction("DEMOTE");
    setIsConfirmModalOpen(true);
  };

  const openViewModal = (user: User) => {
    setConfirmUser(user);
    setConfirmAction("VIEW");
    setIsConfirmModalOpen(true);
  };

  const closeModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmUser(null);
    setConfirmAction(null);
  };

  const formatUserType = (type: UserType) => {
    switch (type) {
      case UserType.ADMIN:
        return "Administrador";
      case UserType.SERVIDOR_TECNICO_ADMINISTRATIVO:
        return "Servidor Técnico Administrativo";
      case UserType.USUARIO:
        return "Usuário";
      default:
        return type;
    }
  };

  const filteredStaff = userIndexStore.users.filter((user) => {
    const isStaff = user.type !== UserType.USUARIO;
    const term = search.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term);
    return matchesSearch && isStaff;
  });

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);

  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleConfirmAction = () => {
    if (!confirmUser || !confirmAction) return;

    if (confirmAction === "DEMOTE") {
      handleDemote(confirmUser);
    }

    closeModal();
    setConfirmUser(null);
    setConfirmAction(null);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDemote = async (user: User) => {
    const success = await userIndexStore.demote(user.id);

    if (success) {
      setToast({
        type: "success",
        message: `Privilégios de ${user.name} revogados. Agora é um Usuário Comum.`,
      });
    } else {
      setToast({
        type: "error",
        message: "Erro ao rebaixar nível de acesso.",
      });
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
            <header>
              <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">
                Visão Geral
              </p>
              <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase">
                Funcionários
              </h1>
            </header>

            <section className="space-y-6">
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">
                Gerenciamento de equipe e permissões
              </h2>

              <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">
                <div className="relative w-full md:w-80">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Buscar funcionário..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-bold outline-none focus:ring-4 focus:ring-brand-blue/10"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-600">
                      <th className="px-6 py-5">Funcionário</th>
                      <th className="px-6 py-5">Tipo</th>
                      <th className="px-6 py-5 text-center">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-bold">
                    {paginatedStaff.length > 0 ? (
                      paginatedStaff.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-slate-400" />
                              <div>
                                <div className="text-slate-700">
                                  {user.name}
                                </div>
                                <span className="text-[10px] text-slate-400 uppercase">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="text-slate-600">
                              {formatUserType(user.type)}
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase">
                              ID #{user.id}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openDemoteConfirm(user)}
                                disabled={user.type === UserType.ADMIN}
                                className="cursor-pointer p-2 rounded-lg text-orange-600 hover:bg-orange-50 disabled:opacity-40"
                                title="Rebaixar para Usuário Comum"
                              >
                                <FaArrowDown />
                              </button>

                              <button
                                onClick={() => openViewModal(user)}
                                className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-brand-blue"
                                title="Ver Detalhes"
                              >
                                <FaEye />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-20 text-center">
                          <FaUser
                            className="mx-auto text-slate-200 mb-4"
                            size={36}
                          />
                          <p className="text-slate-400 text-sm font-black uppercase tracking-wider">
                            Nenhum membro da equipe encontrado
                          </p>
                        </td>
                      </tr>
                    )}
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
          isOpen={isConfirmModalOpen}
          title={
            confirmAction === "DEMOTE"
              ? "Confirmação de Rebaixamento"
              : "Informações do Funcionário"
          }
          onClose={closeModal}
        >
          <div className="space-y-6">
            <p className="text-sm text-slate-600 font-medium text-center">
              {confirmAction === "DEMOTE"
                ? "Este usuário deixará de ser um funcionário e voltará a ser um Usuário Comum."
                : "Visualização dos dados da equipe."}
            </p>

            {confirmUser && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                    <FaUser size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight">
                      {confirmUser.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {confirmUser.email}
                    </p>
                  </div>
                </div>

                {confirmAction === "DEMOTE" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-wider text-amber-700">
                      Atenção
                    </p>

                    <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                      <span>{formatUserType(confirmUser.type)}</span>
                      <div className="relative w-32 h-[2px] bg-amber-400 rounded-full">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-amber-400 rotate-45" />
                      </div>
                      <span>Usuário Comum</span>
                    </div>

                    <p className="text-xs text-amber-700 font-medium">
                      Esta ação revogará todos os privilégios administrativos.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {confirmAction !== "VIEW" ? (
                <>
                  <button
                    onClick={closeModal}
                    className="cursor-pointer flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleConfirmAction}
                    className="cursor-pointer flex-1 py-3 rounded-xl text-white font-bold transition bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200"
                  >
                    Revogar Acesso
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className="w-full cursor-pointer py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
                >
                  Fechar
                </button>
              )}
            </div>
          </div>
        </Modal>

        <Footer />
      </div>
    </div>
  );
});

export default AdminStaffManagementPage;
