import React from "react";
import { observer } from "mobx-react-lite";
import Button from "../components/Button";
import logoSigex from "../../assets/icons/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserDropdown from "../user/UserDropdown";
import { userSessionStore } from "../../store/user/UserSessionStore";
import AdminDropdown from "../admin/AdminDropdown";

const Header: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = userSessionStore.isLoggedIn;
  const user = userSessionStore.user;
  const isInsideAdminPanel = location.pathname.startsWith("/admin");
  const isAdminUser = user && String(user.type).toUpperCase() === "ADMIN";

  const navTextStyle = "text-[0.80rem] font-black uppercase tracking-[0.15em]";
  const btnTextStyle = "text-[0.70rem] font-black tracking-wide";

  const getLinkClass = (path: string, exact = false) => {
    const isActive = exact
      ? location.pathname === path
      : location.pathname.startsWith(path);

    return `${navTextStyle} transition-colors duration-200 ${
      isActive ? "text-white" : "text-[#b0b3b8] hover:text-white"
    }`;
  };

  return (
    <header className="bg-brand-dark py-5 sticky top-0 z-[1000] shadow-lg font-inter w-full border-b border-white/5">
      <div
        className={`flex items-center justify-between px-8 ${isInsideAdminPanel ? "w-full" : "max-w-[1200px] mx-auto"}`}
      >
        {!isInsideAdminPanel && (
          <Link
            to="/"
            className="flex items-center gap-3 no-underline cursor-pointer transition-all duration-400 hover:scale-105 hover:opacity-90"
          >
            <img
              src={logoSigex}
              alt="Logo SIGEX"
              className="h-10 w-auto object-contain"
            />
            <span className="text-white text-2xl font-bold tracking-wider">
              SIGEX
            </span>
          </Link>
        )}

        {!isInsideAdminPanel && (
          <nav className="hidden md:flex gap-8">
            <Link to="/" className={getLinkClass("/", true)}>
              Início
            </Link>
            <Link to="/eventos" className={getLinkClass("/eventos")}>
              Eventos
            </Link>
            <Link to="/reserva" className={getLinkClass("/reserva")}>
              Solicitar Reserva
            </Link>
            <Link to="/sobre" className={getLinkClass("/sobre", true)}>
              Sobre
            </Link>
          </nav>
        )}

        {isInsideAdminPanel && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[15px] font-black uppercase tracking-[0.3em]">
              Ambiente de Gestão
            </span>
          </div>
        )}

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            isAdminUser ? (
              <AdminDropdown />
            ) : (
              <UserDropdown />
            )
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                size="small"
                className={`!${btnTextStyle} !border-white !text-white !px-4`}
              >
                Entrar
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => navigate("/cadastro")}
                className={`!${btnTextStyle} !px-4`}
              >
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;
