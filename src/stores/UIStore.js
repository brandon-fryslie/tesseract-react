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
      serverAddr: 'nukamini.local',
      // State of any edited fields, if this has values we know we have unsaved data
      editState: {},
    },
    playlistModal: {
      isOpen: false,
      activePlaylist: null, // null if we're creating a playlist, defined otherwise
    },
    sceneModal: {
      isOpen: false,
      activeScene: null, // null if we're creating a playlist, defined otherwise
    },
    filePickerModal: {
      isOpen: false,
      control: null,
    },
    websocket: {
      isConnected: false,
      ref: null,
    }
  };

  // singleton pattern
  static instance;

  static get() {
    if (this.instance == null) {
      this.instance = new UIStore();
    }
    return this.instance;
  }

  constructor() {
    // Load some stuff from local storage
    this.loadLocalStorage();
  }

  loadLocalStorage() {
    const serverAddr = localStorage.getItem('serverAddr');

    if (serverAddr != null) {
      this.stateTree.settingsPanel.serverAddr = serverAddr;
    }
  }

  saveLocalStorage() {
    localStorage.setItem('serverAddr', this.stateTree.settingsPanel.serverAddr);
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
    const clipControlValues = activeState.clipControlValues;

    let activeControls;
    if (activePlaylistItem == null) {
      // This handles the case where we are trying to play a playlist with no items
      activeControls = null;
    } else {
      activeControls = this.getControlPanelClipControls(activePlaylistItem.scene, clipControlValues);
    }

    this.setControlPanelState({
      activePlaylist: activePlaylist,
      activePlaylistItem: activePlaylistItem,
      currentSceneDurationRemaining: activeState.currentSceneDurationRemaining,
      playState: activeState.playlistPlayState,
      activeControls: activeControls,
      changeFromBackend: true,
    });

    // another time we're handling a playlist with no items...
    let activeSceneName;
    if (activePlaylist == null) {
      activeSceneName = '[no playlist]';
    } else if (activePlaylist.items.length === 0) {
      activeSceneName = '[playlist is empty]';
    } else if (activePlaylistItem == null) {
      activeSceneName = '[no active playlist item]';
    } else {
      activeSceneName = activePlaylistItem.scene.displayName;
    }

    console.log(`[UIStore.updateControlPanelActiveState] Updated control panel activeState to: 'playlist: ${ activePlaylist.displayName }' 'scene: ${ activeSceneName }'`);
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

  // Gets the ControlModel objects that correspond to the active scene
  // Duplicates the Models rather than changing the existing ones that are defined on the scene in the store
  // If we didn't do this, changing the live controls would update the Scene itself and persist those changes to the backend
  getControlPanelClipControls(scene, clipControlValues) {
    if (scene.clip.clipId !== clipControlValues.clipId) {
      debugger;
      throw `[UIStore] Error: Scene clipId '${scene.clip.clipId}' doesn't match clipId for values '${clipControlValues.clipId}'`;
    }

    const values = clipControlValues.values;
    return scene.cloneClipControls(values);
  }
}
