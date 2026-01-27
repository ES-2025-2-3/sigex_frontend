import { observable, action, makeObservable, computed } from 'mobx';
import DomainBase from '../DomainBase';

class UserDomain extends DomainBase {
  @observable accessor username = '';        
  @observable accessor name = '';           
  @observable accessor email = '';           
  @observable accessor registrationNumber = '';        
  @observable accessor photoUrl = '';        
  @observable accessor affiliation = '';     

  constructor(user?: Record<string, unknown>) {
    super();
    makeObservable(this);
    
    if (user) {
      this.setData(user);
    }
  }

  @computed
  get initials(): string {
    if (!this.name) return '??';
    
    const names = this.name.trim().split(/\s+/);
    if (names.length > 1) {
      const firstLetter = names[0][0];
      const lastLetter = names[names.length - 1][0];
      return (firstLetter + lastLetter).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }

  @action
  validate(field?: string) {
    if (field) {
      super.validate(field);
      
      if (field === 'email' && this.email) {
        this.validateEmail(this.email);
      }
    } else {
      super.validate(undefined, () => {
        if (!this.username) this.errors['username'] = 'Campo obrigatório';
        if (!this.name) this.errors['name'] = 'Campo obrigatório';
        if (!this.email) {
          this.errors['email'] = 'Campo obrigatório';
        } else {
          this.validateEmail(this.email);
        }
      });
    }
  }

  private validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      this.errors['email'] = 'E-mail inválido';
    }
  }

  getBackendObject() {
    const obj = super.getBackendObject();
    obj.login = this.username;    
    return obj;
  }
}

export default UserDomain;