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

// Type for MobX change events
interface MobXChange {
  type: string;
  name?: string;
  object: any;
  newValue?: any;
  addedCount?: number;
  removedCount?: number;
  added?: any[];
  removed?: any[];
}

// Type for initial state data
interface InitialStateData {
  clipData: any[];
  sceneData: any[];
  playlistData: any[];
  mediaData: any[];
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
  ws!: WebsocketController;

  disposers: Record<string, Array<IReactionDisposer | IDisposer | Lambda>> = {};

  constructor(...args: any[]) {
    makeObservable(this);
    // Bind event handlers to the correct value of 'this'
    this.handleLiveControlsUpdated = this.handleLiveControlsUpdated.bind(this);
    this.handlePlaylistAddRemove = this.handlePlaylistAddRemove.bind(this);
    this.handleSceneAddRemove = this.handleSceneAddRemove.bind(this);
    this.handlePlaylistUpdate = this.handlePlaylistUpdate.bind(this);
    this.handlePlayStateUpdated = this.handlePlayStateUpdated.bind(this);

    this.observeItemsForChanges();
  }

  // singleton pattern
  static instance: StateManager | undefined;

  static get(): StateManager {
    if (this.instance == null) {
      this.instance = new StateManager();
    }
    return this.instance;
  }

  setWebsocketController(ws: WebsocketController): void {
    this.ws = ws;
  }

  // Create a reaction.  tracks the disposer so we can get rid of it later
  createReaction<T>(key: string, expression: () => T, effect: (arg: T) => void): void {
    this.addDisposer(key, reaction(expression, effect));
  }

  // Observe items
  createDeepObserve(key: string, obj: any, fn: (change: any) => void): void {
    this.addDisposer(key, deepObserve(obj, fn));
  }

  // Observe items
  createObserve(key: string, obj: any, property: string | ((change: MobXChange) => void), fn?: (change: MobXChange) => void): void {
    if (typeof property === 'string' && fn) {
      this.addDisposer(key, observe(obj, property, fn));
    } else if (typeof property === 'function') {
      this.addDisposer(key, observe(obj, property));
    }
  }

  // Observe a list
  createObserveList(key: string, items: any[], fn: (change: MobXChange) => void): void {
    items.forEach((item) => {
      this.createObserve(key, item, fn);
    });
  }

  // Observe a list
  createDeepObserveList(key: string, items: any[], fn: (change: any) => void): void {
    items.forEach((item) => {
      this.createDeepObserve(key, item, fn);
    });
  }

  // Keep track of disposers
  addDisposer(key: string, disposer: IReactionDisposer | IDisposer | Lambda): void {
    if (this.disposers[key] == null) {
      this.disposers[key] = [];
    }

    this.disposers[key].push(disposer);
  }

  disposeObservers(key: string): void {
    if (this.disposers[key] == null) {
      // throw `[StateManager] No existing disposers for key ${ key }`;
      return;
    }

    this.disposers[key].forEach((disposer) => { disposer(); });
  }

  // This is a conglomeration of a method that sets up observers for the data we care about
  // In some cases, it sets up a reaction that will create the observers when the necessary data is available
  // todo: each of these calls to 'observe' is a memory leak unless we clean it up
  observeItemsForChanges(): void {
    console.log('[StateManager] Observing Items for Changes');

    // clean up any previous playstate, playlistStore, or sceneStore observers
    this.disposeObservers('playState');
    this.disposeObservers('playlistStore');
    this.disposeObservers('sceneStore');

    // Handle clicks on play/loop scene/stop buttons
    // this.createObserve(UIStore.get().stateTree, '', this.handlePlayStateUpdated);
    this.createObserve('playState', UIStore.get().stateTree, this.handlePlayStateUpdated);

    // whenever the contents of the PlaylistStore change, create playlist observers
    this.createReaction(
      'playlistStore',
      () => PlaylistStore.get().getItems().map((p) => p),
      () => this.observePlaylists(),
    );

    // whenever the contents of the SceneStore change, create playlist observers
    this.createReaction(
      'sceneStore',
      () => SceneStore.get().getItems().map((p) => p),
      () => this.observeScenes(),
    );
  }

  /// /////// INITIAL STATE //////////
  loadInitialState(): void {
    console.log('[StateManager] Requesting Initital State');
    this.ws.sendMessage('requestInitialState');
  }

  handleSendInitialStateAction(data: InitialStateData): void {
    console.log('[StateManager] Received initial state', data);

    ClipStore.get().refreshFromJS(data.clipData);
    SceneStore.get().refreshFromJS(data.sceneData);
    PlaylistStore.get().refreshFromJS(data.playlistData);
    MediaStore.get().refreshFromJS(data.mediaData);

    // Set the active state on the Live Controls panel
    this.setControlPanelActiveState(data.activeState);
  }

  /// /////// INITIAL STATE //////////

  /// /////// ACTIVE STATE / LIVE CONTROLS //////////
  // handle a state updated action from the backend
  handleStateUpdatedAction(data: StateUpdateData): void {
    // console.log("got a stateUpdate action");
    // console.log(data);

    if (data.key === 'activeState') {
      this.setControlPanelActiveState(data.value);
    } else if (data.key === 'storeRefresh') {
      this.refreshStores(data.value);
    } else {
      throw `[StateManager] Error: ${data.key} is not a valid stateKey`;
    }
  }

  @action setControlPanelActiveState(activeState: any): void {
    UIStore.get().updateControlPanelActiveState(activeState);
  }

  @action refreshStores(refreshData: RefreshData): void {
    PlaylistStore.get().refreshFromJS(refreshData.playlistData);
    SceneStore.get().refreshFromJS(refreshData.sceneData);
  }

