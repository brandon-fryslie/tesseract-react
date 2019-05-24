import { observable, action } from 'mobx';
import ControlModel from '../models/ControlModel';
import PlaylistStore from './PlaylistStore';

// keeps track of the UI state.  put it into one spot so we can update it easily
export default class UIStore {
  @observable stateTree = {
    controlPanel: {
      activePlaylist: null, // Active playlist on control panel
      activePlaylistItem: null, // Active playlist item on control panel
      activeControls: [], // Controls for the active scene on control panel
      currentSceneDurationRemaining: -1, // Remaining duration for current scene (-1 == infinity)
      playState: 'STOPPED', // playing, looping current scene, or stopped
    },
    playlistsPanel: {
      activePlaylist: null, // Active playlist on playlists panel
    },
    scenesPanel: {
      activeScene: null, // Active scene on scenes panel
    },
    settingsPanel: {
      shouldShowFullScreenButton: false,
      serverAddr: 'localhost',
      // State of any edited fields, if this has values we know we have unsaved data
      editState: {},
    },
  };

  // singleton pattern
  static instance;

  static get() {
    if (this.instance == null) {
      this.instance = new UIStore();
    }
    return this.instance;
  }

  getValue(panelKey, propertyKey) {
    return this.stateTree[panelKey][propertyKey];
  }

  @action setValue(panelKey, propertyKey, value) {
    this.stateTree[panelKey][propertyKey] = value;
  }

  // Triggered from Backend / websocket event
  @action updateControlPanelActiveState(activeState) {
    const activePlaylist = PlaylistStore.get().find('id', activeState.playlistId);
    const activePlaylistItem = activePlaylist.items.find(i => i.id === activeState.playlistItemId);

    // debugger

    this.setControlPanelState({
      activePlaylist: activePlaylist,
      activePlaylistItem: activePlaylistItem,
      currentSceneDurationRemaining: activeState.currentSceneDurationRemaining,
      playState: activeState.playlistPlayState,
      activeControls: this.getControlPanelClipControls(activePlaylistItem.scene),
      changeFromBackend: true, // is this a good idea?
    });

    console.log(`[UIStore.updateControlPanelActiveState] Updated control panel activeState to: 'playlist: ${ activePlaylist.displayName }' 'scene: ${ activePlaylistItem.scene.displayName }'`);
  }

  setControlPanelState(newState) {
    this.stateTree.controlPanel = newState;
  }

  // Using this will automatically set changeFromBackend to false, unless we pass it in
  updateControlPanelState(newState) {
    this.setControlPanelState({
      ...this.stateTree.controlPanel,
      changeFromBackend: false,
      ...newState,
    });
  }

  getControlPanelClipControls(scene) {
    return scene.clipControls.map((control) => {
      return ControlModel.fromJS(control.toJS());
    });
  }
}
