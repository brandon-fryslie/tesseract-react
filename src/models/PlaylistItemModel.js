import { observable } from 'mobx';
import uuidv1 from 'uuid/v1';
import BaseModel from './BaseModel';
import PlaylistStore from '../stores/PlaylistStore';
import uuidv4 from 'uuid/v4';

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

  static fromJS(obj) {
    const id = obj.id != null ? obj.id : uuidv4();
    return new PlaylistItemModel(id, obj.scene, obj.duration);
  }
}
