import IndexStoreBase from "../base/IndexStoreBase";
import UserDomain from "../../domain/user/UserDomain";

class UserIndexStore extends IndexStoreBase<UserDomain> {
  async fetch() {
    await this.runFetch(async () => {
      return new Promise<UserDomain[]>((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, 500);
      });
    });
  }
}

export const userIndexStore = new UserIndexStore();
