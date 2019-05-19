import { observable } from 'mobx';
import PlaylistItemModel from './PlaylistItemModel';
import BaseModel from './BaseModel';

export default class PlaylistModel extends BaseModel {
  id;
  @observable displayName;

  // List of items (PlaylistItemModel) that are in this playlist
  @observable items = [];

  // The default duration to use when adding a new Scene
  defaultDuration = 60;

  constructor(id, displayName, items) {
    super();

    this.id = id;
    this.displayName = displayName;
    this.items.replace(items);
  }

  // Adds a PlaylistItemModel (a Scene + a Duration) to the Playlist
  addScene(scene, index) {
    const item = PlaylistItemModel.fromJS({ scene, duration: this.defaultDuration });
    this.items.splice(index, 0, item);
  }

  removeItem(playlistItemId) {
    const playlistItemIndex = this.items.findIndex((item) => {
      return item.id === playlistItemId;
    });

    this.items.splice(playlistItemIndex, 1);

  }

  toJS() {
    return {
      id: this.id,
      displayName: this.displayName,
      items: this.items.map(item => item.toJS()),
    };
  }

  static fromJS(obj) {
    return new PlaylistModel(obj.id, obj.displayName, obj.items);
  }
}
