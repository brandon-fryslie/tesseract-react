import { observable } from 'mobx';
import BaseModel from './BaseModel';

export default class ControlModel extends BaseModel {
  // Pretty name for the control, e.g. 'Position'
  @observable displayName;

  // The type of the control.  types are: knob, slider, 2-axis-slider, text input, file picker
  // maybe these need to be subclasses so we can define the values better?
  @observable type;

  // The default value of the control
  @observable defaultValue;

  // The current value of the control
  @observable currentValue;

  constructor(displayName, type, defaultValue, currentValue) {
    super();

    this.displayName = displayName;
    this.type = type;
    this.defaultValue = defaultValue;
    this.currentValue = currentValue == null ? defaultValue : currentValue;
  }

  toJS() {
    return {
      displayName: this.displayName,
      type: this.type,
      defaultValue: this.defaultValue,
      currentValue: this.currentValue,
    };
  }

  static fromJS(obj) {
    return new ControlModel(obj.displayName, obj.type, obj.defaultValue, obj.currentValue);
  }
}
