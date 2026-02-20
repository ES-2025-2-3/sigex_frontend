import { makeAutoObservable, runInAction } from "mobx";
import UserDomain from "../../domain/user/UserDomain";
import { AuthenticatedUserResponse } from "../../types/auth/AuthenticatedUserResponseType";
import AuthService from "../../services/AuthService";

class UserSessionStore {
  currentUser: UserDomain | null = null;
  isLoading = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.hydrate();
  }

  get isLoggedIn() {
    return this.currentUser !== null;
  }

  async register(registrationData: any) {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const data = await AuthService.register(registrationData);
      return data;
    } catch (e) {
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async login(credentials: any) {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const data = await AuthService.login(credentials);
      this.saveSession(data);
      return data;
    } catch (e) {
      console.error("Erro no login:", e);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  private saveSession(data: AuthenticatedUserResponse) {
    const user = new UserDomain({
      id: data.id,
      email: data.email,
      name: data.name,
      type: data.type,
    });

    runInAction(() => {
      this.currentUser = user;
      localStorage.setItem("sigex_token", data.token);
      localStorage.setItem("sigex_user_data", JSON.stringify(data));
    });
  }

  private hydrate() {
    const token = localStorage.getItem("sigex_token");
    const savedData = localStorage.getItem("sigex_user_data");

    if (token && savedData) {
      try {
        const data = JSON.parse(savedData);

        runInAction(() => {
          this.currentUser = new UserDomain({
            id: data.id,
            email: data.email,
            name: data.name,
            type: data.type,
          });
        });
      } catch (e) {
        this.logout();
      }
    }
  }

  logout() {
    runInAction(() => {
      this.currentUser = null;
      localStorage.removeItem("sigex_token");
      localStorage.removeItem("sigex_user_data");
    });
  }
}

export const userSessionStore = new UserSessionStore();
