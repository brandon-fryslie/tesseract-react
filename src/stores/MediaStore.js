import BaseStore from './BaseStore';
import ClipModel from '../models/ClipModel';

export default class MediaStore extends BaseStore {

  items = {};

  // Returns a list of the desired type of media
  // Only 'videos' are supported right now
  getMediaList(type) {
    return this.items[type];
  }

  refreshFromJS(data) {
    this.items = data;
  }
}
