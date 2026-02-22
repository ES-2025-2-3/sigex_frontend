import IndexStoreBase from "../base/IndexStoreBase";
import UserDomain from "../../domain/user/UserDomain";
import { computed, action, runInAction, makeObservable } from "mobx";
import { UserType } from "../../domain/enums/UserType";
import UserService from "../../services/UserService";
import InstituteService from "../../services/InstituteService";

class UserIndexStore extends IndexStoreBase<UserDomain> {
  constructor() {
    super();
    makeObservable(this);
  }

  @computed
  get staffMembers() {
    return this.allRecords.filter(
      (user) => user.type === UserType.SERVIDOR_TECNICO_ADMINISTRATIVO,
    );
  }

  @computed
  get admins() {
    return this.allRecords.filter((user) => user.type === UserType.ADMIN);
  }

  @computed
  get allUsers() {
    return this.allRecords.filter((user) => user.type === UserType.USUARIO);
  }

  @computed
  get users() {
    return this.allRecords;
  }

  @action
  async fetch() {
    await this.runFetch(async () => {
      const response = await UserService.getAll();
      const users = response.map(
        (u: Record<string, unknown>) => new UserDomain(u),
      );
      runInAction(() => {
        this.allRecords = users;
      });

      return users;
    });
  }

  @action
  async promote(userId: string) {
    try {
      const globalInstituteId = await InstituteService.getGlobalId();
      await UserService.promote(userId, globalInstituteId);

      runInAction(() => {
        const user = this.allRecords.find((u) => u.id === userId);
        if (user) user.updateType(UserType.SERVIDOR_TECNICO_ADMINISTRATIVO);
      });
      return true;
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      return false;
    }
  }

  @action
  async demote(userId: string) {
    try {
      const globalInstituteId = await InstituteService.getGlobalId();
      await UserService.demote(userId, globalInstituteId);

      runInAction(() => {
        const user = this.allRecords.find((u) => u.id === userId);
        if (user) {
          user.updateType(UserType.USUARIO);
        }
      });
      return true;
    } catch (error) {
      console.error("Erro ao rebaixar usuário:", error);
      return false;
    }
  }

  @action
  async deleteUser(userId: string) {
    try {
      await UserService.delete(userId); 
      runInAction(() => {
        this.allRecords = this.allRecords.filter(u => u.id !== userId);
      });
      return true;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return false;
    }
  }
}

export const userIndexStore = new UserIndexStore();
