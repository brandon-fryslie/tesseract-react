import BaseStore from './BaseStore';
import BaseModel from '../models/BaseModel';

class SettingsModel extends BaseModel {
  key;
  value;

  constructor(key, value) {
    super();

    this.key = key;
    this.value = value;
  }
}

export default class SettingsStore extends BaseStore {

  constructor(key, value) {
    super();

    this.envConfig = window.ENV_CONFIG;

    if (this.envConfig == null) {
      throw "ERROR: ENV_CONFIG is not defined!";
    }
  }

  // These are set by the Webpack Define Plugin
  // webpackDefinedValues = {
  //   // eslint-disable-next-line no-undef
  //   DEFAULT_SERVER_ADDR: DEFAULT_SERVER_ADDR,
  // };

  // Get the value for a particular setting
  getValue(key) {
    const settingValue = this.envConfig[key];

    if (settingValue == null) {
      throw `ERROR: No value for setting key ${key}`;
    }

    return settingValue;
  }

  getModelType() {
    return SettingsModel;
  }
}
