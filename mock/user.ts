import { UserType } from "../src/domain/enums/UserType";
import UserDomain from "../src/domain/user/UserDomain";

/**
 * Usuário com perfil de Gestão Operacional (Ex: José Farias / Nicole)
 * Tem acesso a: Solicitações, Salas e Termos de Reserva.
 */
export const mockStaff = new UserDomain({
  id: "1",
  name: "Nicole Brito Maracajá",
  email: "nicole.brito.maracaja@ccc.ufcg.edu.br",
  registrationNumber: "123111413",
  type: UserType.FUNCIONARIO, // O novo tipo para gestão da unidade
});

/**
 * Usuário Administrador do Sistema
 * Tem acesso a: Gestão de Usuários (Promover Servidores) e Dashboard.
 */
export const mockAdmin = new UserDomain({
  id: "0",
  name: "Administrador do Sistema",
  email: "admin@ufcg.edu.br",
  registrationNumber: "000000000",
  type: UserType.ADMIN, // Permanece ADMIN para gerir os usuários
});

/**
 * Exemplo de um Servidor/Docente comum que pode ser promovido
 */
export const mockCommonUser = new UserDomain({
  id: "3",
  name: "João Servidor Exemplo",
  email: "joao.servidor@ufcg.edu.br",
  registrationNumber: "987654321",
  type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
});

/**
 * Lista integrada de usuários
 */
export const user_mock: UserDomain[] = [
  mockAdmin,
  mockStaff,
  new UserDomain({
    id: "2",
    name: "Maria Docente",
    email: "maria.docente@email.edu.br",
    registrationNumber: "100000002",
    type: UserType.DOCENTE,
  }),
  new UserDomain({
    id: "3",
    name: "João Servidor Exemplo",
    email: "joao.servidor@ufcg.edu.br",
    registrationNumber: "987654321",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  }),
  new UserDomain({
    id: "4",
    name: "Ana Admin",
    email: "ana.admin@email.edu.br",
    registrationNumber: "100000004",
    type: UserType.ADMIN,
  }),
  new UserDomain({
    id: "5",
    name: "Paulo Docente",
    email: "paulo.docente@email.edu.br",
    registrationNumber: "100000005",
    type: UserType.DOCENTE,
  }),
  new UserDomain({
    id: "6",
    name: "Fernanda Técnica",
    email: "fernanda.tecnica@email.edu.br",
    registrationNumber: "100000006",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  }),
  new UserDomain({
    id: "7",
    name: "Lucas Técnico",
    email: "lucas.tecnico@email.edu.br",
    registrationNumber: "100000007",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  }),
];
