import React from 'react';
import logoPropex from '../../assets/icons/PROPEX.png'; 

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A2232] text-white pt-10 mt-auto w-full">
      <div className="max-w-[1200px] mx-auto px-5 pb-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
        
        <div className="flex justify-center md:justify-start">
          <img 
            src={logoPropex} 
            alt="Logo PROPEX" 
            className="max-w-[250px] h-auto object-contain" 
          />
        </div>

        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
          <h4 className="m-0 text-lg font-bold uppercase tracking-wider text-white">
            Contato
          </h4>
          <p className="text-[#B0B3B8] text-[0.95rem]">
            suporte@sigex.ufcg.edu.br
          </p>
          
          <div className="flex gap-4 mt-1">
            <span className="text-[#B0B3B8] text-[0.85rem] cursor-pointer hover:text-brand-blue transition-colors duration-200">
              Instagram
            </span>
            <span className="text-[#B0B3B8] text-[0.85rem] cursor-pointer hover:text-brand-blue transition-colors duration-200">
              Twitter
            </span>
          </div>
        </div>
        
      </div>

      <div className="bg-[#151B28] text-center py-5 text-[0.85rem] text-[#6C757D] border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} SIGEX - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;