import BaseStore from './BaseStore';
import PlaylistModel from '../models/PlaylistModel';
import PlaylistItemModel from '../models/PlaylistItemModel';
import SceneStore from "./SceneStore";
import { observable } from 'mobx';

export default class PlaylistStore extends BaseStore {
  sceneStore = null;

  constructor() {
    super();
    this.sceneStore = SceneStore.get();
  }

  getModelType() {
    return PlaylistModel;
  }

  // this can be generified, just getting it working for now
  addNewPlaylist(displayName, items = []) {
    this.addItem(new PlaylistModel(this.getNextId(), displayName, items));
  }

  getNextId() {
    const ids = this.items.map(i => i.id).sort();
    const maxId = Math.max.apply(null, ids);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(maxId)) {
      throw "[PlaylistStore]: Got NaN when trying to find the next ID";
    }

    return maxId + 1;
  }

  // this is hacky and should not live here, or really work like this at all
  hydrateScenesOnPlaylists(playlists) {
    playlists.forEach((playlist) => {
      const newItems = this.hydratePlaylistItems(playlist);
      // eslint-disable-next-line no-param-reassign
      playlist.items = newItems;
    });
  }

  hydratePlaylistItems(playlist) {
    return playlist.items.map((item) => {
      const scene = this.sceneStore.find('id', item.sceneId);
      return new PlaylistItemModel(item.id, scene, item.duration);
    });
  }

  // We need to find the actual scene objects in the SceneStore for each playlist and attach them to the item
  refreshFromJS(arr) {
    // hacky method to jam the SceneModel objects in
    this.hydrateScenesOnPlaylists(arr);

    super.refreshFromJS(arr);
  }
}
