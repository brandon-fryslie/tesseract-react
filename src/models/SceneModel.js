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

  constructor(id, displayName, clip, rawClipValues = null) {
    super();
    this.id = id;
    this.displayName = displayName;
    this.clip = clip;

    if (rawClipValues != null) {
      this.setClipValues(this.clip, rawClipValues);
    }
  }

  setClip(clip) {
    this.clip = clip;

    // create clip controls with default values
    // totally refactor this
    const clipDefaultValues = clip.controls.map(control => control.defaultValue);
    this.setClipValues(clip, clipDefaultValues);
  }

  // TODO: refactor
  setClipValues(clip, values) {
    this.rawClipValues = values;
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

  // Clones the existing clip controls
  cloneClipControls(values = null) {
    return this.clipControls.map((control) => {
      const newControlModel = ControlModel.fromJS(control.toJS());

      if (values != null) {
        newControlModel.currentValue = values[newControlModel.fieldName];
      }
      return newControlModel;
    });
  }

  toJS() {
    return {
      id: this.id,
      displayName: this.displayName,
      clipId: this.clip.clipId,
      clipValues: this.rawClipValues,
    };
  }

  static fromJS(obj) {
    return new SceneModel(obj.id, obj.displayName, obj.clip, obj.clipValues);
  }
}
