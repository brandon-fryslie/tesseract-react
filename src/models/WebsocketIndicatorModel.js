import { observable, action } from 'mobx';
import BaseModel from './BaseModel';

export default class WebsocketIndicatorModel extends BaseModel {
  @observable isConnected;

  constructor() {
    super();
    this.isConnected = false;
  }

  @action
  setConnected(value) {
    this.isConnected = value;
  }
}
