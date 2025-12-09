import {
  observe, reaction, action, makeObservable, IReactionDisposer, Lambda,
} from 'mobx';
import { deepObserve, IDisposer } from 'mobx-utils';
import ClipStore from '../stores/ClipStore';
import SceneStore from '../stores/SceneStore';
import PlaylistStore from '../stores/PlaylistStore';
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
  // Instance of WebsocketController
  websocketController: WebsocketController | null = null;

  // MobX disposers for cleanup
  sceneStoreDisposer: IDisposer | null = null;
  playlistStoreDisposer: IDisposer | null = null;
  controlPanelDisposer: IReactionDisposer | null = null;

  constructor() {
    makeObservable(this);
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

    // Observe SceneStore changes
    this.sceneStoreDisposer = deepObserve(SceneStore.get(), (change: any, path: string) => {
      this.handleSceneStoreChange(change);
    });

    // Observe PlaylistStore changes
    this.playlistStoreDisposer = deepObserve(PlaylistStore.get(), (change: any, path: string) => {
      this.handlePlaylistStoreChange(change);
    });

    // Observe control panel changes
    this.controlPanelDisposer = reaction(
      () => UIStore.get().stateTree.controlPanel,
      (controlPanel) => {
        this.handleControlPanelChange(controlPanel);
      }
    );
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

    if (this.playlistStoreDisposer) {
      this.playlistStoreDisposer();
      this.playlistStoreDisposer = null;
    }

    if (this.controlPanelDisposer) {
      this.controlPanelDisposer();
      this.controlPanelDisposer = null;
    }
  }
}
