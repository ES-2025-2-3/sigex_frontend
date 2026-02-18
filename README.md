🚀 Frontend - SIGEX

Este é o repositório do frontend da aplicação, desenvolvido com o objetivo de oferecer uma interface moderna, rápida e segura para a gestão e reserva de eventos de extensão da UFCG.

🛠 Tecnologias Utilizadas

    React.js: Biblioteca principal para a construção da interface.
    TypeScript: Adição de tipagem estática para maior segurança e produtividade.
    Vite: Ferramenta de build de última geração para um desenvolvimento ágil.
    Tailwind CSS: Framework CSS utilitário para design responsivo.
    MobX: Gerenciamento de estado global reativo e escalável.
    Axios: Cliente HTTP para integração com a API REST.

📁 Estrutura de Pastas

A arquitetura foi pensada para manter a separação de responsabilidades e facilitar a manutenção:
Bash

src/
├── commons/      # Componentes compartilhados (Buttons, Modals, Toasts)
├── domain/       # Modelos de dados e Enums (Regras de negócio)
├── pages/        # Telas principais da aplicação
├── services/     # Camada de comunicação com o Backend (API)
├── store/        # Gerenciamento de estado global (MobX Stores)
└── routes/       # Configuração de roteamento e proteção de páginas

🔐 Segurança e Autenticação

O sistema utiliza um modelo de segurança híbrido:

    Rotas Públicas: Visualização de eventos disponível para todos os usuários.
    Rotas Privadas: Ações como reservas e gestão administrativa exigem um Token JWT.
    Persistência: O token é armazenado no LocalStorage e injetado automaticamente em todas as requisições protegidas via Interceptores do Axios.

🚀 Como Executar o Projeto

Certifique-se de ter o Node.js e o Yarn instalados em sua máquina.

    Clone o repositório:
    Bash

    git clone https://github.com/seu-usuario/seu-repositorio.git

    Instale as dependências:
    Bash

    yarn install

    Inicie o servidor de desenvolvimento:
    Bash

    yarn dev

    O projeto estará disponível em http://localhost:5173

    Build para produção:
    Bash

    yarn build

🖇️ Integração com o Backend

Para o funcionamento pleno das funcionalidades, certifique-se de que o Servidor Backend (Spring Boot) esteja rodando.
