import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import {
  FaBuilding,
  FaPlus,
  FaSearch,
  FaTools,
  FaTrash,
  FaWrench,
} from "react-icons/fa";

import EquipmentDomain from "../../domain/equipment/EquipmentDomain";
import { equipmentStore } from "../../store/equipment/EquipmentStore";
import { instituteStore } from "../../store/institute/InstituteStore";

import {
  EquipmentAmountOperation,
  InstituteEquipmentStock,
} from "../../types/equipment/EquipmentType";

import Header from "../../commons/header/Header";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import Modal from "../../commons/modal/Modal";
import Toast, { ToastType } from "../../commons/toast/Toast";

type ManageAction =
  | "ADD_TOTAL"
  | "REMOVE_TOTAL"
  | "MAINTENANCE_OUT"
  | "MAINTENANCE_BACK";

const actionToOperation: Record<ManageAction, EquipmentAmountOperation> = {
  ADD_TOTAL: "INCREMENT_TOTAL",
  REMOVE_TOTAL: "DECREMENT_TOTAL",
  MAINTENANCE_OUT: "DECREMENT_AVAILABLE",
  MAINTENANCE_BACK: "INCREMENT_AVAILABLE",
};

type CreateMode = "NEW" | "EXISTING";

const getApiErrorMessage = (err: any, fallback: string) => {
  const data = err?.response?.data;

  if (!data) return fallback;
  if (typeof data === "string") return data;

  return data.message || data.error || data.details || fallback;
};

