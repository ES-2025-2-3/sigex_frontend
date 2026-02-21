import { makeAutoObservable, runInAction } from "mobx";
import instituteService from "../../services/InstituteService";
import { Institute } from "../../types/institute/InstituteType";

class InstituteStore {
  current: Institute | null = null;
  globalId: string | null = null; 
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchGlobalId() {
    this.isLoading = true;
    this.error = null;

    try {
      const id = await instituteService.getGlobalId();
      runInAction(() => {
        this.globalId = id;
        this.isLoading = false;
      });
      return id;
    } catch (e: any) {
      runInAction(() => {
        this.isLoading = false;
        this.error = "Falha ao identificar a unidade no servidor.";
      });
      console.error("InstituteStore: Erro ao buscar ID dinâmico.", e);
      return null;
    }
  }

  async fetchDetails() {
    if (!this.globalId) {
      const id = await this.fetchGlobalId();
      if (!id) return;
    }

    this.isLoading = true;
    try {
      const data = await instituteService.getById(this.globalId!);
      runInAction(() => {
        this.current = data;
        this.isLoading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = "Não foi possível carregar os detalhes da unidade.";
        this.isLoading = false;
      });
      console.error("InstituteStore -> fetchDetails error:", e);
    }
  }

  async update(data: any) {
    if (!this.globalId) return false;

    this.isLoading = true;
    try {
      const updated = await instituteService.update(this.globalId, data);
      runInAction(() => {
        this.current = updated;
        this.isLoading = false;
      });
      return true;
    } catch (e: any) {
      runInAction(() => {
        this.isLoading = false;
      });
      console.error("InstituteStore -> update error:", e);
      return false;
    }
  }
}

export const instituteStore = new InstituteStore();