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

  // this can be generified, just getting it working for now
  addNewScene(displayName, clip) {
    if (clip == null) {
      throw "[SceneStore] Error adding null clip";
    }

    this.addItem(new SceneModel(this.getNextId(), displayName, clip));
  }

  getNextId() {
    const ids = this.items.map(i => i.id).sort();
    const maxId = Math.max.apply(null, ids);
    if (Number.isNaN(maxId)) {
      throw "[SceneStore] Got NaN when trying to find the next ID";
    }

    return maxId + 1;
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
