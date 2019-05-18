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
  constructor(id, scene, duration) {
    super();

    this.id = id;
    this.scene = scene;
    this.duration = duration;
  }

  get displayName() {
    return this.scene.displayName;
  }

  toJS() {
    return {
      id: this.id,
      sceneId: this.scene.id,
      duration: this.duration,
    };
  }

  static fromJS(obj) {
    return new PlaylistItemModel(obj.id, obj.scene, obj.duration);
  }
}
