import { observable, computed, reaction, action } from 'mobx';
import PlaylistModel from '../models/PlaylistModel';
import SceneModel from '../models/SceneModel';
import PlaylistItemModel from '../models/PlaylistItemModel';

export default class PlaylistStore {
  @observable items = [];

  sceneStore = null;

  constructor(sceneStore) {
    this.sceneStore = sceneStore;
  }

  get playlists() {
    return this.items;
  }

  // @action
  addPlaylist(playlist) {
    this.items.push(playlist);
  }

  // this is hacky and should not live here, or really work like this at all

  hydrateScenesOnPlaylists(playlists) {
    playlists.forEach((playlist) => {
      const newItems = this.hydratePlaylistItems(playlist);

      const pim = new PlaylistItemModel()

      // eslint-disable-next-line no-param-reassign
      playlist.items = newItems;
    });
  }

  hydratePlaylistItems(playlist) {
    return playlist.items.map((item) => {
      const scene = this.sceneStore.findSceneById(item.sceneId);
      return new PlaylistItemModel(scene, item.duration);
    });
  }

  // We need to find the actual scene objects in the SceneStore for each playlist and attach them to the item
  refreshFromJS(arr) {

    // hacky method to jam the SceneModel objects in
    this.hydrateScenesOnPlaylists(arr);

    this.items = arr.map(item => PlaylistModel.fromJS(item));
  }

  // static fromJS(arr) {
  //   const store = new PlaylistStore();
  //   store.items = arr.map(item => PlaylistModel.fromJS(item));
  //   return store;
  // }
}
