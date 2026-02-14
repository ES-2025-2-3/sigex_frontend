import { makeAutoObservable, runInAction } from "mobx";
import { Space } from "../../types/space/SpaceType";
import { spaces_mock } from "../../../mock/space";
import SpaceDomain from "../../domain/space/SpaceDomain";

class SpaceStore {
  spaces: Space[] = [...spaces_mock];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchSpaces() {
    this.isLoading = false;
  }

  async save(domain: SpaceDomain) {
    try {
      runInAction(() => {
        const payload = domain.getBackendObject() as Space;

        if (domain.id) {
          const index = this.spaces.findIndex((r) => r.id === domain.id);
          if (index !== -1) {
            this.spaces[index] = { ...payload, id: domain.id };
          }
        } else {
          const newRoom: Space = {
            ...payload,
            id: Math.floor(Math.random() * 10000),
          };
          this.spaces.push(newRoom);
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async delete(id: number) {
    runInAction(() => {
      this.spaces = this.spaces.filter((r) => r.id !== id);
    });
    return true;
  }
}

export const spaceStore = new SpaceStore();
