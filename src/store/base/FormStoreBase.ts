import { makeObservable, observable, action, computed, runInAction } from "mobx";
import StoreBase from "./StoreBase";
import DomainBase from "../../domain/DomainBase";

export default abstract class FormStoreBase<D extends DomainBase> extends StoreBase {
  @observable accessor domain: D = this.initializeDomain();

  constructor() {
    super();
    makeObservable(this);
  }

  abstract initializeDomain(): D;

  abstract persist(): Promise<boolean>;

  @action
  reset() {
    this.domain = this.initializeDomain();
    this.clearError();
  }

  @action
  updateAttribute(field: string, value: unknown) {
    (this.domain as any)[field] = value;
  }

  @action
  validateField(field: string) {
    this.domain.validate(field);
  }

  @action
  validateDomain() {
    this.domain.validate();
  }

  @computed
  get hasErrors() {
    return Object.keys(this.domain.allErrors).length > 0;
  }

  @action
  async save(onSuccess?: () => void) {
    this.setLoading(true);
    this.clearError();

    try {
      this.validateDomain();

      if (this.hasErrors) {
        this.setError("Campos obrigatórios não preenchidos");
        return false;
      }

      const ok = await this.persist();
      if (ok) onSuccess?.();
      return ok;
    } catch (e: any) {
      runInAction(() =>
        this.setError(e?.message ?? "Erro ao salvar")
      );
      return false;
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }
}
