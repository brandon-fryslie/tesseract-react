import { observable, action, makeObservable } from 'mobx';
import type { IObservableArray } from 'mobx';
import type BaseModel from '../models/BaseModel';

// Base store class with generic type parameter for the model type
export default abstract class BaseStore<T extends BaseModel> {
  @observable items: IObservableArray<T>;

  // Singleton pattern - will be overridden in subclasses
  static instance: any;

  constructor() {
    this.items = observable.array([]);
    makeObservable(this);
  }

  static get<S extends BaseStore<any>>(): S {
    if (this.instance == null) {
      // @ts-expect-error - We know subclasses are concrete
      this.instance = new this();
    }
    return this.instance as S;
  }

  // Subclasses must implement this - returns a reference to the model class
  abstract getModelType(): { fromJS(obj: any): T };

  getItems(): T[] {
    // Sort by id if the items have an id property
    return this.items.slice().sort((p1, p2) => {
      const id1 = (p1 as any).id;
      const id2 = (p2 as any).id;
      if (id1 == null || id2 == null) return 0;

      // eslint-disable-next-line no-nested-ternary
      return id1 < id2 ? -1 : id1 > id2 ? 1 : 0;
    });
  }

  @action
  addItem(item: T): void {
    this.items.push(item);
  }

  @action
  removeItem(item: T): void {
    // find item with same ID
    const itemId = (item as any).id;
    const itemToRemove = this.items.find(i => (i as any).id === itemId);

    if (itemToRemove == null) {
      throw new Error(`[BaseStore] ERROR: Could not find item to remove matching ${itemId} ${(item as any).displayName}`);
    }

    this.items.remove(itemToRemove);
  }

  // Find an item in the store by a key/value pair
  find<K extends keyof T>(key: K, value: T[K]): T {
    const item = this.items.find(i => i[key] === value);
    if (item == null) {
      throw new Error(`ERROR: Could not find item with property ${String(key)}: ${value}`);
    }
    return item;
  }

  // Refresh store contents from parsed JSON
  @action
  refreshFromJS(arr: any[]): void {
    this.items.replace(arr.map(item => this.getModelType().fromJS(item)));
  }
}
