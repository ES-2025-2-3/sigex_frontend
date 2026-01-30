import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
} from "mobx";
import StoreBase from "./StoreBase";

export default abstract class IndexStoreBase<T> extends StoreBase {
  @observable accessor lista: T[] = [];
  @observable protected accessor allRecords: T[] = [];
  @observable accessor currentPage = 1;
  @observable accessor recordsByPage = 10;

  constructor() {
    super();
    makeObservable(this);
  }

  abstract fetch(): Promise<void>;

  @action
  setData(data: T[]) {
    this.allRecords = data;
    this.applyPage(this.currentPage);
  }

  @action
  applyPage(page = 1) {
    this.currentPage = page;
    const start = (page - 1) * this.recordsByPage;
    const end = page * this.recordsByPage;
    this.lista = this.allRecords.slice(start, end);
  }

  @computed
  get totalRecords() {
    return this.allRecords.length;
  }

  getById<K extends keyof any>(
    id: any,
    selector: (item: T) => any = (x: any) => x.id,
  ) {
    return this.allRecords.find((item) => selector(item) === id);
  }

  protected async runFetch(fn: () => Promise<T[]>) {
    this.setLoading(true);
    this.setError(null);
    try {
      const data = await fn();
      runInAction(() => this.setData(data));
    } catch (e: any) {
      runInAction(() => this.setError(e?.message ?? "Erro ao buscar dados"));
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }
}
