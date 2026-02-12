import { makeAutoObservable, runInAction } from "mobx";
import { Institute } from "../../types/institute/InstituteType";
import axios from "axios";

class InstituteStore {
  current: Institute | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchDetails() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await axios.get("/api/institute/main");
      
      runInAction(() => {
        this.current = response.data;
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = "Erro ao carregar dados da unidade.";
        this.isLoading = false;
      });
      console.error(e);
    }
  }

  async update(data: Partial<Institute>) {
    try {
      const response = await axios.put("/api/institute/main", data);
      runInAction(() => {
        this.current = response.data;
      });
      return true;
    } catch (e) {
      console.error("Erro ao atualizar unidade", e);
      return false;
    }
  }
}

export const instituteStore = new InstituteStore();