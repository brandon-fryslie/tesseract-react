import { observable, computed, reaction, action } from 'mobx';
import ClipModel from '../models/ClipModel';

export default class ClipStore {
  @observable clips = [];

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
    const result = this.clips.find(c => c.clipId === clipId);
    if (result == null) {
      debugger;
      throw `Error! Could not find clip ${clipId}`;
    }
    return result;
  }

  static fromJS(arr) {
    const store = new ClipStore();
    store.clips = arr.map(item => ClipModel.fromJS(store, item));
    return store;
  }
}
