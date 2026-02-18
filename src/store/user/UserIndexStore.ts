import IndexStoreBase from "../base/IndexStoreBase";
import UserDomain from "../../domain/user/UserDomain";
import { computed } from "mobx";
import { UserType } from "../../domain/enums/UserType";

class UserIndexStore extends IndexStoreBase<UserDomain> {

  @computed
  get staffMembers() {
    return this.allRecords.filter(user => user.type === UserType.SERVIDOR_TECNICO_ADMINISTRATIVO);
  }
  
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
