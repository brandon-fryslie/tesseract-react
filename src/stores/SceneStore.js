import { observable, computed, reaction, action } from 'mobx';
import SceneModel from '../models/SceneModel';
import ClipStore from './ClipStore';

export default class SceneStore {
  @observable items = [];

  clipStore = null;

  constructor() {
    this.clipStore = ClipStore.get();
  }

  // singleton pattern
  static instance;
  static get() {
    if (this.instance == null) {
      this.instance = new SceneStore();
    }
    return this.instance;
  }

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

  findSceneById(id) {
    if (!id) {
      throw `ERROR: SceneID is undefined`;
    }

    const scene = this.items.find(c => c.id === id);
    if (!scene) {
      throw `ERROR: Could not find scene with id: ${id}`;
    }
    return scene;
  }

  // this is hacky and should not live here, or really work like this at all

  hydrateClipsOnScene(scenes) {
    scenes.forEach((scene) => {
      // eslint-disable-next-line no-param-reassign
      scene.clip = this.clipStore.findClip(scene.clipId);
      // eslint-disable-next-line no-param-reassign
    });
  }

  refreshFromJS(arr) {
    // hacky method to jam the ClipModel objects in
    this.hydrateClipsOnScene(arr);

    this.items = arr.map(item => SceneModel.fromJS(item));
  }
}
