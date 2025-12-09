import * as mobx from 'mobx';
import { observable, makeObservable } from 'mobx';
import PlaylistItemModel from './PlaylistItemModel';
import BaseModel from './BaseModel';
import SceneModel from './SceneModel';

// Interface for playlist data serialization
export interface IPlaylistData {
  id: string | number;
  displayName: string;
  defaultDuration: number;
  items: any[]; // Serialized playlist items
}

// Play state enum to match the Java backend
export enum PlayState {
  PLAYING = 'PLAYING',
  LOOP_SCENE = 'LOOP_SCENE',
  STOPPED = 'STOPPED',
}

export default class PlaylistModel extends BaseModel {
  id: string | number;
  @observable displayName!: string;

  // List of items (PlaylistItemModel) that are in this playlist
  @observable items!: mobx.IObservableArray<PlaylistItemModel>;

  // The default duration to use when adding a new Scene
  @observable defaultDuration!: number;

  // Fake ENUM to match the Java side
  static playState = {
    PLAYING: 'PLAYING' as const,
    LOOP_SCENE: 'LOOP_SCENE' as const,
    STOPPED: 'STOPPED' as const,
  };

  constructor(id: string | number, displayName: string, defaultDuration: number, items: PlaylistItemModel[]) {
    super();
    makeObservable(this);

    if (defaultDuration == null) {
      console.trace();
      throw "[PlaylistModel] Default duration was null";
    }

    this.id = id;
    this.displayName = displayName;
    this.defaultDuration = defaultDuration;
    this.items = observable.array(items);
  }

  // Adds a PlaylistItemModel (a Scene + a Duration) to the Playlist
  addScene(scene: SceneModel, index: number): void {
    const item = PlaylistItemModel.fromJS({ scene, duration: this.defaultDuration });
    this.items.splice(index, 0, item);
  }

  removeItem(playlistItemId: string): void {
    const playlistItemIndex = this.items.findIndex((item) => {
      return item.id === playlistItemId;
    });

    this.items.splice(playlistItemIndex, 1);
  }

  toJS(): IPlaylistData {
    return {
      id: this.id,
      displayName: this.displayName,
      defaultDuration: this.defaultDuration,
      items: this.items.map(item => item.toJS()),
    };
  }

  static fromJS(obj: IPlaylistData & { items: PlaylistItemModel[] }): PlaylistModel {
    return new PlaylistModel(obj.id, obj.displayName, obj.defaultDuration, obj.items);
  }
}
