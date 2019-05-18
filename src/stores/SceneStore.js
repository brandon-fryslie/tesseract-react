import BaseStore from './BaseStore';
import ClipStore from './ClipStore';
import SceneModel from '../models/SceneModel';

export default class SceneStore extends BaseStore {
  clipStore = null;

  constructor(...args) {
    super(...args);
    this.clipStore = ClipStore.get();
  }

  getModelType() {
    return SceneModel;
  }

  // this is hacky and should not live here, or really work like this at all
  hydrateClipsOnScene(scenes) {
    scenes.forEach((scene) => {
      // eslint-disable-next-line no-param-reassign
      scene.clip = this.clipStore.find('clipId', scene.clipId);
      // eslint-disable-next-line no-param-reassign
    });
  }

  refreshFromJS(arr) {
    // hacky method to jam the ClipModel objects in
    this.hydrateClipsOnScene(arr);

    super.refreshFromJS(arr);
  }
}
