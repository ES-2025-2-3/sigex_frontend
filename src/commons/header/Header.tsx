import React from 'react';
import './Header.css';
import Button from '../button/Button';

import logoSigex from '../../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {

  const navigate = useNavigate();

  return (
    <header className="header-container">
      <div className="header-content container">
        <div className="header-logo">
          <img src={logoSigex} alt="Logo SIGEX" className="logo-img" /> 
          <span className="logo-text">SIGEX</span>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link active">Início</Link>
          <Link to="/eventos" className="nav-link">Eventos</Link>
          <Link to="/reserva" className="nav-link">Solicitar Reserva</Link>
          <Link to="/sobre" className="nav-link">Sobre</Link>
        </nav>

        <div className="header-actions">
          <Button onClick={() => navigate('/login')} variant="outline" size="small" style={{borderColor: 'white', color: 'white'}}>
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