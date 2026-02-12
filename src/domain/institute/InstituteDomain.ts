import { observable, action, makeObservable } from "mobx";
import DomainBase from "../DomainBase";

class InstituteDomain extends DomainBase {
  @observable accessor id: string | null = null;
  @observable accessor name = "";
  @observable accessor acronym = "";
  @observable accessor contactPhone = "";
  @observable accessor managerId: string | null = null;

  constructor(inst?: Record<string, unknown>) {
    super();
    makeObservable(this);
    if (inst) this.setData(inst);
  }

  @action
  validate(field?: string) {
    if (field) {
      super.validate(field);
      return;
    }
    super.validate(undefined, () => {
      if (!this.name) this.errors["name"] = "Campo obrigatório";
      if (!this.acronym) this.errors["acronym"] = "Campo obrigatório";
      if (!this.contactPhone) this.errors["contactPhone"] = "Campo obrigatório";
      if (!this.managerId) this.errors["managerId"] = "Responsável obrigatório";
    });
  }

  getBackendObject() {
    return {
      id: this.id,
      name: this.name,
      acronym: this.acronym,
      contactPhone: this.contactPhone,
      manager: { id: this.managerId },
      rooms: [],
      equipments: [],
    };
  }
}

export default InstituteDomain;
