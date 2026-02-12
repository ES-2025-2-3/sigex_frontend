import { makeAutoObservable, runInAction } from "mobx";
import api from "../../services/api";
import EquipmentDomain from "../../domain/equipment/EquipmentDomain";
import { Equipment } from "../../types/equipment/EquipmentType";

class EquipmentStore {
  equipments: Equipment[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchEquipments() {
    try {
      this.isLoading = true;

      const response = await api.get("/equipments");

      runInAction(() => {
        this.equipments = response.data;
      });
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async save(domain: EquipmentDomain) {
    try {
      const payload = domain.getBackendObject();

      await api.post("/equipments", payload);

      await this.fetchEquipments();

      return true;
    } catch (error) {
      console.error("Erro ao salvar equipamento:", error);
      return false;
    }
  }

  async enable(id: number) {
    try {
      await api.put(`/equipments/${id}/enable`);
      await this.fetchEquipments();
      return true;
    } catch (error) {
      console.error("Erro ao ativar equipamento:", error);
      return false;
    }
  }

  async disable(id: number) {
    try {
      await api.put(`/equipments/${id}/disable`);
      await this.fetchEquipments();
      return true;
    } catch (error) {
      console.error("Erro ao desativar equipamento:", error);
      return false;
    }
  }
}

export const equipmentStore = new EquipmentStore();
