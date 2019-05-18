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
  @observable rawClipValues = [];

  @observable clipControls = [];

  constructor(id, displayName, clip, rawClipValues) {
    super();
    this.id = id;
    this.displayName = displayName;
    this.rawClipValues = rawClipValues;

    this.setClip(clip);
  }

  // When we set the clip, create the 'Control' objects
  setClip(clip) {
    this.clip = clip;

    // if we have controls, save their values to an array
    let values;
    if (this.clipControls && this.clipControls.length > 0) {
      values = this.clipControls.map((control) => control.currentValue);
    } else {
      values = this.rawClipValues;
    }

    const controls = this.createClipControls(clip, values);

    this.clipControls.replace(controls);
  }

  // Create Clip Controls.  Set values to the values in 'values'
  createClipControls(clip, values) {
    const controls = clip.controls.map((control) => {
      return ControlModel.fromJS(control.toJS());
    });

    // hacky but does the job
    values.forEach((value, idx) => {
      if (controls.length > idx) {
        controls[idx].currentValue = value;
      }
    });

    return controls;
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
