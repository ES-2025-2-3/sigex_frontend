import React from "react";
import { observer } from "mobx-react-lite";
import Button from "../button/Button";
import logoSigex from "../../assets/icons/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserDropdown from "../user/UserDropdown";
import { userSessionStore } from "../../store/user/UserSessionStore";

const Header: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = userSessionStore.isLoggedIn;

  const getLinkClass = (path: string, exact = false) => {
    const isActive = exact
      ? location.pathname === path
      : location.pathname.startsWith(path);

    return `text-[0.95rem] font-medium transition-colors duration-200 ${
      isActive ? "text-white" : "text-[#b0b3b8] hover:text-white"
    }`;
  };

  return (
    <header className="bg-brand-dark py-4 sticky top-0 z-[1000] shadow-lg font-inter">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto px-5">
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

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <UserDropdown />
          ) : (
            <>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                size="small"
                className="!border-white !text-white hover:!bg-white hover:!text-brand-dark transition-all"
              >
                Entrar
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => navigate("/cadastro")}
              >
                Cadastrar-se
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;

