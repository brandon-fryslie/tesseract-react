import { makeObservable } from 'mobx';
import BaseStore from './BaseStore';
import BaseModel from '../models/BaseModel';

// Internal model for settings - not exported as it's only used by SettingsStore
class SettingsModel extends BaseModel {
  key: string;
  value: any;

  constructor(key: string, value: any) {
    super();
    this.key = key;
    this.value = value;
  }

  toJS(): Record<string, any> {
    return { key: this.key, value: this.value };
  }

  static fromJS(obj: { key: string; value: any }): SettingsModel {
    return new SettingsModel(obj.key, obj.value);
  }
}

// Declare window.ENV_CONFIG type
declare global {
  interface Window {
    ENV_CONFIG: Record<string, any>;
  }
}

export default class SettingsStore extends BaseStore<SettingsModel> {
  envConfig: Record<string, any>;

  constructor() {
    super();
    makeObservable(this);

    this.envConfig = window.ENV_CONFIG;

    if (this.envConfig == null) {
      throw new Error("ERROR: ENV_CONFIG is not defined!");
    }
  }

  // Get the value for a particular setting
  getValue(key: string): any {
    const settingValue = this.envConfig[key];

    if (settingValue == null) {
      throw new Error(`ERROR: No value for setting key ${key}`);
    }

    return settingValue;
  }

  getModelType() {
    return SettingsModel;
  }
}
