import { observable } from 'mobx';

export default class PlaylistModel {
  store;
  id;
  @observable displayName;

  // List of items (SceneModel objects or TransitionModel objects (Transitions later) that are in this playlist
  @observable items;

  constructor(store, id, displayName, items) {
    this.store = store;
    this.id = id;
    this.displayName = displayName;
    this.items = items;
  }

  // this is dumb.  we shouldn't be reaching into the store from the model
  // destroy() {
  //   this.store.playlists.remove(this);
  // }

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
