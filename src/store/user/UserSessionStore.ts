import { makeAutoObservable, runInAction } from "mobx";
import UserDomain from "../../domain/user/UserDomain";
import axios from "axios";

class UserSessionStore {
  currentUser: UserDomain | null = null;
  isLoading = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get user() {
    return this.currentUser;
  }

  /**
   * Login Mock.
   */
  loginMock(user: UserDomain) {
    runInAction(() => {
      this.currentUser = user;
    });
  }

  /**
   * Fluxo de login real.
   * O backend retorna o usuário com seu respectivo UserType.
   */
  async login(credentials: any) {
    this.isLoading = true;
    try {
      const userRes = await axios.post("/api/auth/login", credentials);
      const user = new UserDomain(userRes.data);

      runInAction(() => {
        this.currentUser = user;
      });
    } catch (e) {
      console.error("Erro no fluxo de login", e);
    } finally {
      runInAction(() => this.isLoading = false);
    }
  }

  logout() {
    runInAction(() => {
      this.currentUser = null;
    });
  }
}

export const userSessionStore = new UserSessionStore();
