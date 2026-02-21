import { makeAutoObservable, runInAction } from "mobx";
import EquipmentDomain from "../../domain/equipment/EquipmentDomain";
import EquipmentService from "../../services/EquipmentService";
import InstituteEquipmentService from "../../services/InstituteEquipmentService";
import {
  EquipmentAmountOperation,
  InstituteEquipmentStock,
} from "../../types/equipment/EquipmentType";

export type EquipmentCatalogItem = {
  id: number;
  name: string;
  description?: string | null;
};

class EquipmentStore {
  catalog: EquipmentCatalogItem[] = [];
  stocks: InstituteEquipmentStock[] = [];

  isLoadingCatalog = false;
  isLoadingStocks = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchCatalog() {
    this.isLoadingCatalog = true;
    try {
      const data = await EquipmentService.getAll();
      runInAction(() => {
        this.catalog = Array.isArray(data) ? data : [];
      });
    } catch (error) {
      console.error("Erro ao buscar catálogo de equipamentos:", error);
      runInAction(() => {
        this.catalog = [];
      });
    } finally {
      runInAction(() => {
        this.isLoadingCatalog = false;
      });
    }
  }

  async fetchStocks(instituteId: string) {
    this.isLoadingStocks = true;
    try {
      const data = await InstituteEquipmentService.getAllStocks(instituteId);
      runInAction(() => {
        this.stocks = Array.isArray(data) ? data : [];
      });
    } catch (error) {
      console.error("Erro ao buscar estoques do instituto:", error);
      runInAction(() => {
        this.stocks = [];
      });
    } finally {
      runInAction(() => {
        this.isLoadingStocks = false;
      });
    }
  }

  async createEquipmentWithStock(
    instituteId: string,
    domain: EquipmentDomain,
    total: number
  ) {
    const created = await EquipmentService.create(domain);
    const equipmentId = created?.id;

    if (!equipmentId) {
      throw new Error("Não foi possível obter o id do equipamento criado.");
    }

    await InstituteEquipmentService.createStock(instituteId, equipmentId, total);

    await Promise.all([
      this.fetchCatalog(),
      this.fetchStocks(instituteId),
    ]);

    return true;
  }

  async linkExistingToInstitute(
    instituteId: string,
    equipmentId: number,
    total: number
  ) {
    await InstituteEquipmentService.createStock(instituteId, equipmentId, total);
    await this.fetchStocks(instituteId);
    return true;
  }

  async updateAmount(
    instituteId: string,
    equipmentId: number,
    amount: number,
    operation: EquipmentAmountOperation
  ) {
    await InstituteEquipmentService.updateAmount(
      instituteId,
      equipmentId,
      amount,
      operation
    );
    await this.fetchStocks(instituteId);
    return true;
  }

  async deleteFromInstitute(instituteId: string, equipmentId: number) {
    await InstituteEquipmentService.deleteStock(instituteId, equipmentId);
    await this.fetchStocks(instituteId);
    return true;
  }

  async deleteEquipmentFully(instituteId: string, equipmentId: number) {
    try {
      await InstituteEquipmentService.deleteStock(instituteId, equipmentId);
    } catch (_) {
    }

    await EquipmentService.delete(equipmentId);

    await Promise.all([
      this.fetchCatalog(),
      this.fetchStocks(instituteId),
    ]);

    return true;
  }
}

export const equipmentStore = new EquipmentStore();