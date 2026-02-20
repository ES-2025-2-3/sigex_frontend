import { UserType } from "../src/domain/enums/UserType";

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

export const user_mock: User[] = [
  {
    id: "1",
    name: "João Admin",
    email: "joao.admin@email.edu.br",
    type: UserType.ADMIN,
  },
  {
    id: "2",
    name: "Maria Usuario",
    email: "maria.docente@email.edu.br",
    type: UserType.USUARIO,
  },
  {
    id: "3",
    name: "Carlos Técnico",
    email: "carlos.tecnico@email.edu.br",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  },
  {
    id: "4",
    name: "Ana Admin",
    email: "ana.admin@email.edu.br",
    type: UserType.ADMIN,
  },
  {
    id: "5",
    name: "Paulo Usuário",
    email: "paulo.docente@email.edu.br",
    type: UserType.USUARIO,
  },
  {
    id: "6",
    name: "Fernanda Técnica",
    email: "fernanda.tecnica@email.edu.br",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  },
  {
    id: "7",
    name: "Lucas Técnico",
    email: "lucas.tecnico@email.edu.br",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  },
   {
    id: "8",
    name: "Lucas Técnico",
    email: "lucas.tecnico@email.edu.br",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  },
];
