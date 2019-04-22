import { observable, computed, reaction, action } from 'mobx';
import PlaylistModel from '../models/PlaylistModel';

export default class PlaylistStore {
  @observable playlists = [];

  get playlists() {
    return this.playlists;
  }

  // this is what will eventually fetch the playlists from the api endpoint
  // subscribeServerToStore() {
  //   reaction(
  //     () => this.toJS(),
  //     todos => window.fetch && fetch('/api/todos', {
  //       method: 'post',
  //       body: JSON.stringify({ todos }),
  //       headers: new Headers({ 'Content-Type': 'application/json' }),
  //     }),
  //   );
  // }

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
