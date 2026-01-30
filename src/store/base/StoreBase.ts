import { makeObservable, observable, action } from "mobx";

export default class StoreBase {
  @observable accessor loading = false;
  @observable accessor error: string | null = null;

  constructor() {
    makeObservable(this);
  }

  @action setLoading(value: boolean) {
    this.loading = value;
  }

  @action setError(message: string | null) {
    this.error = message;
  }

  @action clearError() {
    this.error = null;
  }
}