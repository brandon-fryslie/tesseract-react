import { observable, computed, reaction, action } from 'mobx';
import PlaylistModel from '../models/PlaylistModel';

export default class PlaylistStore {
  @observable items = [];

  get playlists() {
    return this.items;
  }

  // @action
  addPlaylist(playlist) {
    this.items.push(playlist);
  }

  static fromJS(arr) {
    const store = new PlaylistStore();
    store.items = arr.map(item => PlaylistModel.fromJS(store, item));
    return store;
  }
}
