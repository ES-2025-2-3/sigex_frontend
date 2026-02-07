import { UserType } from "../src/domain/enums/UserType";
import UserDomain from "../src/domain/user/UserDomain";

/**
 * Mock de um usuário logado para fins de desenvolvimento e testes de UI.
 */
export const mockUser = new UserDomain({
  id: 1,
  name: "Nicole Brito Maracajá",
  email: "nicole.brito.maracaja@ccc.ufcg.edu.br",
  username: "nicole.maracaja",
  registrationNumber: "123111413",
  type: UserType.DOCENTE,
});
