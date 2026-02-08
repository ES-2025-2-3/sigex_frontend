import React, { useState } from "react";
import { FaUserShield, FaChevronDown, FaChartPie, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    navigate('/login');
  };

  const handleGoToPanel = () => {
    setIsOpen(false);
    navigate('/admin');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all"
      >
        <FaUserShield className="text-brand-blue" />
        <span className="text-white text-sm font-bold">Admin</span>
        <FaChevronDown className={`text-white text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[1000]" 
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl p-2 z-[1001] animate-in fade-in slide-in-from-top-2">
            <button 
              onClick={handleGoToPanel}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-brand-blue hover:bg-blue-50 rounded-xl transition-all uppercase tracking-tighter"
            >
              <FaChartPie /> ACESSAR PAINEL
            </button>
            
            <div className="border-t border-slate-100 my-1"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase tracking-tighter"
            >
              <FaSignOutAlt /> Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDropdown;