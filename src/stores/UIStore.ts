import { observable, action, makeObservable } from 'mobx';
import ControlModel from '../models/ControlModel';
import PlaylistStore from './PlaylistStore';
import SettingsStore from './SettingsStore';
import PlaylistModel from '../models/PlaylistModel';
import PlaylistItemModel from '../models/PlaylistItemModel';
import SceneModel from '../models/SceneModel';

// Type definitions for the UI state tree
interface ControlPanelState {
  activePlaylist: PlaylistModel | null;
  activePlaylistItem: PlaylistItemModel | null;
  activeControls: ControlModel[] | null;
  currentSceneDurationRemaining: number;
  playState: string;
  changeFromBackend?: boolean;
}

interface PlaylistsPanelState {
  activePlaylist: PlaylistModel | null;
}

interface ScenesPanelState {
  activeScene: SceneModel | null;
}

interface SettingsPanelState {
  shouldShowFullScreenButton: boolean;
  serverAddr: string;
  editState: Record<string, any>;
}

interface PlaylistModalState {
  isOpen: boolean;
  activePlaylist: PlaylistModel | null;
}

interface SceneModalState {
  isOpen: boolean;
  activeScene: SceneModel | null;
}

interface FilePickerModalState {
  isOpen: boolean;
  control: ControlModel | null;
  items?: any[]; // Media items to display in the picker
}

interface WebsocketState {
  isConnected: boolean;
  ref: any;
}

interface StateTree {
  controlPanel: ControlPanelState;
  playlistsPanel: PlaylistsPanelState;
  scenesPanel: ScenesPanelState;
  settingsPanel: SettingsPanelState;
  playlistModal: PlaylistModalState;
  sceneModal: SceneModalState;
  filePickerModal: FilePickerModalState;
  websocket: WebsocketState;
}

// Interface for active state updates from backend
interface ActiveStateUpdate {
  playlistId: string | number;
  playlistItemId: string;
  clipControlValues: {
    clipId: string;
    values: Record<string, number | string>;
  };
  currentSceneDurationRemaining: number;
  playlistPlayState: string;
}

// Keeps track of the UI state. Put it into one spot so we can update it easily
export default class UIStore {
  @observable stateTree: StateTree;

  // Singleton pattern
  static instance: UIStore;

  static get(): UIStore {
    if (this.instance == null) {
      this.instance = new UIStore();
    }
    return this.instance;
  }

  constructor() {
    // Get the settings store and extract the value before creating the state tree
    // Cast to SettingsStore to access the getValue method
    const settingsStore = SettingsStore.get() as SettingsStore;
    const defaultServerAddr = settingsStore.getValue('defaultServerAddr');

    this.stateTree = {
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
        serverAddr: defaultServerAddr,
        // State of any edited fields, if this has values we know we have unsaved data
        editState: {},
      },
      playlistModal: {
        isOpen: false,
        activePlaylist: null, // null if we're creating a playlist, defined otherwise
      },
      sceneModal: {
        isOpen: false,
        activeScene: null, // null if we're creating a scene, defined otherwise
      },
      filePickerModal: {
        isOpen: false,
        control: null,
        items: [],
      },
      websocket: {
        isConnected: false,
        ref: null,
      },
    };

    makeObservable(this);

    // Load some stuff from local storage
    this.loadLocalStorage();
  }

  loadLocalStorage(): void {
    const serverAddr = localStorage.getItem('serverAddr');

    if (serverAddr != null) {
      this.stateTree.settingsPanel.serverAddr = serverAddr;
    }
  }

  saveLocalStorage(): void {
    localStorage.setItem('serverAddr', this.stateTree.settingsPanel.serverAddr);
  }

  getValue(panelKey: keyof StateTree, propertyKey: string): any {
    return (this.stateTree[panelKey] as any)[propertyKey];
  }

  @action
  setValue(panelKey: keyof StateTree, propertyKey: string, value: any): void {
    (this.stateTree[panelKey] as any)[propertyKey] = value;
  }

  // Triggered from Backend / websocket event
  @action
  updateControlPanelActiveState(activeState: ActiveStateUpdate): void {
    const activePlaylist = PlaylistStore.get().find('id', activeState.playlistId);
    const activePlaylistItem = activePlaylist.items.find(i => i.id === activeState.playlistItemId);
    const clipControlValues = activeState.clipControlValues;

    let activeControls: ControlModel[] | null;
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
    let activeSceneName: string;
    if (activePlaylist == null) {
      activeSceneName = '[no playlist]';
    } else if (activePlaylist.items.length === 0) {
      activeSceneName = '[playlist is empty]';
    } else if (activePlaylistItem == null) {
      activeSceneName = '[no active playlist item]';
    } else {
      activeSceneName = activePlaylistItem.scene.displayName;
    }

    console.log(`[UIStore.updateControlPanelActiveState] Updated control panel activeState to: 'playlist: ${activePlaylist.displayName}' 'scene: ${activeSceneName}'`);
  }

  @action
  setControlPanelState(newState: ControlPanelState): void {
    this.stateTree.controlPanel = newState;
  }

  // Using this will automatically set changeFromBackend to false, unless we pass it in
  @action
  updateControlPanelState(newState: Partial<ControlPanelState>): void {
    this.setControlPanelState({
      ...this.stateTree.controlPanel,
      changeFromBackend: false,
      ...newState,
    });
  }

  // Gets the ControlModel objects that correspond to the active scene
  // Duplicates the Models rather than changing the existing ones that are defined on the scene in the store
  // If we didn't do this, changing the live controls would update the Scene itself and persist those changes to the backend
  getControlPanelClipControls(
    scene: SceneModel,
    clipControlValues: { clipId: string; values: Record<string, number | string> }
  ): ControlModel[] {
    if (scene.clip.clipId !== clipControlValues.clipId) {
      debugger;
      throw new Error(`[UIStore] Error: Scene clipId '${scene.clip.clipId}' doesn't match clipId for values '${clipControlValues.clipId}'`);
    }

    const values = clipControlValues.values;
    return scene.cloneClipControls(values);
  }
}
