import { observable, action, makeObservable } from 'mobx';
import DomainBase from '../DomainBase';

class EquipmentDomain extends DomainBase {
  @observable accessor id: number | null = null;
  @observable accessor name = '';
  @observable accessor available = true;

  constructor(eq?: Record<string, unknown>) {
    super();
    makeObservable(this);
    if (eq) this.setData(eq);
  }

  @action
  enableEquipment() {
    this.available = true;
  }

  @action
  disableEquipment() {
    this.available = false;
  }

  @action
  validate(field?: string) {
    if (field) {
      super.validate(field);
      return;
    }

    super.validate(undefined, () => {
      if (!this.name) {
        this.errors['name'] = 'Name is required';
      }
    });
  }

  getBackendObject() {
    return {
      id: this.id,
      name: this.name,
      available: this.available,
    };
  }
}

export default EquipmentDomain;

