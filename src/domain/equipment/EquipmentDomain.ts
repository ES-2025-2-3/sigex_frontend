import { observable, action, makeObservable } from "mobx";
import DomainBase from "../DomainBase";

class EquipmentDomain extends DomainBase {
  @observable accessor id: number | null = null;
  @observable accessor name = "";
  @observable accessor available = true;

  constructor(eq?: Record<string, unknown>) {
    super();
    makeObservable(this);
    if (eq) this.setData(eq);
  }

  @action
  setName(value: string) {
    this.name = value;
  }

  @action
  setAvailable(value: boolean) {
    this.available = value;
  }

  @action
  validate(field?: string) {
    if (field) {
      super.validate(field);
      return;
    }

    super.validate(undefined, () => {
      if (!this.name || !this.name.trim()) {
        this.errors["name"] = "Nome do equipamento é obrigatório";
      }

      if (this.name && this.name.length > 100) {
        this.errors["name"] =
          "Nome do equipamento deve ter no máximo 100 caracteres";
      }
    });
  }

  getBackendObject() {
    const payload: Record<string, unknown> = {
      name: this.name.trim(),
      available: this.available,
    };

    if (this.id) {
      payload.id = this.id;
    }

    return payload;
  }

  clear() {
    this.id = null;
    this.name = "";
    this.available = true;
    this.clearErrors?.();
  }
}

export default EquipmentDomain;
