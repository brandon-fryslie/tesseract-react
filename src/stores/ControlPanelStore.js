import { observable, computed, reaction, action } from 'mobx';

export default class ControlPanelStore {
  @observable currentPlaylist = null;
  @observable isPlaying = false;
  @observable shuffleEnabled = false;
  @observable repeatEnabled = false;

  get currentPlaylist() {
    return this.currentPlaylist;
  }

  @action
  toggleIsPlaying(isPlaying) {
    this.isPlaying = !isPlaying;
  }

  @action
  setCurrentPlaylist(p) {
    this.currentPlaylist = p;
  }

  @action
  toggleShuffleClips() {
    this.shuffleEnabled = !this.shuffleEnabled;
  }

  @action
  toggleRepeatPlayList() {
    this.repeatEnabled = !this.repeatEnabled;
  }
}
