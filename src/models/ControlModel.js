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

  // The field on the backend object that this Model represents
  // e.g., p1, p2, p3, p4, etc
  // When this model changes, we need to know which field to update on the backend
  // type: string
  @observable fieldName;

  // The minimum value for the control (default: 0)
  @observable minValue;

  // The max value for the control (default: 1)
  @observable maxValue;

  constructor(displayName, type, defaultValue, currentValue, fieldName, maxValue = 1, minValue = 0) {
    super();

    this.displayName = displayName;
    this.type = type;
    this.defaultValue = defaultValue;
    this.currentValue = currentValue == null ? defaultValue : currentValue;
    this.fieldName = fieldName;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  toJS() {
    return {
      displayName: this.displayName,
      type: this.type,
      defaultValue: this.defaultValue,
      currentValue: this.currentValue,
      fieldName: this.fieldName,
      minValue: this.minValue,
      maxValue: this.maxValue,
    };
  }

  static fromJS(obj) {
    return new ControlModel(obj.displayName, obj.type, obj.defaultValue, obj.currentValue, obj.fieldName, obj.maxValue, obj.minValue);
  }
}
