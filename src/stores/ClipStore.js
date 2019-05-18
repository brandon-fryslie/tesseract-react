import BaseStore from './BaseStore';
import ClipModel from '../models/ClipModel';

export default class ClipStore extends BaseStore {
  getModelType() {
    return ClipModel;
  }
}
