import { makeAutoObservable } from "mobx";
import UserDomain from "../../domain/user/UserDomain";
import { UserType } from "../../domain/enums/UserType";

class UserSessionStore {
  currentUser: UserDomain | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loginMock(user: UserDomain) {
    this.currentUser = user;
  }

  logout() {
    this.currentUser = null;
  }

  get isLoggedIn() {
    return !!this.currentUser;
  }

  get isAdmin() {
    return this.currentUser?.type === UserType.ADMIN;
  }

  get user() {
    return this.currentUser;
  }
}

export const userSessionStore = new UserSessionStore();

