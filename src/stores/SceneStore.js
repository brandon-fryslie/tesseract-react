import { observable, computed, reaction, action } from 'mobx';
import SceneModel from '../models/SceneModel';

export default class SceneStore {
  @observable items = [];

  get scenes() {
    return this.items;
  }

  // @action
  addScene(scene) {
    this.items.push(scene);
  }

  // Pass in a display name to get the Scene (convenience method for mock data)
  findScene(sceneName) {
    const scene = this.items.find(c => c.displayName === sceneName);
    if (!scene) {
      throw `ERROR: Could not find scene: ${sceneName}`;
    }
    return scene;
  }

  static fromJS(arr) {
    const store = new SceneStore();
    store.items = arr.map(item => SceneModel.fromJS(store, item));
    return store;
  }
}
