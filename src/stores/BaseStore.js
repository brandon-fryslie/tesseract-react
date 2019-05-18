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
    return this.items;
  }

  addItem(item) {
    this.items.push(item);
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
