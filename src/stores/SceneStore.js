import { observable, computed, reaction, action } from 'mobx';
import SceneModel from '../models/SceneModel';

export default class SceneStore {
  @observable items = [];

  clipStore = null;

  constructor(clipStore) {
    this.clipStore = clipStore;
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
      scene.channel1Clip = this.clipStore.findClip(scene.channel1Clip.clipId);
      // eslint-disable-next-line no-param-reassign
      scene.channel2Clip = this.clipStore.findClip(scene.channel2Clip.clipId);
    });
  }

  refreshFromJS(arr) {
    // hacky method to jam the ClipModel objects in
    this.hydrateClipsOnScene(arr);

    this.items = arr.map(item => SceneModel.fromJS(item));
  }

  static fromJS(arr) {
    const store = new SceneStore();
    store.items = arr.map(item => SceneModel.fromJS(item));
    return store;
  }
}
