import { observable } from 'mobx';
import BaseModel from './BaseModel';
import ClipModel from './ClipModel';
import ControlModel from './ControlModel';

// A Scene is one or more clips loaded into channels with specific parameters defined
// Scenes have two channels (for now, can expand to 4 later)
export default class SceneModel extends BaseModel {
  id;

  // Pretty name
  @observable displayName;

  // Clip for the scene.  type: ClipModel
  @observable clip;

  // Array of 7 floats
  @observable rawClipValues;

  @observable clipControls;

  constructor(id, displayName, clip, rawClipValues) {
    super();
    this.id = id;
    this.displayName = displayName;
    this.clip = clip;
    this.rawClipValues = rawClipValues;

    // need to create the Scene's controls
    this.clipControls = this.clip.controls.map((control) => {
      return ControlModel.fromJS(control.toJS());
    });

    // hacky, this should be better
    rawClipValues.forEach((value, idx) => {
      if (this.clipControls.length > idx) {
        this.clipControls[idx].currentValue = value;
      }
    });
  }

  toJS() {
    return {
      id: this.id,
      displayName: this.displayName,
      clip: this.clip,
      clipValues: this.clipValues,
    };
  }

  static fromJS(obj) {
    return new SceneModel(obj.id, obj.displayName, obj.clip, obj.clipValues);
  }
}