  // handle activeControl state updated on frontend
  // e.g., a user used a knob to change the value
  handleLiveControlsUpdated(change: MobXChange): void {
    // Ignore these events
    if (change.type === 'splice') {
      return;
    }

    if (change.object.constructor.name !== 'ControlModel') {
      throw `[StateManager] Got a change event for activeControls that was not an individual control change.  That isn't implemented.  Change object name: ${change.object.constructor.name}`;
    }

    // here I need to send a stateUpdate message via websocket
    const data = {
      // these state keys are going to be pretty arbitrary at this point
      stateKey: 'activeControls',
      // value is arbitrary shape, the handler on the backend for stateKey 'activeControls' needs to handle it
      value: {
        fieldName: change.object.fieldName,
        newValue: change.newValue,
      },
    };

    this.ws.sendMessage('stateUpdate', data);
  }

  // Handle changing active playlist, playlistItem, or playing/paused/stopped
  // Only sends a stateUpdate event if 'controlPanel.changeFromBackend' is false, this is my hacky way of keeping us from running in an infinite loop
  @action handlePlayStateUpdated(change: MobXChange): void {
    // Ignore these events
    if (change.type === 'splice') {
      return;
    }

    // we only care about controlPanel updates here
    if (change.name !== 'controlPanel') { return; }

    const target = change.object.controlPanel;

    // We have to (re)observe the live controls so they will work
    this.createDeepObserve('activeControl', target.activeControls, this.handleLiveControlsUpdated);

    // don't send a websocket message if the change was from the backend
    if (!target.changeFromBackend) {
      const activePlaylistItemId = target.activePlaylistItem ? target.activePlaylistItem.id : null;

      const data = {
        stateKey: 'playState',
        value: {
          playState: target.playState,
          activePlaylistId: target.activePlaylist.id,
          activePlaylistItemId,
        },
      };

      this.ws.sendMessage('stateUpdate', data);
    }
  }

  /// /////// ACTIVE STATE / LIVE CONTROLS //////////

  /// /////// PLAYLIST STATE //////////
  observePlaylists(): void {
    console.log('[StateManager] Playlist Update.  Creating observers for playlist items');

    // clear existing observers
    this.disposeObservers('playlist');

    this.createObserve('playlist', PlaylistStore.get().items, this.handlePlaylistAddRemove);

    PlaylistStore.get().getItems().forEach((p) => {
      // observe playlists for changes in displayName or defaultDuration
      this.createObserve('playlist', p, (change) => { this.handlePlaylistUpdate(change, p); });

      // This handles adding/removing/reordering
      this.createObserve('playlist', p.items, (change) => { this.handlePlaylistUpdate(change, p); });

      // This handles editing items in the grid
      this.createObserveList('playlist', p.items, (change) => { this.handlePlaylistUpdate(change, p); });
    });
  }

  handlePlaylistAddRemove(change: MobXChange): void {
    let data;
    if ((change.addedCount && change.addedCount > 1) || (change.removedCount && change.removedCount > 1)) {
      // this happens when we're refreshing the entire store from the backend.  ignore these changes
      return;

      // throw '[StateManager] Added or removed more than one playlist at the time!  Error!';
    }

    if (change.addedCount && change.addedCount > 0) { // this is only ever going to be one right now
      data = { stateKey: 'playlist', value: change.added![0].toJS() };
    } else if (change.removedCount && change.removedCount > 0) {
      // hack for now.  todo: refactor.  make a better API that can handle CRUD for multiple items
      data = { stateKey: 'sceneDelete', value: change.removed![0].toJS() };
    } else {
      debugger;
      throw '[StateManager] Don\'t know when this happens';
    }

    this.ws.sendMessage('stateUpdate', data);
  }

  handlePlaylistUpdate(change: MobXChange, playlist: any): void {
    const data = {
      stateKey: 'playlist',
      value: playlist.toJS(),
    };

    this.ws.sendMessage('stateUpdate', data);
  }

  /// /////// PLAYLIST STATE //////////

  /// /////// SCENE STATE //////////
  observeScenes(): void {
    console.log('[StateManager] Scene Update.  Creating observers for Scenes');

    // clear existing observers
    this.disposeObservers('scene');

    this.createObserve('scene', SceneStore.get().items, this.handleSceneAddRemove);

    SceneStore.get().getItems().forEach((scene) => {
      this.createObserve('scene', scene, (change) => { this.handleSceneUpdate(change, scene); });
    });
  }

  handleSceneAddRemove(change: MobXChange): void {
    let data;

    if ((change.addedCount && change.addedCount > 1) || (change.removedCount && change.removedCount > 1)) {
      // this happens when we're refreshing the entire store from the backend.  ignore these changes
      return;

      // throw '[StateManager] Added or removed more than one scene at the time!  Error!';
    }

    if (change.addedCount && change.addedCount > 0) { // this is only ever going to be one right now
      data = { stateKey: 'scene', value: change.added![0].toJS() };
    } else if (change.removedCount && change.removedCount > 0) {
      // hack for now.  todo: refactor.  make a better API that can handle CRUD for multiple items
      data = { stateKey: 'sceneDelete', value: change.removed![0].toJS() };
    } else {
      debugger;
      throw '[StateManager] Don\'t know when this happens';
    }

    this.ws.sendMessage('stateUpdate', data);
  }

  handleSceneUpdate(change: MobXChange, scene: any): void {
    const data = {
      stateKey: 'scene',
      value: scene.toJS(),
    };

    this.ws.sendMessage('stateUpdate', data);
  }

  /// /////// SCENE STATE //////////
}
