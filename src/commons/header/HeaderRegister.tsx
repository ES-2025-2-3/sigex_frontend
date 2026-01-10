import React from "react";
import logoSigex from "../../assets/icons/logo.png";
import { Link } from "react-router-dom";

const HeaderRegister: React.FC = () => {
  return (
    <header className="bg-brand-dark py-4 sticky top-0 z-[1000] shadow-lg font-inter">
      <div className="flex items-center justify-center md:justify-start max-w-[1200px] mx-auto px-5">
        <Link
          to="/"
          className="flex items-center gap-3 no-underline cursor-pointer transition-all duration-400 hover:scale-105 hover:opacity-90"
        >
          <img
            src={logoSigex}
            alt="Logo SIGEX"
            className="h-10 w-auto object-contain"
          />
          <span className="text-white text-2xl font-bold tracking-wider uppercase">
            SIGEX
          </span>
        </Link>
      </div>
    </header>
  );
};

export default HeaderRegister;