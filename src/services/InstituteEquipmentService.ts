import api from "./api";
import { EquipmentAmountOperation } from "../types/equipment/EquipmentType";

class InstituteEquipmentService {
  getAllStocks(instituteId: string) {
    return api.get(`/institutes/${instituteId}/equipments`)
      .then(r => r.data);
  }

  createStock(instituteId: string, equipmentId: number, total: number) {
    return api.post(`/institutes/${instituteId}/equipments`, {
      equipmentId,
      total,
    }).then(r => r.data);
  }

  updateAmount(
    instituteId: string,
    equipmentId: number,
    amount: number,
    operation: EquipmentAmountOperation
  ) {
    return api.patch(
      `/institutes/${instituteId}/equipments/${equipmentId}`,
      { amount, operation }
    ).then(r => r.data);
  }

  deleteStock(instituteId: string, equipmentId: number) {
    return api.delete(`/institutes/${instituteId}/equipments/${equipmentId}`);
  }
}

export default new InstituteEquipmentService();