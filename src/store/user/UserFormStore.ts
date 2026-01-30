import { runInAction } from "mobx";
import UserDomain from "../../domain/user/UserDomain";
import FormStoreBase from "../base/FormStoreBase";

class UserFormStore extends FormStoreBase<UserDomain> {
  initializeDomain() {
    return new UserDomain();
  }

  async persist(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        runInAction(() => {
          if (!this.domain.id) {
            (this.domain as any).id = Date.now();
          }
        });
        resolve(true);
      }, 500);
    });
  }

  saveUser(onSuccess?: () => void) {
    return this.save(onSuccess);
  }
}

export const userFormStore = new UserFormStore();
