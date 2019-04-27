import { observable } from 'mobx';
import uuidv1 from 'uuid/v1';

// This class is basically just a scene with a duration at this point
export default class PlaylistItemModel {
  id;
  @observable scene;
  @observable duration;

  // scene: SceneModel object
  // duration: Number in seconds
  constructor(scene, duration) {
    this.id = uuidv1();
    this.scene = scene;
    this.duration = duration;
  }

  toJS() {
    return {
      scene: this.scene,
      duration: this.duration,
    };
  }

  static fromJS(obj) {
    return new PlaylistItemModel(obj.scene, obj.duration);
  }
}
