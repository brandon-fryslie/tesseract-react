import { observable } from 'mobx';

export default class BaseStore {
  @observable items = [];

  // singleton pattern
  static instance;

  static get() {
    if (this.instance == null) {
      this.instance = new this();
    }
    return this.instance;
  }

  // Subclasses must implement this.  A reference to the class of the model for this store
  getModelType() {
    throw "Error: BaseStore: Must implement method getModelType()";
  }

  getItems() {
    // eslint-disable-next-line no-nested-ternary
    return this.items.sort((p1, p2) => { return p1.id < p2.id ? -1 : p1.id > p2.id ? 1 : 0; });
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(item) {
    // find item with same ID
    const itemToRemove = this.items.find(i => i.id === item.id);

    if (itemToRemove == null) {
      throw `[BaseStore] ERROR: Could not find item to remove matching ${item.id} ${item.displayName}`;
    }

    this.items.remove(itemToRemove);
  }

  // Find an item in the store
  find(key, value) {
    const item = this.items.find(i => i[key] === value);
    if (item == null) {
      throw `ERROR: Could not find item with property ${key}: ${value}`;
    }
    return item;
  }

  // Refresh store contents from parsed JSON
  refreshFromJS(arr) {
    this.items.replace(arr.map(item => this.getModelType().fromJS(item)));
  }
}
