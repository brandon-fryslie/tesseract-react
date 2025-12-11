import {
  observe, reaction, action, makeObservable, IReactionDisposer, Lambda,
} from 'mobx';
import ClipStore from '../stores/ClipStore';
import SceneStore from '../stores/SceneStore';
import PlaylistStore from '../stores/PlaylistStore';
import PlaylistModel from '../models/PlaylistModel';
import UIStore from '../stores/UIStore';
import MediaStore from '../stores/MediaStore';

// Type for WebSocket controller interface
interface WebsocketController {
  sendMessage(type: string, data?: any): void;
}

// Type for initial state data
interface InitialStateData {
  clipData: any[];
  sceneData: any[];
  playlistData: any[];
  mediaData: Record<string, string[]>;
  activeState: any;
}

// Type for state update data
interface StateUpdateData {
  key: string;
  value: any;
}

// Type for refresh data
interface RefreshData {
  playlistData: any[];
  sceneData: any[];
}

export default class StateManager {
  private static instance: StateManager;

  // Instance of WebsocketController
  websocketController: WebsocketController | null = null;

  // MobX disposers for cleanup
  sceneStoreDisposer: Lambda | null = null;
  sceneItemDisposers: Lambda[] = [];
  playlistStoreDisposer: Lambda | null = null;
  playlistItemDisposers: Lambda[] = [];
  controlPanelDisposer: IReactionDisposer | null = null;

  constructor() {
    makeObservable(this);
  }

