import { observable, action, makeObservable } from 'mobx';
import DomainBase from '../DomainBase';

class RoomDomain extends DomainBase {
  @observable accessor id: number | null = null;
  @observable accessor name = '';
  @observable accessor capacity = 0;
  @observable accessor description = '';
  @observable accessor instituteId = '';

  constructor(room?: Record<string, unknown>) {
    super();
    makeObservable(this);
    if (room) this.setData(room);
  }

  @action
  validate(field?: string) {
    if (field) {
      super.validate(field);
      return;
    }

    super.validate(undefined, () => {
      if (!this.name.trim()) this.errors['name'] = 'Nome é obrigatório';
      if (this.capacity <= 0) this.errors['capacity'] = 'Defina a capacidade';
      if (!this.instituteId) this.errors['instituteId'] = 'Vínculo necessário';
    });
  }

  getBackendObject() {
    return {
      id: this.id,
      name: this.name.trim(),
      capacity: this.capacity,
      description: this.description,
      instituteId: this.instituteId
    };
  }
}

export default RoomDomain;
