import ClipStore from '../stores/ClipStore';
import SceneStore from '../stores/SceneStore';
import PlaylistStore from '../stores/PlaylistStore';
import UIStore from '../stores/UIStore';
import { observe, reaction, action } from 'mobx';
import { deepObserve } from 'mobx-utils';
import PlaylistItemModel from '../models/PlaylistItemModel';

export default class StateManager {

  // Instance of WebsocketController
  ws;

  disposers = [];

  constructor(...args) {
    // Bind event handlers to the correct value of 'this'
    this.handleUIStoreUpdated = this.handleUIStoreUpdated.bind(this);
    this.handleLiveControlsUpdated = this.handleLiveControlsUpdated.bind(this);
    this.handlePlaylistUpdated = this.handlePlaylistUpdated.bind(this);
    this.handlePlaylistItemChange = this.handlePlaylistItemChange.bind(this);
    this.handlePlaylistUpdate = this.handlePlaylistUpdate.bind(this);

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
  createObserve(obj, fn) {
    this.disposers.push(observe(obj, fn));
  }

  // Observe a list
  createObserveList(items, fn) {
    items.forEach((item) => {
      this.createObserve(item, fn);
    });
  }

  // Observe a list
  createDeepObserveList(items, fn) {
    debugger;
    items.forEach((item) => {
      this.createDeepObserve(item, fn);
    });
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
    try {
      const activePlaylist = PlaylistStore.get().find('id', activeState.playlistId);
      const activePlaylistItem = activePlaylist.items.find(i => i.id === activeState.playlistItemId);

      UIStore.get().setValue('controlPanel', 'activePlaylist', activePlaylist);
      UIStore.get().setActivePlaylistItem(activePlaylistItem);

      console.log(`[StateManager] Updated control panel activeState to: 'playlist: ${ activePlaylist.displayName }' 'scene: ${ activePlaylistItem.scene.displayName }'`);
    } catch (e) {
      console.log(`[StateManager] Error finding activeScene in store: ${ e.message }`);
      console.log(e.stack);
    }
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
  ////////// ACTIVE STATE / LIVE CONTROLS //////////


  ////////// PLAYLIST STATE //////////
  observePlaylistItems() {
    console.log('[StateManager] Playlist Items Update.  Creating observers for playlist items');
    const items = PlaylistStore.get().items.map((p) => { return p.items; });
    items.forEach((playlistItems) => {
      // This handles adding/removing/reordering
      this.createObserve(playlistItems, this.handlePlaylistUpdate);

      // This handles editing items in the grid
      this.createObserveList(playlistItems, this.handlePlaylistItemChange);
    });
  }

  handlePlaylistItemChange(change) {
    const data = {
      stateKey: 'playlist',
      value: PlaylistItemModel.findContainingPlaylist(change.object.id).toJS(),
    };

    this.ws.sendMessage('stateUpdate', data);
  }

  handlePlaylistUpdate(change) {
    const updatedPlaylist = PlaylistItemModel.findContainingPlaylist(change.object[0].id);

    const data = {
      stateKey: 'playlist',
      value: updatedPlaylist.toJS(),
    };

    this.ws.sendMessage('stateUpdate', data);
  }

  observeItemsForChanges() {
    console.log('[StateManager] Observing Items for Changes');

    // clean up any previous observers
    this.disposers.forEach((dispose) => { dispose(); });

    // todo: each of these calls to 'observe' is a memory leak unless we clean it up
    // clean them up in componentWillUnmount or similar
    // This actually works, don't mess with it
    this.createDeepObserve(UIStore.get().stateTree.controlPanel.activeControls, this.handleLiveControlsUpdated);

    // whenever the contents of the PlaylistStore change, create playlist observers
    this.createReaction(
      () => PlaylistStore.get().items.map(p => p),
      () => this.observePlaylistItems()
    );
  }


  // handle playlist update, i.e., reorder, add item, duration change
  // e.g., a user used a knob to change the value
  handlePlaylistUpdated(change, path) {
    const js = UIStore.get().stateTree.playlistsPanel.activePlaylist.items.forEach((item) => {
      // debugger;
    });

    // debugger;
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

  // handle activeControl state updated on frontend
  // e.g., a user used a knob to change the value
  handleUIStoreUpdated(change, path) {
    //   console.log("got handleUIStoreUpdated", change, path);
    //   debugger
    //
    //   // actually, here I need to figure out if it is anything the backend cares about
    //   // we don't care about (or want to respond to) having our activeState updated
    //   // if (change.name === "currentValue")
    //
    //   // here I need to send a stateUpdate message via websocket
    //   const data = {
    //
    //   };
    //
    //   this.ws.sendMessage('stateUpdate', data)
  }
}
