import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaTools,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

import EquipmentDomain from "../../domain/equipment/EquipmentDomain";
import { equipmentStore } from "../../store/equipment/EquipmentStore";

import Header from "../../commons/header/Header";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

const AdminEquipmentPage = observer(() => {
  const { equipments, isLoading } = equipmentStore;

  const [domain] = useState(() => new EquipmentDomain());

  const [search, setSearch] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    equipmentStore.fetchEquipments();
  }, []);

  const filteredEquipments = useMemo(() => {
    return equipments.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [equipments, search]);

  const handleOpenCreate = () => {
    domain.clear();
    setIsFormModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    domain.validate();

    if (domain.hasErrors) {
      setToast({
        type: "error",
        message: "Verifique os campos obrigatórios.",
      });
      return;
    }

    const success = await equipmentStore.save(domain);

    if (success) {
      setToast({
        type: "success",
        message: "Equipamento salvo com sucesso!",
      });
      setIsFormModalOpen(false);
    } else {
      setToast({
        type: "error",
        message: "Erro ao salvar equipamento.",
      });
    }
  };

  const handleToggleStatus = async (
    id: number | undefined,
    available: boolean
  ) => {
    if (!id) return;

    const success = available
      ? await equipmentStore.disable(id)
      : await equipmentStore.enable(id);

    if (success) {
      setToast({
        type: "success",
        message: "Status atualizado com sucesso!",
      });
    } else {
      setToast({
        type: "error",
        message: "Erro ao atualizar status.",
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
            <header className="flex justify-between items-end">
              <div>
                <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">
                  Gerenciamento
                </p>
                <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase">
                  Equipamentos
                </h1>
              </div>

              <button
                onClick={handleOpenCreate}
                className="bg-brand-blue text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-blue/20 transition-all"
              >
                <FaPlus size={10} className="inline mr-2" /> Novo Equipamento
              </button>
            </header>

            <section className="space-y-6">
              <div className="relative w-80">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar equipamento..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-blue/10 bg-white shadow-sm"
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-600">
                    <tr>
                      <th className="px-6 py-5">Nome</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5 text-center">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-10 text-center text-slate-400 italic"
                        >
                          Carregando equipamentos...
                        </td>
                      </tr>
                    ) : filteredEquipments.length > 0 ? (
                      filteredEquipments.map((eq) => (
                        <tr
                          key={eq.id}
                          className="hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-5 flex items-center gap-3">
                            <FaTools className="text-brand-blue opacity-70" />
                            {eq.name}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                eq.available
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-500"
                              }`}
                            >
                              {eq.available
                                ? "Disponível"
                                : "Indisponível"}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() =>
                                handleToggleStatus(eq.id, eq.available)
                              }
                              className="p-2 text-slate-400 hover:text-brand-blue transition"
                            >
                              {eq.available ? (
                                <FaToggleOn size={25} className="text-brand-blue"/>
                              ) : (
                                <FaToggleOff size={25} className="text-slate-400"/>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-10 text-center text-slate-400 italic"
                        >
                          Nenhum equipamento encontrado.
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
          title="Novo Equipamento"
          onClose={() => setIsFormModalOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                <FaTools size={18} />
              </div>

              <div className="flex-1">
                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                  Nome do Equipamento
                </label>

                <input
                  type="text"
                  value={domain.name}
                  onChange={(e) =>
                    domain.setData({ name: e.target.value })
                  }
                  className="w-full bg-transparent outline-none font-bold text-slate-700 text-sm"
                  placeholder="Ex: Projetor Epson"
                />

                {domain.errors?.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {domain.errors.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={domain.available}
                onChange={(e) =>
                  domain.setData({ available: e.target.checked })
                }
              />
              <label className="text-sm font-medium text-slate-600">
                Disponível
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 py-3.5 bg-brand-blue text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-blue/20 hover:brightness-110 transition"
              >
                Salvar Equipamento
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
});

export default AdminEquipmentPage;
