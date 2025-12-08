import React from 'react';
import './Footer.css';

import logoPropex from '../../assets/icons/PROPEX.png'; 

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="container footer-content">
        
        <div className="footer-brand">
          <img src={logoPropex} alt="Logo PROPEX" className="footer-logo-img" />
        </div>

        <div className="footer-contact">
          <h4>Contato</h4>
          <p>suporte@sigex.ufcg.edu.br</p>
          <div className="social-icons">
            <span className="icon-link">Instagram</span>
            <span className="icon-link">Twitter</span>
          </div>
        </div>
        
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 SIGEX - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;