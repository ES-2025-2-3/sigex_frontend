import { makeAutoObservable, runInAction } from "mobx";
import spaceService from "../../services/SpaceService";
import { instituteStore } from "../institute/InstituteStore";

class SpaceStore {
  spaces: any[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchSpaces() {
  this.isLoading = true;
  try {
    const data = await spaceService.getAll();     
    runInAction(() => {
      this.spaces = data;
      this.isLoading = false;
    });
  } catch (e) {
    runInAction(() => { this.isLoading = false; });
    console.error("Erro ao carregar espaços:", e);
  }
}

  async save(domain: any) {
    this.isLoading = true;
    try {
      if (!instituteStore.globalId) {
        console.error("SpaceStore: instituteStore.globalId is missing!");
        return false;
      }

      const payload = {
        ...domain.getBackendObject(),
        instituteId: instituteStore.globalId 
      };

      if (domain.id) {
        await spaceService.update(domain.id, payload);
      } else {
        await spaceService.create(payload);
      }
      
      await this.fetchSpaces(); 
      runInAction(() => { this.isLoading = false; });
      return true;
    } catch (e) {
      console.error("SpaceStore: Erro ao salvar sala:", e);
      runInAction(() => { this.isLoading = false; });
      return false;
    }
  }

  async delete(id: string | number) {
    this.isLoading = true;
    try {
      await spaceService.delete(id);
      await this.fetchSpaces();
      return true;
    } catch (e) {
      runInAction(() => { this.isLoading = false; });
      return false;
    }
  }
}

export const spaceStore = new SpaceStore();
