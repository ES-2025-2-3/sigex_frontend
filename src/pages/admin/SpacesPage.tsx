import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AdminSidebar from '../../commons/admin/AdminSidebar';
import Header from '../../commons/header/Header';
import Footer from '../../commons/footer/Footer';
import Button from '../../commons/components/Button';
import Modal from '../../commons/modal/Modal';
import { room_mock } from '../../../mock/room';
import { equipament_mock } from '../../../mock/equipament';

const SpacesPage: React.FC = () => {
  const [rooms, setRooms] = useState(room_mock);
  const [equipaments, setEquipaments] = useState(equipament_mock);
  const [openRoomModal, setOpenRoomModal] = useState(false);
  const [openEquipModal, setOpenEquipModal] = useState(false);

  const [roomForm, setRoomForm] = useState({ name: '', block: '', capacity: '' });
  const [equipForm, setEquipForm] = useState({ name: '', type: '' });
  
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [editingEquipId, setEditingEquipId] = useState<number | null>(null);


  function addRoom(e: React.FormEvent) {
    e.preventDefault();
    if (editingRoomId) {
      setRooms((s) =>
        s.map((r) =>
          r.id === editingRoomId
            ? {
                ...r,
                name: roomForm.name || r.name,
                block: roomForm.block || r.block,
                capacity: Number(roomForm.capacity) || r.capacity,
              }
            : r
        )
      );
      setEditingRoomId(null);
    } else {
      const next = {
        id: Date.now(),
        name: roomForm.name || 'Novo Espaço',
        block: roomForm.block || '-',
        capacity: Number(roomForm.capacity) || 0,
      };
      setRooms((s) => [next, ...s]);
    }
    setRoomForm({ name: '', block: '', capacity: '' });
    setOpenRoomModal(false);
  }

  function deleteRoom(id: number) {
    if (confirm('Tem certeza que deseja remover este espaço?')) {
      setRooms((s) => s.filter((r) => r.id !== id));
    }
  }

  function editRoom(room: any) {
    setEditingRoomId(room.id);
    setRoomForm({ name: room.name, block: room.block, capacity: String(room.capacity) });
    setOpenRoomModal(true);
  }

  function addEquip(e: React.FormEvent) {
    e.preventDefault();
    if (editingEquipId) {
      setEquipaments((s) =>
        s.map((eq) =>
          eq.id === editingEquipId
            ? {
                ...eq,
                name: equipForm.name || eq.name,
                type: equipForm.type || eq.type,
              }
            : eq
        )
      );
      setEditingEquipId(null);
    } else {
      const next = {
        id: Date.now(),
        name: equipForm.name || 'Novo Material',
        type: equipForm.type || 'Outro',
      };
      setEquipaments((s) => [next, ...s]);
    }
    setEquipForm({ name: '', type: '' });
    setOpenEquipModal(false);
  }

  function deleteEquip(id: number) {
    if (confirm('Tem certeza que deseja remover este material?')) {
      setEquipaments((s) => s.filter((eq) => eq.id !== id));
    }
  }

  function editEquip(equip: any) {
    setEditingEquipId(equip.id);
    setEquipForm({ name: equip.name, type: equip.type });
    setOpenEquipModal(true);
  }

  function openNewRoomModal() {
    setEditingRoomId(null);
    setRoomForm({ name: '', block: '', capacity: '' });
    setOpenRoomModal(true);
  }

  function openNewEquipModal() {
    setEditingEquipId(null);
    setEquipForm({ name: '', type: '' });
    setOpenEquipModal(true);
  }

  function closeRoomModal() {
    setOpenRoomModal(false);
    setEditingRoomId(null);
    setRoomForm({ name: '', block: '', capacity: '' });
  }

  function closeEquipModal() {
    setOpenEquipModal(false);
    setEditingEquipId(null);
    setEquipForm({ name: '', type: '' });
  }


  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full font-inter">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-10 flex flex-col items-center">
          <div className="w-full max-w-6xl space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">Gerenciamento</p>
                <h1 className="text-4xl font-black text-[#1e293b] tracking-tighter uppercase leading-none">Gerenciamento de espaços</h1>
              </div>
            </header>

            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-slate-600">Espaços Cadastrados</h2>
                <Button onClick={openNewRoomModal}>+ Novo</Button>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-left">
                      <th className="py-3 px-4">Nome</th>
                      <th className="py-3 px-4">Bloco</th>
                      <th className="py-3 px-4">Capacidade</th>
                      <th className="py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-700">{r.name}</td>
                        <td className="py-3 px-4 text-slate-500">{r.block}</td>
                        <td className="py-3 px-4 text-slate-500">{r.capacity}</td>
                        <td className="py-3 px-4 text-slate-500 flex gap-3">
                          <button
                            onClick={() => editRoom(r)}
                            className="text-brand-blue hover:text-brand-blue/80 transition-colors"
                            title="Editar"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => deleteRoom(r.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Remover"
                          >
                            <FaTrash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-slate-600">Materiais fornecidos</h2>
                <Button onClick={openNewEquipModal}>+ Novo</Button>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-left">
                      <th className="py-3 px-4">Nome</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipaments.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-700">{e.name}</td>
                        <td className="py-3 px-4 text-slate-500">{e.type}</td>
                        <td className="py-3 px-4 text-slate-500 flex gap-3">
                          <button
                            onClick={() => editEquip(e)}
                            className="text-brand-blue hover:text-brand-blue/80 transition-colors"
                            title="Editar"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => deleteEquip(e.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Remover"
                          >
                            <FaTrash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>

      <Modal isOpen={openRoomModal} title={editingRoomId ? "Editar Espaço" : "Novo Espaço"} onClose={closeRoomModal}>
        <form onSubmit={addRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Nome</label>
            <input value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} className="w-full mt-2 p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Bloco</label>
            <input value={roomForm.block} onChange={(e) => setRoomForm({ ...roomForm, block: e.target.value })} className="w-full mt-2 p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Capacidade</label>
            <input value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })} type="number" className="w-full mt-2 p-2 border rounded-md" />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={closeRoomModal}>Cancelar</Button>
            <Button type="submit" className="ml-3">{editingRoomId ? "Atualizar" : "Salvar"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={openEquipModal} title={editingEquipId ? "Editar Material" : "Novo Material"} onClose={closeEquipModal}>
        <form onSubmit={addEquip} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Nome</label>
            <input value={equipForm.name} onChange={(e) => setEquipForm({ ...equipForm, name: e.target.value })} className="w-full mt-2 p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Tipo</label>
            <input value={equipForm.type} onChange={(e) => setEquipForm({ ...equipForm, type: e.target.value })} className="w-full mt-2 p-2 border rounded-md" />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={closeEquipModal}>Cancelar</Button>
            <Button type="submit" className="ml-3">{editingEquipId ? "Atualizar" : "Salvar"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SpacesPage;
