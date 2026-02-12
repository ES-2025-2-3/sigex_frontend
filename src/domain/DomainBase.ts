import { observable, toJS, makeObservable, action, computed } from "mobx";

type MergeOptions = { suffix?: string; prefix?: string };

abstract class DomainBase {
  @observable
  accessor errors: Record<string, string> = {};

  constructor() {
    makeObservable(this);
  }

  /**
   * Limpa todos os campos do domínio voltando ao estado inicial
   * e remove todas as mensagens de erro.
   */
  @action
  clear() {
    this.errors = {};

    Object.keys(this).forEach((key) => {
      if (key === "errors" || key.startsWith("_")) return;

      const value = (this as any)[key];

      if (value instanceof DomainBase) {
        value.clear();
      } else {
        const type = typeof value;
        if (type === "string") (this as any)[key] = "";
        else if (type === "number") (this as any)[key] = 0;
        else if (type === "boolean") (this as any)[key] = false;
        else if (Array.isArray(value)) (this as any)[key] = [];
        else (this as any)[key] = null;
      }
    });
  }

  @action
  validate(field?: string, validation?: () => void, isCheckEmpty = true) {
    if (field) {
      const _err = { ...this.errors };
      delete _err[field];

      const value = (this as any)[field];

      if (
        ((isCheckEmpty && !value) || (!isCheckEmpty && value == null)) &&
        value !== 0 &&
        value !== false
      ) {
        _err[field] = "Campo obrigatório";
      }

      this.errors = _err;
    } else {
      this.errors = {};
      validation?.();
    }
  }

  @action
  mergeErrors(domainInstance: DomainBase, options?: MergeOptions) {
    const opts = { suffix: "", prefix: "", ...options };

    Object.keys(domainInstance.errors).forEach((key) => {
      const newKey = `${opts.prefix}${key}${opts.suffix}`;
      this.errors[newKey] = domainInstance.errors[key];
    });
  }

  @action
  clearErrors(...fields: string[]) {
    const newErrors = { ...this.errors };
    fields.forEach((field) => delete newErrors[field]);
    this.errors = newErrors;
  }

  /**
   * Converte o domínio para um objeto puro para envio ao back-end
   */
  getBackendObject(fieldsToRemove: string[] = []): Record<string, unknown> {
    const pureObject = toJS(this) as any;

    const toOmit = ["errors", ...fieldsToRemove];
    toOmit.forEach((key) => delete pureObject[key]);

    return pureObject;
  }

  /**
   * Seta dados no domínio a partir de um objeto vindo da API
   */
  @action
  setData(data: Record<string, unknown> = {}) {
    Object.keys(data).forEach((key) => {
      if (key in this) {
        (this as any)[key] = data[key];
      }
    });
  }

  @computed
  get isValid(): boolean {
    return Object.keys(this.allErrors).length === 0;
  }

  /**
   * Atalho para verificar se existem erros no domínio
   */
  @computed
  get hasErrors(): boolean {
    return !this.isValid;
  }

  @computed
  get allErrors() {
    const errors = { ...this.errors };

    Object.keys(this).forEach((key) => {
      const value = (this as any)[key];
      if (value instanceof DomainBase) {
        Object.assign(errors, value.allErrors);
      }
    });
    return errors;
  }
}

export default DomainBase;
