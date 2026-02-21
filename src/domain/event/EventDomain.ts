import { observable, action, makeObservable, computed } from 'mobx';
import DomainBase from '../DomainBase';

class EventDomain extends DomainBase {
  @observable accessor id: number | null = null;
  @observable accessor name = '';
  @observable accessor description = '';
  @observable accessor imageUrl = '';
  @observable accessor tags: string[] = [];
  @observable accessor registrationLink = '';
  @observable accessor additionalInfo = '';
  @observable accessor isPublic: boolean = true;

  constructor(event?: Record<string, unknown>) {
    super();
    makeObservable(this);

    if (event) {
      this.setData(event);
    }
  }

  @computed
  get hasExternalRegistration(): boolean {
    return !!this.registrationLink && this.registrationLink.trim().length > 0;
  }

  @action
  validate(field?: string) {
    if (field) {
      super.validate(field);

      if (field === 'registrationLink' && this.registrationLink) {
        this.validateUrl(this.registrationLink);
      }
      return;
    }

    super.validate(undefined, () => {
      if (!this.name) this.errors['name'] = 'Title is required';
      if (!this.description) this.errors['description'] = 'Description is required';

      if (this.registrationLink) {
        this.validateUrl(this.registrationLink);
      }
    });
  }

  private validateUrl(url: string) {
    try {
      new URL(url);
    } catch (_) {
      this.errors['registrationLink'] = 'Invalid URL';
    }
  }

  getBackendObject() {
    const obj = super.getBackendObject();
    return obj;
  }
}

export default EventDomain;
