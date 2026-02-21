import { observer } from "mobx-react-lite";
import { useEffect, useState, useMemo } from "react";
import {
  FaSearch,
  FaPlus,
  FaDoorOpen,
  FaUsers,
  FaEdit,
  FaTrash,
  FaBuilding,
} from "react-icons/fa";

import spaceDomain from "../../domain/space/SpaceDomain";
import Header from "../../commons/header/Header";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";
import { spaceStore } from "../../store/space/SpaceStore";

const AdminspacePage = observer(() => {
  const { spaces, institutes, isLoading } = spaceStore;
  const [domain] = useState(() => new spaceDomain());

  const [search, setSearch] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedspaceId, setSelectedspaceId] = useState<number | string | null>(null);
  const [toast, setToast] = useState<{ type: ToastType; message: string; } | null>(null);

  useEffect(() => {
    spaceStore.fetchSpaces();
  }, []);

  const filteredspaces = useMemo(() => {
    const spacesList = Array.isArray(spaces) ? spaces : [];
    return spacesList.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [spaces, search]);

  const handleOpenCreate = () => {
    domain.clear();
    if (institutes.length > 0) {
      domain.setData({ instituteId: institutes[0].id });
    }
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (space: any) => {
    domain.setData(space);
    setIsFormModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    domain.validate();

    if (domain.hasErrors) return;

    const success = await spaceStore.save(domain);
    if (success) {
      setToast({ type: "success", message: "Sala salva com sucesso!" });
      setIsFormModalOpen(false);
    } else {
      setToast({
        type: "error",
        message: "Erro ao salvar. Verifique a conexão com o servidor.",
      });
    }
  };

  const handleDelete = async () => {
    if (selectedspaceId) {
      const success = await spaceStore.delete(selectedspaceId);
      if (success) {
        setToast({ type: "success", message: "Sala excluída!" });
        setIsDeleteModalOpen(false);
        setSelectedspaceId(null);
      }
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
                  Gerenciamento Interno
                </p>
                <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase">
                  Espaços
                </h1>
              </div>
              <button
                onClick={handleOpenCreate}
                className="bg-brand-blue text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-blue/20 transition-all"
              >
                <FaPlus size={10} className="inline mr-2" /> Novo Espaço
              </button>
            </header>

            <section className="space-y-6">
              <div className="relative w-80">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-blue/10 bg-white shadow-sm"
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-600">
                    <tr>
                      <th className="px-6 py-5">Nome da Sala</th>
                      <th className="px-6 py-5">Capacidade</th>
                      <th className="px-6 py-5 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
                    {isLoading && spaces.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-10 text-center animate-pulse text-slate-400"
                        >
                          Carregando espaços...
                        </td>
                      </tr>
                    ) : filteredspaces.length > 0 ? (
                      filteredspaces.map((space) => (
                        <tr
                          key={space.id}
                          className="hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-5 flex items-center gap-3">
                            <FaDoorOpen className="text-brand-blue opacity-70" />{" "}
                            {space.name}
                          </td>
                          <td className="px-6 py-5 font-medium text-slate-500">
                            <FaUsers className="inline mr-2 opacity-30" />{" "}
                            {space.capacity} pessoas
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleOpenEdit(space)}
                                className="p-2 text-slate-400 hover:text-brand-blue transition"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedspaceId(space.id);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-2 text-slate-400 hover:text-red-500 transition"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-10 text-center text-slate-400 italic"
                        >
                          Nenhuma sala cadastrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>

        <Modal
          isOpen={isFormModalOpen}
          title={domain.id ? "Editar Espaço" : "Novo Espaço"}
          onClose={() => setIsFormModalOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                Instituto Responsável
              </label>
              <div className="flex items-center gap-3">
                <FaBuilding className="text-brand-blue opacity-50" />
                <span className="font-bold text-sm text-slate-600">
                  {institutes[0]?.name || "Carregando..."}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                <FaDoorOpen size={18} />
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                  Nome Identificador
                </label>
                <input
                  type="text"
                  required
                  value={domain.name}
                  onChange={(e) => domain.setData({ name: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-700 text-sm"
                  placeholder="Ex: Sala de Reuniões 01"
                />
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-xl">
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                Capacidade Máxima
              </label>
              <input
                type="number"
                required
                value={domain.capacity}
                onChange={(e) =>
                  domain.setData({ capacity: Number(e.target.value) })
                }
                className="w-full outline-none font-bold text-sm text-slate-600"
              />
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-xl">
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-2">
                Recursos e Descrição
              </label>
              <textarea
                value={domain.description || ""}
                onChange={(e) =>
                  domain.setData({ description: e.target.value })
                }
                className="w-full outline-none font-medium text-sm text-slate-600 h-24 resize-none"
                placeholder="Ex: Ar condicionado, Projetor..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3.5 bg-brand-blue text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-blue/20 hover:brightness-110 transition disabled:opacity-70"
              >
                {isLoading ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          title="Remover Sala"
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="space-y-6">
            <p className="text-sm text-slate-600 font-medium text-center">
              Deseja remover este espaço permanentemente?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold"
              >
                Não, cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-100"
              >
                {isLoading ? "Removendo..." : "Sim, remover"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
});

export default AdminspacePage;
