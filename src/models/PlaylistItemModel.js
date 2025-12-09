import { observable, makeObservable } from 'mobx';
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';
import BaseModel from './BaseModel';
import PlaylistStore from '../stores/PlaylistStore';

// This class is basically just a scene with a duration at this point
export default class PlaylistItemModel extends BaseModel {
  id;
  @observable scene;
  @observable duration;

  // scene: SceneModel object
  // duration: Number in seconds
  constructor(id, scene, duration) {
    super();
    makeObservable(this);

    this.id = id;
    this.scene = scene;
    this.duration = duration;
  }

  get displayName() {
    return this.scene.displayName;
  }

  static findContainingPlaylist(playlistItemId) {
    return PlaylistStore.get().items.find((playlist) => {
      return playlist.items.find((playlistItem) => {
        return playlistItem.id === playlistItemId;
      });
    });
  }

  toJS() {
    return {
      id: this.id,
      sceneId: this.scene.id,
      duration: this.duration,
    };
  }

  // these should be updated to save and hydrate from the same shape of data
  static fromJS(obj) {
    const id = obj.id != null ? obj.id : uuidv4();
    return new PlaylistItemModel(id, obj.scene, obj.duration);
  }
}
