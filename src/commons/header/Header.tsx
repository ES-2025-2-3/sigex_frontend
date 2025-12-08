import React from "react";
import "./Header.css";
import Button from "../button/Button";

import logoSigex from "../../assets/icons/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="header-container">
      <div className="header-content container">
        <Link to="/" className="header-logo logo-click">
          <img src={logoSigex} alt="Logo SIGEX" className="logo-img" />
          <span className="logo-text">SIGEX</span>
        </Link>

        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Início
          </Link>

          <Link
            to="/eventos"
            className={`nav-link ${
              location.pathname.startsWith("/eventos") ? "active" : ""
            }`}
          >
            Eventos
          </Link>

          <Link
            to="/reserva"
            className={`nav-link ${
              location.pathname.startsWith("/reserva") ? "active" : ""
            }`}
          >
            Solicitar Reserva
          </Link>

          <Link
            to="/sobre"
            className={`nav-link ${
              location.pathname === "/sobre" ? "active" : ""
            }`}
          >
            Sobre
          </Link>
        </nav>

        <div className="header-actions">
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            size="small"
            style={{ borderColor: "white", color: "white" }}
          >
            Entrar
          </Button>
          <Button variant="primary" size="small">
            Cadastrar-se
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