  static get(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  setWebsocketController(controller: WebsocketController): void {
    this.websocketController = controller;
  }

  // Send a message through the websocket
  sendMessage(type: string, data?: any): void {
    if (this.websocketController) {
      this.websocketController.sendMessage(type, data);
    }
  }

  // Load initial state from backend
  loadInitialState(): void {
    console.log('[StateManager] Requesting initial state from backend');
    this.sendMessage('requestInitialState');
  }

  // Handle initial state from backend
  @action
  handleSendInitialStateAction(data: InitialStateData): void {
    console.log('[StateManager] Received initial state from backend');
    this.initializeStoresFromBackend(data);
    this.setupStoreObservers();
  }

  // Handle state update from backend
  @action
  handleStateUpdatedAction(data: StateUpdateData | RefreshData): void {
    console.log('[StateManager] Received state update from backend');

    // Check if this is a refresh operation
    if ('playlistData' in data && 'sceneData' in data) {
      this.refreshStores(data as RefreshData);
    } else {
      this.updateStateValue(data as StateUpdateData);
    }
  }

  // Initialize stores with data from backend
  @action
  initializeStoresFromBackend(data: InitialStateData): void {
    console.log('[StateManager] Initializing stores from backend data');

    ClipStore.get().refreshFromJS(data.clipData);
    SceneStore.get().refreshFromJS(data.sceneData);
    PlaylistStore.get().refreshFromJS(data.playlistData);
    MediaStore.get().refreshFromJS(data.mediaData);

    // Set the active state on the Live Controls panel
    this.setControlPanelActiveState(data.activeState);
  }

  // Update a single state value
  @action
  updateStateValue(data: StateUpdateData): void {
    console.log(`[StateManager] Updating state: ${data.key} = ${data.value}`);
    // Implementation depends on what state values need to be updated
  }

  // Refresh specific stores
  @action
  refreshStores(data: RefreshData): void {
    console.log('[StateManager] Refreshing stores');
    PlaylistStore.get().refreshFromJS(data.playlistData);
    SceneStore.get().refreshFromJS(data.sceneData);
  }

  // Set the control panel active state
  @action
  setControlPanelActiveState(activeState: any): void {
    if (activeState) {
      UIStore.get().updateControlPanelActiveState(activeState);
    }
  }

  // Set up observers for store changes
  setupStoreObservers(): void {
    console.log('[StateManager] Setting up store observers');

    // Observe SceneStore changes - use shallow observation to avoid deepObserve
    // limitation with shared object references (same clip can appear in multiple scenes)
    this.setupSceneObservers();

    // Observe PlaylistStore changes - use shallow observation to avoid deepObserve
    // limitation with shared object references (same scene can appear in multiple playlist items)
    this.setupPlaylistObservers();

    // Observe control panel changes
    this.controlPanelDisposer = reaction(
      () => UIStore.get().stateTree.controlPanel,
      (controlPanel) => {
        this.handleControlPanelChange(controlPanel);
      }
    );
  }

  // Set up scene observers without using deepObserve (which fails on shared clip references)
  setupSceneObservers(): void {
    // Observe the items array of SceneStore
    this.sceneStoreDisposer = observe(SceneStore.get().items, (change: any) => {
      this.handleSceneStoreChange(change);
      // Re-setup item observers when scenes are added/removed
      this.setupSceneItemObservers();
    });

    // Set up observers for each scene's properties
    this.setupSceneItemObservers();
  }

  // Set up observers for scene properties (without traversing into shared clip objects)
  setupSceneItemObservers(): void {
    // Clean up existing item observers
    this.sceneItemDisposers.forEach(dispose => dispose());
    this.sceneItemDisposers = [];

    // Observe each scene's observable properties (but not clip - it's shared)
    SceneStore.get().items.forEach((scene: any) => {
      // Observe displayName changes
      const nameDisposer = observe(scene, 'displayName', (change: any) => {
        this.handleSceneStoreChange(change);
      });
      this.sceneItemDisposers.push(nameDisposer);

      // Observe rawClipValues changes
      const valuesDisposer = observe(scene, 'rawClipValues', (change: any) => {
        this.handleSceneStoreChange(change);
      });
      this.sceneItemDisposers.push(valuesDisposer);

      // Observe clipControls array changes
      const controlsDisposer = observe(scene.clipControls, (change: any) => {
        this.handleSceneStoreChange(change);
      });
      this.sceneItemDisposers.push(controlsDisposer);

      // Observe filename changes
      const filenameDisposer = observe(scene, 'filename', (change: any) => {
        this.handleSceneStoreChange(change);
      });
      this.sceneItemDisposers.push(filenameDisposer);
    });
  }

  // Set up playlist observers without using deepObserve (which fails on shared references)
  setupPlaylistObservers(): void {
    // Observe the items array of PlaylistStore
    this.playlistStoreDisposer = observe(PlaylistStore.get().items, (change: any) => {
      this.handlePlaylistStoreChange(change);
      // Re-setup item observers when playlists are added/removed
      this.setupPlaylistItemObservers();
    });

    // Set up observers for each playlist's items
    this.setupPlaylistItemObservers();
  }

  // Set up observers for playlist item arrays (without traversing into shared scene objects)
  setupPlaylistItemObservers(): void {
    // Clean up existing item observers
    this.playlistItemDisposers.forEach(dispose => dispose());
    this.playlistItemDisposers = [];

    // Observe each playlist's items array
    PlaylistStore.get().items.forEach((playlist: PlaylistModel) => {
      const disposer = observe(playlist.items, (change: any) => {
        this.handlePlaylistStoreChange(change);
      });
      this.playlistItemDisposers.push(disposer);

      // Also observe displayName and defaultDuration changes
      const nameDisposer = observe(playlist, 'displayName', (change: any) => {
        this.handlePlaylistStoreChange(change);
      });
      this.playlistItemDisposers.push(nameDisposer);

      const durationDisposer = observe(playlist, 'defaultDuration', (change: any) => {
        this.handlePlaylistStoreChange(change);
      });
      this.playlistItemDisposers.push(durationDisposer);
    });
  }

  // Handle SceneStore changes
  handleSceneStoreChange(change: any): void {
    console.log('[StateManager] SceneStore changed:', change.type);

    if (change.type === 'add' || change.type === 'update' || change.type === 'delete') {
      this.sendSceneUpdate();
    }
  }

  // Handle PlaylistStore changes
  handlePlaylistStoreChange(change: any): void {
    console.log('[StateManager] PlaylistStore changed:', change.type);

    if (change.type === 'add' || change.type === 'update' || change.type === 'delete') {
      this.sendPlaylistUpdate();
    }
  }

  // Handle control panel changes
  handleControlPanelChange(controlPanel: any): void {
    // Only send updates if the change originated from the frontend
    if (!controlPanel.changeFromBackend) {
      console.log('[StateManager] Control panel changed (from frontend)');
      this.sendControlPanelUpdate();
    }
  }

  // Send scene updates to backend
  sendSceneUpdate(): void {
    const scenes = SceneStore.get().getItems().map(scene => scene.toJS());
    this.sendMessage('scene_update', { scenes });
  }

  // Send playlist updates to backend
  sendPlaylistUpdate(): void {
    const playlists = PlaylistStore.get().getItems().map(playlist => playlist.toJS());
    this.sendMessage('playlist_update', { playlists });
  }

  // Send control panel updates to backend
  sendControlPanelUpdate(): void {
    const controlPanel = UIStore.get().stateTree.controlPanel;
    this.sendMessage('control_panel_update', { controlPanel });
  }

  // Clean up observers
  dispose(): void {
    console.log('[StateManager] Disposing observers');

    if (this.sceneStoreDisposer) {
      this.sceneStoreDisposer();
      this.sceneStoreDisposer = null;
    }

    // Clean up scene item observers
    this.sceneItemDisposers.forEach(dispose => dispose());
    this.sceneItemDisposers = [];

    if (this.playlistStoreDisposer) {
      this.playlistStoreDisposer();
      this.playlistStoreDisposer = null;
    }

    // Clean up playlist item observers
    this.playlistItemDisposers.forEach(dispose => dispose());
    this.playlistItemDisposers = [];

    if (this.controlPanelDisposer) {
      this.controlPanelDisposer();
      this.controlPanelDisposer = null;
    }
  }
}
