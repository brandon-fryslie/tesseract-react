import { observable, makeObservable } from 'mobx';
import BaseModel from './BaseModel';

// Control types supported by the application
export type ControlType = 'knob' | 'slider' | '2-axis-slider' | 'text-input' | 'file-picker';

// Interface for control data serialization
export interface IControlData {
  displayName: string;
  type: ControlType;
  defaultValue: number | string;
  currentValue: number | string;
  fieldName: string;
  minValue: number;
  maxValue: number;
}

export default class ControlModel extends BaseModel {
  // Pretty name for the control, e.g. 'Position'
  @observable displayName!: string;

  // The type of the control.  types are: knob, slider, 2-axis-slider, text input, file picker
  // maybe these need to be subclasses so we can define the values better?
  @observable type!: ControlType;

  // The default value of the control
  @observable defaultValue!: number | string;

  // The current value of the control
  @observable currentValue!: number | string;

  // The field on the backend object that this Model represents
  // e.g., p1, p2, p3, p4, etc
  // When this model changes, we need to know which field to update on the backend
  // type: string
  @observable fieldName!: string;

  // The minimum value for the control (default: 0)
  @observable minValue!: number;

  // The max value for the control (default: 1)
  @observable maxValue!: number;

  constructor(
    displayName: string,
    type: ControlType,
    defaultValue: number | string,
    currentValue: number | string | null,
    fieldName: string,
    maxValue: number = 1,
    minValue: number = 0
  ) {
    super();
    makeObservable(this);

    this.displayName = displayName;
    this.type = type;
    this.defaultValue = defaultValue;
    this.currentValue = currentValue == null ? defaultValue : currentValue;
    this.fieldName = fieldName;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  toJS(): IControlData {
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

  static fromJS(obj: IControlData): ControlModel {
    return new ControlModel(
      obj.displayName,
      obj.type,
      obj.defaultValue,
      obj.currentValue,
      obj.fieldName,
      obj.maxValue,
      obj.minValue
    );
  }
}
