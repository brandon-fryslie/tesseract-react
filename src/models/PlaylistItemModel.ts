import { observable, makeObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import BaseModel from './BaseModel';
import SceneModel from './SceneModel';
import PlaylistStore from '../stores/PlaylistStore';

// Interface for playlist item data serialization
export interface IPlaylistItemData {
  id: string;
  sceneId: string | number;
  duration: number;
}

// This class is basically just a scene with a duration at this point
export default class PlaylistItemModel extends BaseModel {
  id: string;
  @observable scene!: SceneModel;
  @observable duration!: number;

  // scene: SceneModel object
  // duration: Number in seconds
  constructor(id: string, scene: SceneModel, duration: number) {
    super();
    makeObservable(this);

    this.id = id;
    this.scene = scene;
    this.duration = duration;
  }

  get displayName(): string {
    return this.scene.displayName;
  }

  static findContainingPlaylist(playlistItemId: string): any {
    return PlaylistStore.get().items.find((playlist) => {
      return playlist.items.find((playlistItem: PlaylistItemModel) => {
        return playlistItem.id === playlistItemId;
      });
    });
  }

  toJS(): IPlaylistItemData {
    return {
      id: this.id,
      sceneId: this.scene.id,
      duration: this.duration,
    };
  }

  // these should be updated to save and hydrate from the same shape of data
  static fromJS(obj: { id?: string; scene: SceneModel; duration: number }): PlaylistItemModel {
    const id = obj.id != null ? obj.id : uuidv4();
    return new PlaylistItemModel(id, obj.scene, obj.duration);
  }
}
