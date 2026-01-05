import React from "react";
import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";

import imageUfcg from '../../assets/images/UFCG.jpg';

const AboutPage: React.FC = () => {
  const teamMembers = [
    { name: "Allan de Albuquerque Monteiro", role: "Frontend Dev" },
    { name: "Arthur Fernandes Vieira", role: "Gerente Backend & Tech Lead" },
    { name: "Arthur Vasconcelos do Rego Barros", role: "Frontend Dev" },
    { name: "Bruna Letícia dos Anjos Medeiros", role: "Backend Dev" },
    { name: "Débora Sabrina de Oliveira Pereira", role: "Frontend Dev" },
    { name: "Ewerton Fernandes de Souza", role: "Backend Dev" },
    { name: "Isaque Esdras Rocha da Silva Soares Cavalcante", role: "Backend Dev" },
    { name: "Nicolas Wesley Correia Paz", role: "Frontend Dev" },
    { name: "Nicole Brito Maracajá", role: "Gerente Frontend & Tech Lead" },
    { name: "Rodrigo Paulo de Oliveira", role: "Backend dev" },
    { name: "Wendel Silva Italiano de Araújo", role: "Gerente de Projeto & Backend Dev" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      <main className="flex-1 max-w-[900px] mx-auto px-5 py-16">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#212A3E] mb-4 font-montserrat">
            Sobre o SIGEX
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-[600px] mx-auto leading-relaxed">
            Conectando a comunidade acadêmica à infraestrutura de extensão da UFCG.
          </p>
        </section>

        <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl mb-12">
          <img 
            src={imageUfcg} 
            alt="Campus da Universidade" 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
          />
        </div>

        <section className="mb-10 text-justify leading-relaxed text-gray-700 text-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-4 font-montserrat">
            O Projeto
          </h2>
          <p className="mb-4">
            O <strong className="text-gray-900">Sistema de Gerenciamento de Eventos de Extensão (SIGEX)</strong> nasceu da necessidade de modernizar e centralizar o processo de agendamento de espaços e divulgação de eventos dentro da Universidade Federal de Campina Grande.
          </p>
          <p>
            Nossa missão é facilitar a vida de professores, alunos e servidores técnico-administrativos, eliminando a burocracia de papéis e planilhas descentralizadas. Com o SIGEX, é possível visualizar a disponibilidade de auditórios em tempo real, solicitar reservas e divulgar eventos para toda a comunidade em um único lugar.
          </p>
        </section>

        <section className="mt-16 border-t border-gray-300 pt-10 text-justify">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-4 font-montserrat">
            Quem Faz Acontecer
          </h2>
          <p className="text-gray-700 mb-8">
            Este projeto foi desenvolvido pelos seguintes alunos de Ciência da Computação na disciplina de Engenharia de Software, ministrada pelo Prof. Rohit Geyhi:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <div className="font-bold text-gray-800 mb-1 leading-tight">{member.name}</div>
                <div className="text-sm text-gray-500">{member.role}</div>
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
