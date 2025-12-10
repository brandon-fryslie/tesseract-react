import { action, override, makeObservable } from 'mobx';
import BaseStore from './BaseStore';
import ClipStore from './ClipStore';
import SceneModel, { ISceneData } from '../models/SceneModel';
import ClipModel from '../models/ClipModel';

export default class SceneStore extends BaseStore<SceneModel> {
  clipStore: ClipStore;

  constructor() {
    super();
    makeObservable(this);
    this.clipStore = ClipStore.get();
  }

  getModelType() {
    return SceneModel;
  }

  // this can be generified, just getting it working for now
  @action
  addNewScene(displayName: string, clip: ClipModel): void {
    if (clip == null) {
      throw new Error("[SceneStore] Error adding null clip");
    }

    this.addItem(new SceneModel(this.getNextId(), displayName, clip));
  }

  getNextId(): number {
    const ids = this.items.map(i => {
      const id = i.id;
      return typeof id === 'string' ? parseInt(id, 10) : id;
    }).sort((a, b) => a - b);

    const maxId = Math.max(...ids);
    if (Number.isNaN(maxId)) {
      throw new Error("[SceneStore] Got NaN when trying to find the next ID");
    }

    return maxId + 1;
  }

  // this is hacky and should not live here, or really work like this at all
  hydrateClipsOnScene(scenes: ISceneData[]): void {
    scenes.forEach((scene) => {
      // eslint-disable-next-line no-param-reassign
      (scene as any).clip = this.clipStore.find('clipId', scene.clipId);
    });
  }

  @override
  refreshFromJS(arr: ISceneData[]): void {
    // hacky method to jam the ClipModel objects in
    this.hydrateClipsOnScene(arr);

    super.refreshFromJS(arr);
  }
}
