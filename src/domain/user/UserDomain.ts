import { observable, action, makeObservable, computed } from "mobx";
import DomainBase from "../DomainBase";
import { UserType } from "../enums/UserType";

class UserDomain extends DomainBase {
  @observable accessor id: string = "";
  @observable accessor name = "";
  @observable accessor email = "";
  @observable accessor type: UserType = UserType.USUARIO;

  constructor(user?: any) {
    super();
    makeObservable(this);
    if (user) {
      this.id = String(user.id);
      this.name = user.name || "";
      this.email = user.email || "";
      this.type = user.userType || user.type || UserType.USUARIO;
    }
  }

  @computed
  get canBePromotedToStaff(): boolean {
    return this.type === UserType.USUARIO;
  }

  @computed
  get isAdmin(): boolean {
    return this.type === UserType.ADMIN;
  }

  @computed
  get isStaff(): boolean {
    return this.type === UserType.SERVIDOR_TECNICO_ADMINISTRATIVO;
  }

  @computed
  get isRegularUser(): boolean {
    return this.type === UserType.USUARIO;
  }

  @computed
  get canAccessAdminArea(): boolean {
    return this.isAdmin || this.isStaff;
  }

  @computed
  get initials(): string {
    if (!this.name) return "??";
    const names = this.name.trim().split(/\s+/);
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }

  @action
  updateType(newType: UserType) {
    this.type = newType;
  }

  @action
  validate(field?: string) {
    if (field) {
      super.validate(field);
      if (field === "email" && this.email) this.validateEmail(this.email);
    } else {
      super.validate(undefined, () => {
        if (!this.name) this.errors["name"] = "Nome é obrigatório";
        if (!this.email) {
          this.errors["email"] = "E-mail é obrigatório";
        } else {
          this.validateEmail(this.email);
        }
      });
    }
  }

  private validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) this.errors["email"] = "E-mail inválido";
  }
}

export default UserDomain;