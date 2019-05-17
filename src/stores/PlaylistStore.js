import { observable, computed, reaction, action } from 'mobx';
import PlaylistModel from '../models/PlaylistModel';
import PlaylistItemModel from '../models/PlaylistItemModel';
import SceneStore from "./SceneStore";

export default class PlaylistStore {
  @observable items = [];

  sceneStore = null;

  constructor() {
    this.sceneStore = SceneStore.get();
  }

  // singleton pattern
  static instance;
  static get() {
    if (this.instance == null) {
      this.instance = new PlaylistStore();
    }
    return this.instance;
  }

  getItems() {
    return this.items;
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
}
