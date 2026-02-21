import { makeAutoObservable, runInAction } from "mobx";
import { Space } from "../../types/space/SpaceType";
import SpaceDomain from "../../domain/space/SpaceDomain";
import SpaceService from "../../services/SpaceService";
import InstituteService from "../../services/InstituteService";

class SpaceStore {
  spaces: Space[] = [];
  institutes: any[] = []; 
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchSpaces() {
    this.isLoading = true;
    try {
      const [spacesData, institutesData] = await Promise.all([
        SpaceService.getAll(),
        InstituteService.getAll(),
      ]);

      runInAction(() => {
        this.spaces = Array.isArray(spacesData)
          ? spacesData
          : spacesData.content || [];
        if (Array.isArray(institutesData)) {
          this.institutes = institutesData;
        } else if (institutesData) {
          this.institutes = [institutesData];
        } else {
          this.institutes = [];
        }
        
        console.log("Espaços e Instituto carregados com sucesso.");
      });
    } catch (error) {
      console.error("Erro ao carregar dados da SpaceStore:", error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async save(domain: SpaceDomain) {
    this.isLoading = true;
    try {
      if (this.institutes.length > 0) {
        const uniqueInstituteId = this.institutes[0].id;
        domain.setData({ instituteId: uniqueInstituteId });
      } else {
        console.error("Erro: Nenhum instituto encontrado no sistema para vincular a sala.");
        return false;
      }

      if (domain.id) {
        const updated = await SpaceService.update(domain.id, domain);
        runInAction(() => {
          const index = this.spaces.findIndex((s) => s.id === domain.id);
          if (index !== -1) this.spaces[index] = updated;
        });
      } else {
        const created = await SpaceService.create(domain);
        runInAction(() => {
          this.spaces.push(created);
        });
      }
      return true;
    } catch (error) {
      console.error("Erro ao salvar sala no backend:", error);
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async delete(id: number | string) {
    this.isLoading = true;
    try {
      await SpaceService.delete(id);
      runInAction(() => {
        this.spaces = this.spaces.filter((s) => s.id !== id);
      });
      return true;
    } catch (error) {
      console.error("Erro ao excluir sala:", error);
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }
}

export const spaceStore = new SpaceStore();
