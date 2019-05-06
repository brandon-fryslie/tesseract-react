import { observable } from 'mobx';
import BaseModel from './BaseModel';

// A Scene is one or more clips loaded into channels with specific parameters defined
// Scenes have two channels (for now, can expand to 4 later)
export default class SceneModel extends BaseModel {
  id;

  // Pretty name
  @observable displayName;

  // Clip loaded into Channel 1.  type: ClipModel
  @observable channel1Clip;

  // Clip loaded into Channel 2.  type: ClipModel
  @observable channel2Clip;

  constructor(id, displayName, channel1Clip, channel2Clip) {
    super();
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

  static fromJS(obj) {
    return new SceneModel(obj.id, obj.displayName, obj.channel1Clip, obj.channel2Clip);
  }
}
