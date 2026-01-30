import { makeObservable, observable, action, computed } from "mobx";
import UserDomain from "../../domain/user/UserDomain";
import { UserType } from "../../domain/enums/UserType";

class UserSessionStore {
  @observable currentUser: UserDomain | null = null;

  constructor() {
    makeObservable(this);
  }

  @action loginMock(userData: Record<string, unknown>) {
    this.currentUser = new UserDomain(userData);
  }

  @action logout() {
    this.currentUser = null;
  }

  @computed get isLoggedIn() {
    return !!this.currentUser;
  }

  @computed get isAdmin() {
    return this.currentUser?.type=== UserType.ADMIN;
  }
}

export const userSessionStore = new UserSessionStore();
