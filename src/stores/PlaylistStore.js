import { observable, computed, reaction, action } from 'mobx';
import PlaylistModel from '../models/PlaylistModel';

export default class PlaylistStore {
  @observable playlists = [];

  get playlists() {
    return this.playlists;
  }

  // @action
  addPlaylist(playlist) {
    this.playlists.push(playlist);
  }

  static fromJS(arr) {
    const store = new PlaylistStore();
    store.playlists = arr.map(item => PlaylistModel.fromJS(store, item));
    return store;
  }
}
