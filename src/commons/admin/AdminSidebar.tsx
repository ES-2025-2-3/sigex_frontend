import React from "react";
import { FaChartLine, FaRegCalendarCheck, FaLayerGroup, FaUsers, FaCog, FaSignOutAlt, FaRocket } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { userSessionStore } from "../../store/user/UserSessionStore";

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = userSessionStore.user;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaChartLine />, path: "/admin" },
    { id: "requests", label: "Solicitações", icon: <FaRegCalendarCheck />, path: "/admin/requests" },
    { id: "spaces", label: "Espaços", icon: <FaLayerGroup />, path: "/admin/espacos" },
    { id: "users", label: "Usuários", icon: <FaUsers />, path: "/admin/users" },
    { id: "settings", label: "Configurações", icon: <FaCog />, path: "/admin/configuracoes" },
  ];

  return (
    <aside className="w-96 min-w-[384px] bg-[#1e293b] flex flex-col h-screen sticky top-0 z-[1001] shadow-2xl shrink-0 font-inter">
      <div className="p-10 mb-4 border-b border-white/5">
        <h2 className="text-white font-black text-3xl tracking-tighter flex items-center gap-3 italic uppercase">
          <FaRocket className="text-brand-blue" /> SIGEX
        </h2>
      </div>

      <nav className="flex-1 px-6 space-y-3 mt-6">
        <p className="text-[13px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4 mb-6 opacity-50">
          Navegação Principal
        </p>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all group
                ${isActive ? "bg-brand-blue text-white shadow-xl scale-[1.02]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-8">
        <div className="bg-white/5 rounded-[2.5rem] p-5 flex items-center gap-4 border border-white/5 backdrop-blur-sm">
          <div className="w-14 h-14 rounded-2xl bg-brand-blue flex items-center justify-center text-white font-black text-xl shadow-lg">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-black text-white truncate uppercase tracking-tighter">
              {user?.name || "Administrador"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-[10px] font-black text-slate-500 hover:text-red-400 uppercase flex items-center gap-1 transition-all mt-1"
            >
              <FaSignOutAlt size={10} /> Sair do Painel
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;