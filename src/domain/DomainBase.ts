import { observable, toJS, makeObservable, action, computed } from 'mobx';

type MergeOptions = { suffix?: string; prefix?: string };

abstract class DomainBase {
  @observable
  accessor errors: Record<string, string> = {};

  constructor() {
    makeObservable(this);
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
        _err[field] = 'Campo obrigatório';
      }

      this.errors = _err;
    } else {
      this.errors = {};
      validation?.();
    }
  }

  @action
  mergeErrors(domainInstance: DomainBase, options?: MergeOptions) {
    const opts = { suffix: '', prefix: '', ...options };
    
    Object.keys(domainInstance.errors).forEach(key => {
      const newKey = `${opts.prefix}${key}${opts.suffix}`;
      this.errors[newKey] = domainInstance.errors[key];
    });
  }

  @action
  clearErrors(...fields: string[]) {
    const newErrors = { ...this.errors };
    fields.forEach(field => delete newErrors[field]);
    this.errors = newErrors;
  }

  /**
   * Converte o domínio para um objeto puro
   */
  getBackendObject(fieldsToRemove: string[] = []): Record<string, unknown> {
    const pureObject = toJS(this) as any;
    
    const toOmit = ['errors', ...fieldsToRemove];
    toOmit.forEach(key => delete pureObject[key]);
    
    return pureObject;
  }

  /**
   * Seta dados no domínio
   */
  @action
  setData(data: Record<string, unknown> = {}) {
    Object.keys(data).forEach(key => {
      if (key in this) {
        (this as any)[key] = data[key];
      }
    });
  }

  @computed
  get isValid(): boolean {
    return Object.keys(this.allErrors).length === 0;
  }

  @computed
  get allErrors() {
    const errors = { ...this.errors };

    Object.keys(this).forEach(key => {
      const value = (this as any)[key];
      if (value instanceof DomainBase) {
        Object.assign(errors, value.allErrors);
      }
    });
    return errors;
  }
}

export default DomainBase;