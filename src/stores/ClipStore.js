import { observable, computed, reaction, action } from 'mobx';
import ClipModel from '../models/ClipModel';

export default class ClipStore {
  @observable items = [];

  // singleton pattern
  static instance;
  static get() {
    if (this.instance == null) {
      this.instance = new ClipStore();
    }
    return this.instance;
  }

  // @action
  addClip(playlist) {
    this.items.push(playlist);
  }

  // Pass in a clipId and get the model from the clip store
  findClip(clipId) {
    const result = this.items.find(c => c.clipId === clipId);
    if (result == null) {
      debugger;
      throw `Error! Could not find clip ${clipId}`;
    }
    return result;
  }

  // Refresh store contents from parsed JSON
  refreshFromJS(arr) {
    this.items = arr.map(item => ClipModel.fromJS(item));
  }
}
