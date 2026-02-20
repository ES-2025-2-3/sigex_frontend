import { observer } from "mobx-react-lite";
import { useEffect, useState, useMemo } from "react";
import {
  FaTrash,
  FaExclamationTriangle,
  FaUser,
  FaSearch,
  FaEye,
} from "react-icons/fa";

import AdminSidebar from "../../commons/admin/AdminSidebar";
import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import Pagination from "../../commons/pagination/Pagination";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

import { userIndexStore } from "../../store/user/UserIndexStore";
import { UserType } from "../../domain/enums/UserType";
import UserDomain from "../../domain/user/UserDomain";

const ITEMS_PER_PAGE = 6;

type ModalAction = "VIEW" | "DEMOTE" | null;

const AdminStaffManagementPage = observer(() => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDomain | null>(null);
  const [modalAction, setModalAction] = useState<ModalAction>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    userIndexStore.fetch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Mock para visualização enquanto banco está vazio
  const mockStaff = useMemo(
    () => [
      new UserDomain({
        id: "1",
        name: "Nicole Brito Maracajá",
        type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
        email: "nicole.brito.maracaja@ccc.ufcg.edu.br",
      }),
    ],
    [],
  );

  const staffMembers = useMemo(() => {
    const storeData = (userIndexStore as any).staffMembers || [];
    const baseList = storeData.length > 0 ? storeData : mockStaff;

    return baseList.filter((user: UserDomain) => {
      const term = search.toLowerCase();
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    });
  }, [
    userIndexStore.loading,
    (userIndexStore as any).staffMembers,
    search,
    mockStaff,
  ]);

  const totalPages = Math.ceil(staffMembers.length / ITEMS_PER_PAGE);
  const paginatedStaff = staffMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleOpenModal = (user: UserDomain, action: ModalAction) => {
    setSelectedUser(user);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    try {
      if (modalAction === "DEMOTE") {
        setToast({
          type: "success",
          message: `Privilégios de ${selectedUser.name} revogados. Usuário agora é comum.`,
        });
      }
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setToast({ type: "error", message: "Erro ao processar solicitação." });
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
                Gestão Interna
              </p>
              <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase">
                Equipe de Funcionários
              </h1>
            </header>

            <section className="space-y-6">
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">
                Gerenciamento de permissões operacionais
              </h2>

              <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">
                <div className="relative w-full md:w-80">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Buscar funcionário..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold bg-white outline-none focus:ring-4 focus:ring-brand-blue/10"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-600">
                      <th className="px-6 py-5">Funcionário</th>
                      <th className="px-6 py-5 text-center">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-bold">
                    {paginatedStaff.length > 0 ? (
                      paginatedStaff.map((staff) => (
                        <tr
                          key={staff.id}
                          className="hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-slate-400" />
                              <div>
                                <div>{staff.name}</div>
                                <span className="text-[10px] text-slate-400 uppercase">
                                  {staff.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-center gap-4">
                              <button
                                onClick={() => handleOpenModal(staff, "VIEW")}
                                className="cursor-pointer p-2 text-slate-400 hover:text-brand-blue transition"
                                title="Visualizar Detalhes"
                              >
                                <FaEye size={16} />
                              </button>

                              <button
                                onClick={() => handleOpenModal(staff, "DEMOTE")}
                                className="cursor-pointer p-2 text-slate-400 hover:text-orange-500 transition"
                                title="Revogar Permissões"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="py-20 text-center">
                          <FaUser
                            className="mx-auto text-slate-200 mb-4"
                            size={36}
                          />
                          <p className="text-slate-400 text-sm font-black uppercase tracking-wider">
                            Nenhum funcionário encontrado
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
          isOpen={isModalOpen}
          title={
            modalAction === "DEMOTE"
              ? "Revogar Privilégios de Staff"
              : "Informações do Funcionário"
          }
          onClose={() => setIsModalOpen(false)}
        >
          <div className="space-y-6">
            <p className="text-sm text-slate-600 font-medium">
              {modalAction === "DEMOTE"
                ? "Este usuário deixará de ser um funcionário e voltará a ter uma conta de usuário comum."
                : "Visualização dos dados cadastrais do membro da equipe."}
            </p>

            {selectedUser && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 text-white rounded-2xl flex items-center justify-center shadow-lg 
                    ${modalAction === "DEMOTE" ? "bg-orange-600 shadow-orange-600/20" : "bg-brand-blue shadow-brand-blue/20"}
                  `}
                  >
                    {modalAction === "DEMOTE" ? (
                      <FaExclamationTriangle size={22} />
                    ) : (
                      <FaUser size={22} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Cargo Atual
                    </span>
                    <span className="inline-flex w-fit uppercase items-center px-3 py-1 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
                      Funcionário
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Novo Cargo
                    </span>
                    <span className="text-slate-700 font-bold">
                      {modalAction === "DEMOTE"
                        ? "Usuário Comum"
                        : "Permanecer"}
                    </span>
                  </div>

                  <div className="col-span-2 text-[11px] text-slate-400 font-bold mt-2">
                    ID DO REGISTRO:{" "}
                    <span className="text-slate-300 font-mono">
                      #{selectedUser.id}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {modalAction === "DEMOTE" ? (
                <>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="cursor-pointer flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleConfirmAction}
                    className="cursor-pointer flex-1 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition"
                  >
                    Revogar Acesso
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full cursor-pointer py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
                >
                  Fechar Detalhes
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
