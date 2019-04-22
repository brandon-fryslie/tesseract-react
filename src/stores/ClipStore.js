import { observable, computed, reaction, action } from 'mobx';
import ClipModel from '../models/PlaylistModel';

export default class ClipStore {
  @observable clips = [];

  // get clips() {
  //   return this.clips;
  // }

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
  addClip(playlist) {
    this.clips.push(playlist);
  }

  // Pass in a clipId and get the model from the clip store
  findClip(clipId) {
    return this.clips.find(c => c.clipId === clipId);
  }

  static fromJS(arr) {
    const store = new ClipStore();
    store.clips = arr.map(item => ClipModel.fromJS(store, item));
    return store;
  }
}
