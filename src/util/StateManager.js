import ClipStore from '../stores/ClipStore';
import SceneStore from '../stores/SceneStore';
import PlaylistStore from '../stores/PlaylistStore';
import UIStore from '../stores/UIStore';
import { autorun, observe, reaction } from 'mobx';
import { deepObserve } from 'mobx-utils';

export default class StateManager {

  // Instance of WebsocketController
  ws;

  disposers = [];

  constructor(...args) {
    // Bind event handlers to the correct value of 'this'
    this.handleUIStoreUpdated = this.handleUIStoreUpdated.bind(this);
    this.handleLiveControlsUpdated = this.handleLiveControlsUpdated.bind(this);
    this.handlePlaylistUpdated = this.handlePlaylistUpdated.bind(this);

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

  loadInitialState() {
    console.log('Requesting Initital State');
    this.ws.sendMessage('requestInitialState');
  }

  handleSendInitialStateAction(data) {
    console.log('!!! received initial state!!!', data);

    ClipStore.get().refreshFromJS(data.clipData);
    SceneStore.get().refreshFromJS(data.sceneData);
    PlaylistStore.get().refreshFromJS(data.playlistData);
    this.setControlPanelActiveState(data.activeState);

    // reobserve everything again when we get an activeState update
    this.observeItemsForChanges();
  }

  // handle a state updated action from the backend
  handleStateUpdatedAction(data) {
    // console.log("got a stateUpdate action");
    // console.log(data);

    // reobserve everything again when we get an activeState update
    this.observeItemsForChanges();

    if (data.key === 'activeState') {
      this.setControlPanelActiveState(data.value);
    } else {
      throw `Error: ${ data.key } is not a valid stateKey`;
    }
  }

  setControlPanelActiveState(activeState) {
    try {
      const activePlaylist = PlaylistStore.get().find('id', activeState.playlistId);
      const activePlaylistItem = activePlaylist.items.find(i => i.id === activeState.playlistItemId);

      UIStore.get().setValue('controlPanel', 'activePlaylist', activePlaylist);
      UIStore.get().setActivePlaylistItem(activePlaylistItem);

      console.log(`Updated control panel activeState to: 'playlist: ${ activePlaylist.displayName }' 'scene: ${ activePlaylistItem.scene.displayName }'`);
    } catch (e) {
      console.log(`Error finding activeScene in store: ${ e.message }`);
      console.log(e.stack);
    }
  }

  observeItemsForChanges() {
    console.log('StateManager: Observing Items for Changes');
    // clean up any previous observers
    this.disposers.forEach((dispose) => { dispose(); });

    // maybe we don't need this.  maybe more targeted observers would be more useful right now
    // deepObserve(UIStore.get().stateTree, this.handleUIStoreUpdated);

    // todo: each of these calls to 'observe' is a memory leak unless we clean it up
    this.disposers.push(deepObserve(UIStore.get().stateTree.controlPanel.activeControls, this.handleLiveControlsUpdated));

    // debugger
    const activePlaylist = UIStore.get().getValue('playlistsPanel', 'activePlaylist');
    if (activePlaylist) {
      console.log(`!!!!! OBSERVING playlist ${ activePlaylist.displayName }`);
      this.disposers.push(observe(activePlaylist));

      observe(UIStore.get().stateTree.playlistsPanel.activePlaylist, () => { debugger; });

      // MOTHERFUCKER CANNOT GET THIS TO TRIGGER!
      const activePlaylist2 = UIStore.get().stateTree.playlistsPanel.activePlaylist;
      activePlaylist2.items.forEach((item) => {
        observe(item, (a,b,c) => { debugger; });
      });

      autorun(() => {
        debugger
        const playlist = UIStore.get().stateTree.playlistsPanel.activePlaylist;
        playlist.items.forEach((item) => {
          console.log(item.duration);
        });
        this.handlePlaylistUpdated();

      });
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

  // handle playlist update, i.e., reorder, add item, duration change
  // e.g., a user used a knob to change the value
  handlePlaylistUpdated(change, path) {
    const js = UIStore.get().stateTree.playlistsPanel.activePlaylist.items.forEach((item) => {
      debugger;
    });

    debugger;
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
