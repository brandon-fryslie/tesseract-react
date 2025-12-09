import { observable, action, makeObservable } from 'mobx';

// MediaStore manages media files by type (e.g., videos)
// It doesn't follow the BaseStore pattern as it stores data differently
export default class MediaStore {
  @observable items: Record<string, string[]> = {};

  // Singleton pattern
  static instance: MediaStore;

  static get(): MediaStore {
    if (this.instance == null) {
      this.instance = new MediaStore();
    }
    return this.instance;
  }

  constructor() {
    makeObservable(this);
  }

  // Returns a list of the desired type of media
  // Only 'videos' are supported right now
  getMediaList(type: string): string[] | undefined {
    return this.items[type];
  }

  @action
  refreshFromJS(data: Record<string, string[]>): void {
    this.items = data;
  }
}
