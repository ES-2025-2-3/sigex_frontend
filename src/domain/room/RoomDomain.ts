import { observable, action, makeObservable } from 'mobx';
import DomainBase from '../DomainBase';

class RoomDomain extends DomainBase {
  @observable accessor id: number | null = null;
  @observable accessor name = '';
  @observable accessor capacity = 0;
  @observable accessor description = '';
  @observable accessor instituteId: number | null = null;

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
      if (!this.name) this.errors['name'] = 'Campo obrigatório';
      if (this.capacity <= 0) this.errors['capacity'] = 'Capacidade deve ser maior que 0';
      if (!this.instituteId) this.errors['instituteId'] = 'Instituto obrigatório';
    });
  }

  getBackendObject() {
    return {
      id: this.id,
      name: this.name,
      capacity: this.capacity,
      description: this.description,
      institute: this.instituteId ? { id: this.instituteId } : null,
    };
  }
}

export default RoomDomain;

