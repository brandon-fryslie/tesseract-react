import ClipStore from '../stores/ClipStore';
import SceneStore from '../stores/SceneStore';
import PlaylistStore from '../stores/PlaylistStore';
import UIStore from '../stores/UIStore';
import { observe, reaction, action, transaction, runInAction } from 'mobx';
import { deepObserve } from 'mobx-utils';
import PlaylistItemModel from '../models/PlaylistItemModel';

export default class StateManager {

  // Instance of WebsocketController
  ws;

  disposers = [];

  constructor(...args) {
    // Bind event handlers to the correct value of 'this'
    this.handleLiveControlsUpdated = this.handleLiveControlsUpdated.bind(this);
    this.handlePlaylistUpdate = this.handlePlaylistUpdate.bind(this);
    this.handlePlayStateUpdated = this.handlePlayStateUpdated.bind(this);

    this.observeItemsForChanges();
  }

  // singleton pattern
  static instance;

  static get() {
    if (this.instance == null) {
      this.instance = new StateManager();
    }
    return this.instance;
  }

  setWebsocketController(ws) {
    this.ws = ws;
  }

  // Create a reaction.  tracks the disposer so we can get rid of it later
  createReaction(expression, effect) {
    this.disposers.push(reaction(expression, effect));
  }

  // Observe items
  createDeepObserve(obj, fn) {
    this.disposers.push(deepObserve(obj, fn));
  }

  // Observe items
  createObserve(obj, property = null, fn) {
    if (property != null) {
      this.disposers.push(observe(obj, property, fn));
    } else {
      this.disposers.push(observe(obj, fn));
    }
  }

  // Observe a list
  createObserveList(items, fn) {
    items.forEach((item) => {
      this.createObserve(item, fn);
    });
  }

  // Observe a list
  createDeepObserveList(items, fn) {
    items.forEach((item) => {
      this.createDeepObserve(item, fn);
    });
  }

  // This is a conglomeration of a method that sets up observers for the data we care about
  // In some cases, it sets up a reaction that will create the observers when the necessary data is available
  // todo: each of these calls to 'observe' is a memory leak unless we clean it up
  observeItemsForChanges() {
    console.log('[StateManager] Observing Items for Changes');

    // clean up any previous observers
    this.disposers.forEach((dispose) => { dispose(); });

    // Handle clicks on play/loop scene/stop buttons
    // this.createObserve(UIStore.get().stateTree, '', this.handlePlayStateUpdated);
    this.createObserve(UIStore.get().stateTree, this.handlePlayStateUpdated);

    // handle changing to a different playlist
    // this.createObserve(UIStore.get().stateTree.controlPanel, this.handleActivePlaylistUpdated);

    // whenever the contents of the PlaylistStore change, create playlist observers
    this.createReaction(
      () => PlaylistStore.get().items.map(p => p),
      () => this.observePlaylistItems(),
    );
  }

  ////////// INITIAL STATE //////////
  loadInitialState() {
    console.log('[StateManager] Requesting Initital State');
    this.ws.sendMessage('requestInitialState');
  }

  handleSendInitialStateAction(data) {
    console.log('[StateManager] Received initial state', data);

    ClipStore.get().refreshFromJS(data.clipData);
    SceneStore.get().refreshFromJS(data.sceneData);
    PlaylistStore.get().refreshFromJS(data.playlistData);

    // Set the active state on the Live Controls panel
    this.setControlPanelActiveState(data.activeState);
  }

  ////////// INITIAL STATE //////////

  ////////// ACTIVE STATE / LIVE CONTROLS //////////
  // handle a state updated action from the backend
  handleStateUpdatedAction(data) {
    // console.log("got a stateUpdate action");
    // console.log(data);

    if (data.key === 'activeState') {
      this.setControlPanelActiveState(data.value);
    } else {
      throw `Error: ${ data.key } is not a valid stateKey`;
    }
  }

  @action setControlPanelActiveState(activeState) {
    UIStore.get().updateControlPanelActiveState(activeState);
  }

  // handle activeControl state updated on frontend
  // e.g., a user used a knob to change the value
  handleLiveControlsUpdated(change, path) {
    // Ignore these events
    if (change.type === 'splice') {
      return;
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
  @action handlePlayStateUpdated(change) {
    // Ignore these events
    if (change.type === 'splice') {
      return;
    }

    // we only care about controlPanel updates here
    if (change.name !== 'controlPanel') { return; }

    const target = change.object.controlPanel;

    // We have to (re)observe the live controls so they will work
    this.createDeepObserve(target.activeControls, this.handleLiveControlsUpdated);

    // don't send a websocket message if the change was from the backend
    if (!target.changeFromBackend) {

      const activePlaylistItemId = target.activePlaylistItem ? target.activePlaylistItem.id : null;

      const data = {
        stateKey: 'playState',
        value: {
          playState: target.playState,
          activePlaylistId: target.activePlaylist.id,
          activePlaylistItemId: activePlaylistItemId,
        },
      };

      this.ws.sendMessage('stateUpdate', data);
    }
  }

  ////////// ACTIVE STATE / LIVE CONTROLS //////////

  ////////// PLAYLIST STATE //////////
  observePlaylistItems() {
    console.log('[StateManager] Playlist Items Update.  Creating observers for playlist items');

    PlaylistStore.get().items.forEach((p) => {
      // observe playlists for changes in displayName or defaultDuration
      this.createObserve(p, (change) => { this.handlePlaylistUpdate(change, p); });

      // This handles adding/removing/reordering
      this.createObserve(p.items, (change) => { this.handlePlaylistUpdate(change, p); });

      // This handles editing items in the grid
      this.createObserveList(p.items, (change) => { this.handlePlaylistUpdate(change, p); });
    });
  }

  handlePlaylistUpdate(change, playlist) {
    const data = {
      stateKey: 'playlist',
      value: playlist.toJS(),
    };

    this.ws.sendMessage('stateUpdate', data);
  }

  ////////// PLAYLIST STATE //////////

}
