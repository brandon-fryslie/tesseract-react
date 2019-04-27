import { observable, computed, reaction, action } from 'mobx';

// Keeps track of the state for the PlaylistPanel
export default class PlaylistPanelStore {
  @observable currentPlaylist = null;

  get currentPlaylist() {
    return this.currentPlaylist;
  }

  @action
  setCurrentPlaylist(p) {
    this.currentPlaylist = p;
  }
}
