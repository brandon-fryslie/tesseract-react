import { observable, makeObservable } from 'mobx';
import ControlModel, { IControlData } from './ControlModel';
import BaseModel from './BaseModel';

// Interface for clip data serialization
export interface IClipData {
  displayName: string;
  clipId: string;
  controls: IControlData[];
}

export default class ClipModel extends BaseModel {
  // Pretty name for the clip
  @observable displayName!: string;

  // Clip ID to reference on the backend
  @observable clipId!: string;

  // The controls required of the clip (ControlModels) and the default values
  @observable controls!: ControlModel[];

  constructor(displayName: string, clipId: string, controls: ControlModel[]) {
    super();
    makeObservable(this);

    this.displayName = displayName;
    this.clipId = clipId;
    this.controls = controls;
  }

  toJS(): IClipData {
    return {
      displayName: this.displayName,
      clipId: this.clipId,
      controls: this.controls.map(c => c.toJS()),
    };
  }

  static fromJS(obj: IClipData): ClipModel {
    const controls = obj.controls.map(c => ControlModel.fromJS(c));

    return new ClipModel(obj.displayName, obj.clipId, controls);
  }
}
