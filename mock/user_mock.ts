// mock/users.ts
import { UserType } from "../src/domain/enums/UserType";

export interface User {
  id: number;
  name: string;
  email: string;
  registrationNumber: string;
  type: UserType;
}

export const user_mock: User[] = [
  {
    id: 1,
    name: "João Admin",
    email: "joao.admin@email.edu.br",
    registrationNumber: "100000001",
    type: UserType.ADMIN,
  },
  {
    id: 2,
    name: "Maria Docente",
    email: "maria.docente@email.edu.br",
    registrationNumber: "100000002",
    type: UserType.DOCENTE,
  },
  {
    id: 3,
    name: "Carlos Técnico",
    email: "carlos.tecnico@email.edu.br",
    registrationNumber: "100000003",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  },
  {
    id: 4,
    name: "Ana Admin",
    email: "ana.admin@email.edu.br",
    registrationNumber: "100000004",
    type: UserType.ADMIN,
  },
  {
    id: 5,
    name: "Paulo Docente",
    email: "paulo.docente@email.edu.br",
    registrationNumber: "100000005",
    type: UserType.DOCENTE,
  },
  {
    id: 6,
    name: "Fernanda Técnica",
    email: "fernanda.tecnica@email.edu.br",
    registrationNumber: "100000006",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  },
  {
    id: 7,
    name: "Lucas Técnico",
    email: "lucas.tecnico@email.edu.br",
    registrationNumber: "100000007",
    type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
  },
   {
    id: 8,
    name: "Lucas Técnico",
    email: "lucas.tecnico@email.edu.br",
    registrationNumber: "100000007",
    type: UserType.FUNCIONARIO,
  },
];
