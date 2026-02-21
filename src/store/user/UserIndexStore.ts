import IndexStoreBase from "../base/IndexStoreBase";
import UserDomain from "../../domain/user/UserDomain";
import { computed, action, runInAction, makeObservable } from "mobx";
import { UserType } from "../../domain/enums/UserType";
import UserService from "../../services/UserService";

class UserIndexStore extends IndexStoreBase<UserDomain> {

  constructor() {
    super();
    makeObservable(this);
  }

  @computed
  get staffMembers() {
    return this.allRecords.filter(user => user.type === UserType.SERVIDOR_TECNICO_ADMINISTRATIVO);
  }

  @computed
  get admins() {
    return this.allRecords.filter(user => user.type === UserType.ADMIN);
  }

  @computed
  get allUsers() {
    return this.allRecords.filter(user => user.type === UserType.USUARIO);
  }

  @computed
  get users() {
    return this.allRecords;
  }

  @action
  getUserById(userId: string): UserDomain | undefined {
    return this.allRecords.find(user => user.id === userId);
  }

  @action
  async fetch() {
    await this.runFetch(async () => {
      const response = await UserService.getAll();
      const users = response.map((u: Record<string, unknown>) => new UserDomain(u));
      runInAction(() => { this.allRecords = users; });

      return users;
    });
  }

  @action
  async promote(userId: string) {
    try {
      await UserService.promote(userId);
      runInAction(() => {
        const user = this.allRecords.find(u => u.id === userId);
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
      await UserService.demote(userId);
      runInAction(() => {
        const user = this.allRecords.find(u => u.id === userId);
        if (user) user.updateType(UserType.SERVIDOR_TECNICO_ADMINISTRATIVO);
      });
      return true;
    } catch (error) {
      console.error("Erro ao rebaixar usuário:", error);
      return false;
    }
  }
}

export const userIndexStore = new UserIndexStore();