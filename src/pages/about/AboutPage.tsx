import React from "react";
import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import "./AboutPage.css";

import imageUfcg from '../../assets/images/UFCG.jpg';


const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: "Allan de Albuquerque Monteiro",
      role: "Frontend Dev",
    },
    { 
      name: "Arthur Fernandes Vieira", 
      role: "Gerente Backend & Tech Lead" 
    },
    {
      name: "Arthur Vasconcelos do Rego Barros",
      role: "Frontend Dev",
    },
    {
      name: "Bruna Letícia dos Anjos Medeiros",
      role: "Backend Dev",
    },
    {
      name: "Débora Sabrina de Oliveira Pereira",
      role: "Frontend Dev",
    },
    {
      name: "Ewerton Fernandes de Souza",
      role: "Backend Dev",
    },
    {
      name: "Isaque Esdras Rocha da Silva Soares Cavalcante",
      role: "Backend Dev",
    },
    { 
      name: "Nicolas Wesley Correia Paz", 
      role: "Frontend Dev" 
    },
    { 
      name: "Nicole Brito Maracajá", 
      role: "Gerente Frontend & Tech Lead" 
    },
    { 
      name: "Rodrigo Paulo de Oliveira", 
      role: "Backend dev" 
    },
    {
      name: "Wendel Silva Italiano de Araújo",
      role: "Gerente de Projeto & Backend Dev",
    },
  ];

  return (
    <div className="about-page-container">
      <Header />

      <main className="about-content">
        <section className="about-header">
          <h1>Sobre o SIGEX</h1>
          <p className="subtitle">
            Conectando a comunidade acadêmica à infraestrutura de extensão da
            UFCG.
          </p>
        </section>

        <div className="about-image-wrapper">
          <img 
            src={imageUfcg} 
            alt="Campus da Universidade" 
            className="about-image" 
          />
        </div>

        <section className="text-block">
          <h2>O Projeto</h2>
          <p>
            O{" "}
            <strong>
              Sistema de Gerenciamento de Eventos de Extensão (SIGEX)
            </strong>{" "}
            nasceu da necessidade de modernizar e centralizar o processo de
            agendamento de espaços e divulgação de eventos dentro da
            Universidade Federal de Campina Grande.
          </p>
          <p>
            Nossa missão é facilitar a vida de professores, alunos e servidores
            técnico-administrativos, eliminando a burocracia de papéis e
            planilhas descentralizadas. Com o SIGEX, é possível visualizar a
            disponibilidade de auditórios em tempo real, solicitar reservas e
            divulgar eventos para toda a comunidade em um único lugar.
          </p>
        </section>

        <section className="team-section">
          <h2>Quem Faz Acontecer</h2>
          <p>
            Este projeto foi desenvolvido pelos seguintes alunos de Ciência da Computação na disciplina de Engenharia de Software, ministrada pelo Prof. Rohit Geyhi:
          </p>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.name.charAt(0)}</div>
                <div className="team-name">{member.name}</div>
                <div className="team-role">{member.role}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
