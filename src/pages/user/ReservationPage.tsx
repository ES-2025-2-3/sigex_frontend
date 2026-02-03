import { useState } from "react";
import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import { Reservation } from "../../types/user/ReservationType";
import { FaCalendarAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useEffect } from "react";
import { reservations_mock } from "../../../mock/reservations";


function ReservationPage() {
    //barra de pesquisa
    const [search, setSearch] = useState("");
    const [reservations, setReservations] = useState<Reservation[]>(reservations_mock);
    
    //filtra reservas cujos nomes tem a string buscada
    const filteredReservations = reservations.filter((r) => r.event.toLowerCase().includes(search.toLowerCase()))
    
    //funcao que retira os eventos com id recebido para o proximo estado
    const handleCancel = (id: string) => {setReservations((prev) => prev.filter((r) => r.id !== id))};

    //modal de confirmação de cancelamento
    const[showModal, setShowModal] = useState(false);
    const[reservationToDelete, setReservationToDelete] = useState(null);

    useEffect(() => {const handleKeyDown = (e) => {if (e.key === "Escape") setShowModal(false);};
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);}, []);

    return (

        <div className="flex flex-col min-h-screen bg-bg-main">
            <Header />

            <br/>
            <br/>

            {/*barra de pesquisa*/}
            {/* barra de pesquisa e botão juntos */}
            <div className="flex items-center ml-20 gap-2">
            <div className="relative w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar evento..."
                className="w-full
                    bg-white
                    border border-gray-200
                    rounded-xl
                    py-3
                    pl-9 pr-4
                    text-sm
                    text-text-primary
                    placeholder:text-gray-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-brand-blue/20
                    shadow-sm"
                />
            </div>

            <button className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-blue-hover transition shadow-lg shadow-brand-blue/20">
                Solicitar Reserva
            </button>
            </div>

            <br/>
            <br/>
            
            {/*tabela de reservas*/}
            {filteredReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 text-gray-500 mt-20">
                    <FaCalendarAlt size={48} className="text-gray-400"/>
                    <p className="text-lg text-gray-400">Nenhuma reserva encontrada</p>
                </div>
            ):(
                <div className= "px-20">
                    <table className="min-w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                            <tr className = "relative hover:bg-gray-50 transition">
                                <th className="px-6 py-4">Evento</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Hora</th>
                                <th className="px-6 py-4">Espaço</th>
                                <th className="px-6 py-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">{r.event}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{r.date}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{r.time}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{r.space}</td>

                                <td className="px-6 py-4 font-medium text-gray-900 flex justify-center gap-6">
                                <button title="Ver detalhes" className="text-blue-500 hover:text-blue-700 transition">
                                    <FaEye size={18} />
                                </button>

                                <button
                                    title="Cancelar reserva"
                                    onClick={() => {
                                        setReservationToDelete(r.id);
                                        setShowModal(true);
                                    }}
                                    className="text-red-500 hover:text-red-700 transition">
                                    <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                </div>
            )}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}>
                <div
                    className="bg-white rounded-lg shadow-2xl w-96 p-6"
                    onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4">Confirmar Exclusão</h2>
                <p className="mb-6 text-gray-700">
                    O evento será cancelado no sistema, mas seus inscritos não serão notificados. Esta ação é definitiva.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                        Cancelar
                    </button>
                <button
                    onClick={() => {
                        handleCancel(reservationToDelete);
                        setShowModal(false);}}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        Confirmar cancelamento
                </button>
            </div>
            </div>
        </div>
        )}



            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            <Footer />
        </div>
    );
}

export default ReservationPage;