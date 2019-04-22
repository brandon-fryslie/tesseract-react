import { observable } from 'mobx';

export default class ClipModel {
  store;
  id;

  // Pretty name for the clip
  @observable displayName;

  // Clip ID to reference on the backend
  @observable clipId;

  // Duration of the clip in seconds
  @observable duration;

  constructor(store, id, displayName, clipId, duration) {
    this.store = store;
    this.id = id;
    this.displayName = displayName;
    this.clipId = clipId;
    this.duration = duration;
  }

  // this is dumb.  we shouldn't be reaching into the store from the model
  // destroy() {
  //   this.store.clips.remove(this);
  // }

  toJS() {
    return {
      id: this.id,
      displayName: this.displayName,
      clipId: this.clipId,
      duration: this.duration,
    };
  }

  static fromJS(store, obj) {
    return new ClipModel(store, obj.id, obj.displayName, obj.clipId, obj.duration);
  }
}
