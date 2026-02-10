import { UserType } from "../src/domain/enums/UserType";
import UserDomain from "../src/domain/user/UserDomain";

/**
 * Mock de um usuário logado para fins de desenvolvimento e testes de UI.
 */
export const mockUser = new UserDomain({
  id: 1,
  name: "Administrador",
  email: "administradorsistema@ufcg.edu.br",
  username: "administrador",
  type: UserType.ADMIN,
});
