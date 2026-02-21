import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { FaHourglassHalf, FaCalendarDay } from "react-icons/fa";
import Header from "../../commons/header/Header";
import MetricCard from "../../commons/components/MetricCard";
import AdminSidebar from "../../commons/admin/AdminSidebar";
import AdminCalendarView from "../../commons/admin/AdminCalendarView";
import Footer from "../../commons/footer/Footer";

import { eventIndexStore } from "../../store/event/EventIndexStore";
import { ReservationStatus } from "../../domain/enums/ReservationStatus";
import LoadingSpinner from "../../commons/components/LoadingSpinner";

import { reservationIndexStore } from "../../store/reservation/ReservationIndexStore";

const AdminDashboardPage = observer(() => {
  useEffect(() => {
    reservationIndexStore.fetch();
  }, []);

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const todayString = `${day}/${month}/${year}`;

  const totalSolicitadas = reservationIndexStore.allBookings.filter(
    (r) => r.status === ReservationStatus.PENDENTE
  ).length;


  const totalEventosHoje = reservationIndexStore.allBookings.filter(
    (r) => r.status === ReservationStatus.APROVADO && r.date === todayString
  ).length;

  const loading = reservationIndexStore.loading;

  return (
    <div className="flex min-h-screen bg-bg-main w-full font-inter">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-10 space-y-10 flex flex-col items-center">
          <div className="w-full max-w-6xl space-y-10">
            <header className="flex justify-between items-end">
              <div>
                <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">
                  Visão Geral
                </p>
                <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase leading-none">
                  Dashboard
                </h1>
              </div>
              {loading && <LoadingSpinner size="small" />}
            </header>

            <div className="flex gap-8">
              <MetricCard
                label="Solicitações Pendentes"
                value={totalSolicitadas.toString().padStart(2, "0")}
                icon={FaHourglassHalf}
                colorClass="amber"
              />
              <MetricCard
                label="Eventos para Hoje"
                value={totalEventosHoje.toString().padStart(2, "0")}
                icon={FaCalendarDay}
                colorClass="blue"
              />
            </div>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">
                  Agenda de Ocupação
                </h2>
              </div>
              <AdminCalendarView />
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
});

export default AdminDashboardPage;