const AdminEquipmentPage = observer(() => {
  const [domain] = useState(() => new EquipmentDomain());

  const { stocks, catalog, isLoadingStocks, isLoadingCatalog } = equipmentStore;
  const { globalId, current: institute } = instituteStore;

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(
    null
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>("NEW");
  const [initialTotal, setInitialTotal] = useState<number | "">("");

  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);

  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<InstituteEquipmentStock | null>(
    null
  );
  const [manageAction, setManageAction] = useState<ManageAction>("ADD_TOTAL");
  const [manageAmount, setManageAmount] = useState<number | "">("");


  const requireInstituteId = (): string | null => {
    if (!globalId) {
      setToast({ type: "error", message: "Instituto não carregado." });
      return null;
    }
    return globalId;
  };

  useEffect(() => {
    equipmentStore.fetchCatalog();
    instituteStore.fetchDetails();
  }, []);

  useEffect(() => {
    if (!globalId) return;
    equipmentStore.fetchStocks(globalId);
  }, [globalId]);

  const filteredStocks = useMemo(() => {
    const s = search.toLowerCase();
    return stocks.filter((st) => st.equipmentName.toLowerCase().includes(s));
  }, [stocks, search]);

  const filteredCatalog = useMemo(() => {
    const s = catalogSearch.toLowerCase();
    const linked = new Set(stocks.map((st) => st.equipmentId));

    return catalog
      .filter((c: any) => !linked.has(c.id))
      .filter((c: any) => c.name.toLowerCase().includes(s))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [catalog, catalogSearch, stocks]);

  const openCreate = () => {
    domain.clear();
    setCreateMode("NEW");
    setInitialTotal("");
    setCatalogSearch("");
    setSelectedCatalogId(null);
    setIsCreateModalOpen(true);
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = requireInstituteId();
    if (!id) return;

    const total = Number(initialTotal);
    if (!total || total <= 0) {
      setToast({ type: "error", message: "Quantidade deve ser > 0." });
      return;
    }

    try {
      if (createMode === "NEW") {
        domain.validate();
        if (domain.hasErrors) {
          setToast({ type: "error", message: "Verifique os campos obrigatórios." });
          return;
        }

        await equipmentStore.createEquipmentWithStock(id, domain, total);
        setToast({
          type: "success",
          message: "Equipamento criado e vinculado ao instituto!",
        });
      } else {
        if (!selectedCatalogId) {
          setToast({ type: "error", message: "Selecione um equipamento do catálogo." });
          return;
        }

        await equipmentStore.linkExistingToInstitute(id, selectedCatalogId, total);
        setToast({ type: "success", message: "Equipamento vinculado ao instituto!" });
      }

      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Erro no cadastro/vínculo:", err);
      setToast({
        type: "error",
        message: getApiErrorMessage(
          err,
          createMode === "EXISTING"
            ? "Erro ao vincular equipamento."
            : "Erro ao cadastrar equipamento."
        ),
      });
    }
  };

  const openManage = (stock: InstituteEquipmentStock) => {
    setSelectedStock(stock);
    setManageAction("ADD_TOTAL");
    setManageAmount("");
    setIsManageModalOpen(true);
  };

  const submitManage = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = requireInstituteId();
    if (!id || !selectedStock) return;

    const amount = Number(manageAmount);
    if (!amount || amount <= 0) {
      setToast({ type: "error", message: "Informe uma quantidade > 0." });
      return;
    }

    const op = actionToOperation[manageAction];

    try {
      await equipmentStore.updateAmount(id, selectedStock.equipmentId, amount, op);
      setToast({ type: "success", message: "Quantidade atualizada com sucesso!" });
      setIsManageModalOpen(false);
    } catch (err) {
      console.error("Erro ao atualizar estoque:", err);
      setToast({
        type: "error",
        message: getApiErrorMessage(err, "Erro ao atualizar. Verifique as regras do estoque."),
      });
    }
  };

  const deleteFromInstitute = async () => {
    const id = requireInstituteId();
    if (!id || !selectedStock) return;

    try {
      await equipmentStore.deleteFromInstitute(id, selectedStock.equipmentId);
      setToast({ type: "success", message: "Removido do instituto (estoque)." });
      setIsManageModalOpen(false);
    } catch (err) {
      console.error("Erro ao remover do instituto:", err);
      setToast({
        type: "error",
        message: getApiErrorMessage(err, "Erro ao remover do instituto."),
      });
    }
  };

  const deleteFully = async () => {
    const id = requireInstituteId();
    if (!id || !selectedStock) return;

    const ok = window.confirm(
      "Tem certeza? Isso vai excluir o equipamento do sistema (catálogo) e remover o vínculo do instituto."
    );
    if (!ok) return;

    try {
      await equipmentStore.deleteEquipmentFully(id, selectedStock.equipmentId);
      setToast({ type: "success", message: "Equipamento excluído do sistema." });
      setIsManageModalOpen(false);
    } catch (err) {
      console.error("Erro ao excluir do sistema:", err);
      setToast({
        type: "error",
        message: getApiErrorMessage(err, "Erro ao excluir do sistema."),
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
                onClick={openCreate}
                className="bg-brand-blue text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-blue/20 transition-all cursor-pointer"
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
                      <th className="px-6 py-5">Disponível / Total</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5 text-center">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
                    {isLoadingStocks ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-10 text-center text-slate-400 italic"
                        >
                          Carregando equipamentos...
                        </td>
                      </tr>
                    ) : filteredStocks.length > 0 ? (
                      filteredStocks.map((st) => (
                        <tr key={st.equipmentId} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-5 flex items-center gap-3">
                            <FaTools className="text-brand-blue opacity-70" />
                            <div className="flex flex-col">
                              <span>{st.equipmentName}</span>
                              {st.equipmentDescription ? (
                                <span className="text-xs font-medium text-slate-400 line-clamp-1">
                                  {st.equipmentDescription}
                                </span>
                              ) : null}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="font-black text-slate-800">{st.available}</span>
                            <span className="text-slate-400"> / </span>
                            <span className="font-black text-slate-600">{st.total}</span>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                st.available > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {st.available > 0 ? "Disponível" : "Indisponível"}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() => openManage(st)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition inline-flex items-center gap-2 cursor-pointer"
                            >
                              <FaWrench /> Gerenciar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
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
          isOpen={isCreateModalOpen}
          title={createMode === "NEW" ? "Novo Equipamento" : "Vincular Equipamento Existente"}
          onClose={() => setIsCreateModalOpen(false)}
        >
          <form onSubmit={submitCreate} className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                Unidade vinculada
              </label>
              <div className="flex items-center gap-3">
                <FaBuilding className="text-brand-blue opacity-50" />
                <span className="font-bold text-sm text-slate-600">
                  {institute?.name || "Carregando..."}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCreateMode("NEW");
                    setSelectedCatalogId(null);
                    setCatalogSearch("");
                  }}
                  className={`px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest border transition cursor-pointer ${
                    createMode === "NEW"
                      ? "bg-brand-blue text-white border-brand-blue"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Criar novo
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreateMode("EXISTING");
                    setSelectedCatalogId(null);
                    setCatalogSearch("");
                  }}
                  className={`px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest border transition cursor-pointer ${
                    createMode === "EXISTING"
                      ? "bg-brand-blue text-white border-brand-blue"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Vincular existente
                </button>
              </div>
            </div>

            {createMode === "NEW" ? (
              <>
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
                      onChange={(e) => domain.setData({ name: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-700 text-sm"
                      placeholder="Ex: Projetor Epson"
                    />

                    {domain.errors?.name && (
                      <p className="text-xs text-red-500 mt-1">{domain.errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 block">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={domain.description}
                    onChange={(e) => domain.setData({ description: e.target.value })}
                    className="w-full min-h-[90px] rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-brand-blue/10"
                    placeholder="Opcional..."
                  />
                  {domain.errors?.description && (
                    <p className="text-xs text-red-500">{domain.errors.description}</p>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar no catálogo..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-blue/10"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {isLoadingCatalog ? (
                    <div className="p-4 text-sm font-bold text-slate-400 italic">
                      Carregando catálogo...
                    </div>
                  ) : filteredCatalog.length === 0 ? (
                    <div className="p-4 text-sm font-bold text-slate-400 italic">
                      {catalogSearch
                        ? "Nenhum equipamento encontrado (ou todos já estão vinculados)."
                        : "Todos os equipamentos do catálogo já estão vinculados ao instituto."}
                    </div>
                  ) : (
                    filteredCatalog.map((eq) => {
                      const selected = eq.id === selectedCatalogId;
                      return (
                        <div
                          key={eq.id}
                          onClick={() => setSelectedCatalogId(eq.id)}
                          className={`p-4 hover:bg-slate-50 transition cursor-pointer ${
                            selected ? "bg-brand-blue/5" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-black text-slate-800">{eq.name}</p>
                              {eq.description ? (
                                <p className="text-xs font-bold text-slate-400 mt-1 line-clamp-2">
                                  {eq.description}
                                </p>
                              ) : null}
                            </div>

                            <div
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                selected ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {selected ? "Selecionado" : "Selecionar"}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <p className="text-xs font-bold text-slate-500">
                  Cria o vínculo de um equipamento existente no sistema com o instituto.
                </p>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-400 block">
                Quantidade inicial
              </label>
              <input
                type="number"
                min={1}
                value={initialTotal}
                onChange={(e) =>
                  setInitialTotal(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-brand-blue/10"
                placeholder="Ex: 10"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 py-3.5 bg-brand-blue text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-blue/20 hover:brightness-110 transition cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isManageModalOpen}
          title={selectedStock ? `Gerenciar: ${selectedStock.equipmentName}` : "Gerenciar"}
          onClose={() => setIsManageModalOpen(false)}
        >
          {selectedStock && (
            <form onSubmit={submitManage} className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Estoque atual
                </p>

                <p className="text-2xl font-black text-slate-800">
                  {selectedStock.available} <span className="text-slate-400">/</span>{" "}
                  {selectedStock.total}
                </p>

                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                    <p className="text-[10px] uppercase font-black text-slate-400">
                      Disponíveis
                    </p>
                    <p className="text-lg font-black text-green-600">
                      {selectedStock.available}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                    <p className="text-[10px] uppercase font-black text-slate-400">
                      Manutenção
                    </p>
                    <p className="text-lg font-black text-amber-600">
                      {Math.max(0, selectedStock.total - selectedStock.available)}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                    <p className="text-[10px] uppercase font-black text-slate-400">Total</p>
                    <p className="text-lg font-black text-slate-800">{selectedStock.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Operação
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      ["ADD_TOTAL", "+ Total"],
                      ["REMOVE_TOTAL", "- Total"],
                      ["MAINTENANCE_OUT", "Manutenção (saída)"],
                      ["MAINTENANCE_BACK", "Manutenção (retorno)"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setManageAction(key)}
                      className={`px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest border transition cursor-pointer ${
                        manageAction === key
                          ? "bg-brand-blue text-white border-brand-blue"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-2">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={manageAmount}
                    onChange={(e) =>
                      setManageAmount(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-brand-blue/10"
                    placeholder="Ex: 2"
                  />
                  <p className="text-xs font-bold text-slate-500 mt-2">
                    “Manutenção (saída)” = indisponibilizar. | “Manutenção (retorno)” =
                    disponibilizar.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsManageModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-brand-blue text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-blue/20 hover:brightness-110 transition cursor-pointer"
                >
                  Aplicar
                </button>
              </div>

              <button
                type="button"
                onClick={deleteFromInstitute}
                className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest transition inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaTrash /> Remover do instituto (estoque)
              </button>

              <button
                type="button"
                onClick={deleteFully}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaTrash /> Excluir do sistema (catálogo)
              </button>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
});

export default AdminEquipmentPage;