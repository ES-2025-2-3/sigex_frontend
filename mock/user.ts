import UserDomain from "../src/domain/user/UserDomain";

/**
 * Mock de um usuário logado para fins de desenvolvimento e testes de UI.
 * Este objeto utiliza o UserDomain oficial para garantir consistência de tipos.
 */
export const mockUser = new UserDomain({
  name: "Nicole Brito Maracajá",
  email: "nicole.brito.maracaja@ccc.ufcg.edu.br",
  username: "nicole.maracaja",
  registrationNumber: "123111413",
  photoUrl:
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/68.png",
  affiliation: "Aluno",
});
