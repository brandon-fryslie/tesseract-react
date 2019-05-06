import { observable } from 'mobx';
import uuidv1 from 'uuid/v1';
import BaseModel from './BaseModel';

// This class is basically just a scene with a duration at this point
export default class PlaylistItemModel extends BaseModel {
  id;
  @observable scene;
  @observable duration;

  // scene: SceneModel object
  // duration: Number in seconds
  constructor(scene, duration) {
    super();

    this.id = this.uuid;

    this.scene = scene;
    this.duration = duration;
  }

  get displayName() {
    return this.scene.displayName;
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
