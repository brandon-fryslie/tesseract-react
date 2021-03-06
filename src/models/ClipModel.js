import { observable } from 'mobx';
import ControlModel from './ControlModel';
import BaseModel from './BaseModel';

export default class ClipModel extends BaseModel {
  // Pretty name for the clip
  @observable displayName;

  // Clip ID to reference on the backend
  @observable clipId;

  // The controls required of the clip (ControlModels) and the default values
  @observable controls;

  constructor(displayName, clipId, controls) {
    super();

    this.displayName = displayName;
    this.clipId = clipId;
    this.controls = controls;
  }

  toJS() {
    return {
      displayName: this.displayName,
      clipId: this.clipId,
      controls: this.controls,
    };
  }

  static fromJS(obj) {
    const controls = obj.controls.map(c => ControlModel.fromJS(c));

    return new ClipModel(obj.displayName, obj.clipId, controls);
  }
}
