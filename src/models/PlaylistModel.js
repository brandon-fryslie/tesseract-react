import { observable } from 'mobx';
import PlaylistItemModel from './PlaylistItemModel';

export default class PlaylistModel {
  store;
  id;
  @observable displayName;

  // List of items (PlaylistItemModel) that are in this playlist
  @observable items;

  // The default duration to use when adding a new Scene
  defaultDuration = 60;

  constructor(store, id, displayName, items) {
    this.store = store;
    this.id = id;
    this.displayName = displayName;
    this.items = items;
  }

  // Adds a PlaylistItemModel (a Scene + a Duration) to the Playlist
  addScene(scene, index) {
    const item = PlaylistItemModel.fromJS({ scene, duration: this.defaultDuration });
    this.items.splice(index, 0, item);
  }

  toJS() {
    return {
      id: this.id,
      displayName: this.displayName,
      items: this.items,
    };
  }

  static fromJS(store, obj) {
    return new PlaylistModel(store, obj.id, obj.displayName, obj.items);
  }
}
