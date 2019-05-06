import { observable } from 'mobx';
import BaseModel from './BaseModel';

export default class TransitionModel extends BaseModel {
  store;
  id;

  // Pretty name
  @observable displayName;

  // Duration
  @observable duration;

  constructor(store, id, displayName, duration) {
    super();
    this.store = store;
    this.id = id;
    this.displayName = displayName;
    this.duration = duration;
  }

  toJS() {
    return {
      id: this.id,
      displayName: this.displayName,
      duration: this.duration,
    };
  }

  static fromJS(store, obj) {
    return new TransitionModel(store, obj.id, obj.displayName, obj.duration);
  }
}
