import {
  makeObservable,
  runInAction,
  computed,
  observable,
  action,
} from "mobx";
import UserDomain from "../../domain/user/UserDomain";
import { UserType } from "../../domain/enums/UserType";

class UserManagementStore {
  @observable accessor users: UserDomain[] = [];
  @observable accessor isLoading = false;

  constructor() {
    makeObservable(this);
    this.loadInitialData();
  }

  @action
  loadInitialData() {
    const rawData = [
      {
        id: "101",
        name: "José Farias",
        email: "jose.farias@ufcg.edu.br",
        type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
      },
      {
        id: "102",
        name: "Maria Oliveira",
        email: "maria.docente@ufcg.edu.br",
        type: UserType.USUARIO,
      },
      {
        id: "103",
        name: "Nicole Maracajá",
        email: "nicole@ccc.ufcg.edu.br",
        type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
      },
      {
        id: "104",
        name: "Ricardo Silva",
        email: "ricardo.servidor@ufcg.edu.br",
        type: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
      },
      {
        id: "105",
        name: "Ana Beatriz",
        email: "ana.externo@gmail.com",
        type: UserType.USUARIO,
      },
    ];

    this.users = rawData.map((data) => new UserDomain(data));
  }

  @computed
  get staffMembers() {
    return this.users.filter((user) => user.isStaff);
  }

  @computed
  get availableServidores() {
    return this.users.filter(
      (user) => user.canBePromotedToStaff && !user.isStaff,
    );
  }

  /* Promove servidor para funcionário */
  @action
  async promoteToStaff(userId: string | null | undefined) {
    if (!userId) return;
    this.isLoading = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      runInAction(() => {
        const user = this.users.find((u) => u.id === userId);

        if (user && user.type === UserType.USUARIO) {
          user.updateType(UserType.SERVIDOR_TECNICO_ADMINISTRATIVO);
          console.log(`Usuário ${user.name} promovido a Funcionário.`);
        }

        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => (this.isLoading = false));
      console.error("Erro ao promover usuário:", error);
    }
  }

  /* Remove privilégios */
  @action
  async demoteToUser(userId: string | null | undefined) {
    if (!userId) return;
    this.isLoading = true;

    await new Promise((resolve) => setTimeout(resolve, 400));

    runInAction(() => {
      const user = this.users.find((u) => u.id === userId);
      if (user && user.isStaff) {
        user.updateType(UserType.SERVIDOR_TECNICO_ADMINISTRATIVO);
      }
      this.isLoading = false;
    });
  }

  getUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }
}

export const userManagementStore = new UserManagementStore();
