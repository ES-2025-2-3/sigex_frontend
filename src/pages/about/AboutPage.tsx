import React from "react";
import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";

import imageUfcg from "../../assets/images/UFCG.jpg";

const AboutPage: React.FC = () => {
  const teamMembers = [
    { name: "Allan de Albuquerque Monteiro", role: "Frontend Dev" },
    { name: "Arthur Fernandes Vieira", role: "Gerente Backend & Tech Lead" },
    { name: "Arthur Vasconcelos do Rego Barros", role: "Frontend Dev" },
    { name: "Bruna Letícia dos Anjos Medeiros", role: "Backend Dev" },
    { name: "Débora Sabrina de Oliveira Pereira", role: "Frontend Dev" },
    { name: "Ewerton Fernandes de Souza", role: "Backend Dev" },
    {
      name: "Isaque Esdras Rocha da Silva Soares Cavalcante",
      role: "Backend Dev",
    },
    { name: "Nicolas Wesley Correia Paz", role: "Frontend Dev" },
    { name: "Nicole Brito Maracajá", role: "Gerente Frontend & Tech Lead" },
    { name: "Rodrigo Paulo de Oliveira", role: "Backend dev" },
    {
      name: "Wendel Silva Italiano de Araújo",
      role: "Gerente de Projeto & Backend Dev",
    },
  ];

  const objetivos = [
    "Registrar e acompanhar solicitações de uso dos espaços;",
    "Gerenciar reservas e controlar a disponibilidade de horários;",
    "Visualizar eventos da universidade;",
    "Organizar informações sobre infraestrutura, equipamento e regras de uso;",
    "Apoiar a comunicação entre solicitantes e a administração.",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <Header />

      <main className="flex-1 max-w-[1000px] mx-auto px-5 py-16">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#212A3E] mb-4 font-montserrat">
            Sobre o SIGEX
          </h1>
          <div className="h-1 w-20 bg-brand-blue mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-gray-500 max-w-[750px] mx-auto leading-relaxed">
            O Sistema Integrado de Gestão da Extensão é a plataforma oficial
            para a gestão de eventos e espaços de extensão na UFCG.
          </p>
        </section>

        <div className="w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl mb-16">
          <img
            src={imageUfcg}
            alt="Campus UFCG"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="flex flex-col gap-12 mb-20">
          <section className="space-y-6 w-full">
            <div>
              <h2 className="text-2xl font-bold text-brand-blue mb-4 font-montserrat">
                O Projeto
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify text-lg">
                Desenvolvido para apoiar a gestão de eventos da{" "}
                <strong>Universidade Federal de Campina Grande (UFCG)</strong>,
                o sistema centraliza e organiza a solicitação e o controle de
                reservas de espaços, com foco inicial no Centro de Extensão José
                Farias.
              </p>
            </div>

            <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 w-full shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-6 bg-brand-blue rounded-full"></span>
                Público-Alvo
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Destinado à comunidade acadêmica da UFCG, incluindo discentes,
                docentes e servidores, bem como às equipes responsáveis pela
                gestão de espaços e eventos.
              </p>
            </div>
          </section>

          <section className="w-full">
            <h2 className="text-2xl font-bold text-brand-blue mb-6 font-montserrat">
              Por meio do SIGEX, é possível
            </h2>
            <ul className="space-y-4">
              {objetivos.map((item, index) => (
                <li
                  key={index}
                  className="flex gap-4 text-gray-700 text-lg group items-start"
                >
                  <span className="text-brand-blue font-bold text-xl mt-1 group-hover:scale-125 transition-transform">
                    •
                  </span>
                  <span className="border-b border-gray-100 pb-2 w-full transition-all">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mb-20 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-brand-blue mb-4 font-montserrat">
            Pró-Reitoria de Extensão (PROPEX)
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            A PROPEX é responsável pelo planejamento e fortalecimento das ações
            de extensão universitária na UFCG. O SIGEX atua como uma ferramenta
            estratégica para esta gestão, promovendo a integração entre a
            universidade e a sociedade de forma transparente e padronizada.
          </p>
          <div className="mt-4">
            <a
              href="https://www.extensao.ufcg.edu.br/"
              target="_blank"
              rel="noreferrer"
              className="text-brand-blue font-semibold hover:underline flex items-center gap-2"
            >
              Visite o site oficial da PROPEX →
            </a>
          </div>
        </section>

        <section className="mt-16 border-t border-gray-200 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-blue mb-4 font-montserrat">
              Equipe de Desenvolvimento
            </h2>
            <p className="text-gray-500">
              Alunos de Ciência da Computação - Disciplina de Engenharia de
              Software <br />
              Universidade Federal de Campina Grande
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-50"
              >
                <div className="w-14 h-14 bg-gray-100 text-brand-blue group-hover:bg-brand-blue group-hover:text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-colors">
                  {member.name.charAt(0)}
                </div>
                <div className="font-bold text-gray-800 mb-1 leading-tight group-hover:text-brand-blue transition-colors">
                  {member.name}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  {member.role}
                </div>
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
