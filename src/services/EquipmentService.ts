import api from "./api";
import EquipmentDomain from "../domain/equipment/EquipmentDomain";

class EquipmentService {
  getAll() {
    return api.get("/equipments").then(r => r.data);
  }

  create(domain: EquipmentDomain) {
    return api.post("/equipments", domain.getBackendObject())
      .then(r => r.data);
  }

  update(id: number, domain: EquipmentDomain) {
    return api.put(`/equipments/${id}`, domain.getBackendObject())
      .then(r => r.data);
  }

  delete(id: number) {
    return api.delete(`/equipments/${id}`);
  }
}

export default new EquipmentService();