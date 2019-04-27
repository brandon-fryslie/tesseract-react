import { observable } from 'mobx';

// A Scene is one or more clips loaded into channels with specific parameters defined
// Scenes have two channels (for now, can expand to 4 later)
export default class SceneModel {
  store;
  id;

  // Pretty name
  @observable displayName;

  // Clip loaded into Channel 1.  type: ClipModel
  @observable channel1Clip;

  // Clip loaded into Channel 2.  type: ClipModel
  @observable channel2Clip;

  constructor(store, id, displayName, channel1Clip, channel2Clip) {
    this.store = store;
    this.id = id;
    this.displayName = displayName;
    this.channel1Clip = channel1Clip;
    this.channel2Clip = channel2Clip;
  }

  toJS() {
    return {
      id: this.id,
      displayName: this.displayName,
      type: this.type,
      channel1Clip: this.channel1Clip,
      channel2Clip: this.channel2Clip,
    };
  }

  static fromJS(store, obj) {
    return new SceneModel(store, obj.id, obj.displayName, obj.channel1Clip, obj.channel2Clip);
  }
}
