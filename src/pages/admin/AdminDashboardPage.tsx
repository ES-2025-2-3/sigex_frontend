import { observer } from 'mobx-react-lite';
import { FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';
import Header from "../../commons/header/Header";
import MetricCard from '../../commons/components/MetricCard';
import AdminSidebar from '../../commons/admin/AdminSidebar';
import AdminCalendarView from '../../commons/admin/AdminCalendarView';
import { booking_mock } from '../../../mock/booking';

const AdminDashboardPage = observer(() => {
  const totalSolicitadas = booking_mock.filter(b => b.status === "SOLICITADA").length;
  const totalAprovadas = booking_mock.filter(b => b.status === "APROVADA").length;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full font-inter">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-10 space-y-10 flex flex-col items-center">
          <div className="w-full max-w-6xl space-y-10">
            
            <header className="flex justify-between items-end">
              <div>
                <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">Visão Geral</p>
                <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter uppercase leading-none">Dashboard</h1>
              </div>
            </header>

            <div className="flex gap-8">
              <MetricCard 
                label="Solicitações Pendentes" 
                value={totalSolicitadas.toString().padStart(2, '0')}
                icon={FaHourglassHalf} 
                colorClass="amber" 
              />
              <MetricCard 
                label="Reservas Confirmadas" 
                value={totalAprovadas.toString().padStart(2, '0')} 
                icon={FaCheckCircle} 
                colorClass="blue" 
              />
            </div>

            <section className="space-y-6">
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Agenda de Ocupação</h2>
              <AdminCalendarView />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
});

export default AdminDashboardPage;
