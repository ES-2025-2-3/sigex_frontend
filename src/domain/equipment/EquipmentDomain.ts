import { observable, action, makeObservable } from "mobx";
import DomainBase from "../DomainBase";

class EquipmentDomain extends DomainBase {
  @observable accessor id: number | null = null;
  @observable accessor name = "";
  @observable accessor description = "";

  constructor(data?: Record<string, unknown>) {
    super();
    makeObservable(this);
    if (data) this.setData(data);
  }

  @action
  validate() {
    super.validate(undefined, () => {
      if (!this.name || !this.name.trim()) {
        this.errors["name"] = "Nome é obrigatório";
      }
      if (this.name.length > 100) {
        this.errors["name"] = "Máx. 100 caracteres";
      }
      if (this.description && this.description.length > 255) {
        this.errors["description"] = "Máx. 255 caracteres";
      }
    });
  }

  getBackendObject() {
    return {
      name: this.name.trim(),
      description: this.description?.trim() || null,
    };
  }

  clear() {
    this.id = null;
    this.name = "";
    this.description = "";
    this.clearErrors?.();
  }
}

export default EquipmentDomain;