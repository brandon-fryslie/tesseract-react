import { observable, computed, reaction, action } from 'mobx';
import SceneModel from '../models/SceneModel';

export default class SceneStore {
  @observable scenes = [];

  get scenes() {
    return this.scenes;
  }

  // @action
  addScene(scene) {
    this.scenes.push(scene);
  }

  static fromJS(arr) {
    const store = new SceneStore();
    store.playlists = arr.map(item => SceneModel.fromJS(store, item));
    return store;
  }
}
