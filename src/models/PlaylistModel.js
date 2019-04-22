import { observable } from 'mobx';

export default class PlaylistModel {
  store;
  id;
  @observable displayName;

  // List of clips (ClipModel objects) that are in this playlist
  @observable clips;

  constructor(store, id, displayName, clips) {
    this.store = store;
    this.id = id;
    this.displayName = displayName;
    this.clips = clips;
  }

  // this is dumb.  we shouldn't be reaching into the store from the model
  // destroy() {
  //   this.store.playlists.remove(this);
  // }

  toJS() {
    return {
      id: this.id,
      displayName: this.displayName,
      clips: this.clips,
    };
  }

  static fromJS(store, obj) {
    return new PlaylistModel(store, obj.id, obj.displayName, obj.clips);
  }
}
