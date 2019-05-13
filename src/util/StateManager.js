import ClipStore from '../stores/ClipStore';
import SceneStore from '../stores/SceneStore';
import PlaylistStore from '../stores/PlaylistStore';
import UIStore from '../stores/UIStore';
import { observe } from 'mobx';
import { deepObserve } from 'mobx-utils';

export default class StateManager {

  // Instance of WebsocketController
  ws;

  uiStoreDisposer;

  constructor(...args) {
    // Bind event handlers to the correct value of 'this'
    this.handleUIStoreUpdated = this.handleUIStoreUpdated.bind(this);
    this.handleLiveControlsUpdated = this.handleLiveControlsUpdated.bind(this);

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
    console.log("!!! received initial state!!!", data);

    ClipStore.get().refreshFromJS(data.clipData);
    SceneStore.get().refreshFromJS(data.sceneData);
    PlaylistStore.get().refreshFromJS(data.playlistData);
  }

  // handle a state updated action from the backend
  handleStateUpdatedAction(data) {
    console.log("got a stateUpdate action");
    console.log(data);

    if (data.key === 'activeScene') {
      // Find the scene
      try {
        const scene = SceneStore.get().findSceneById(data.value);
        UIStore.get().setControlPanelActiveScene(scene);
      } catch (e) {
        console.log(`Error finding activeScene in store: ${e.message}`);
        console.log(e.stack);
      }
    } else {
      throw `Error: ${data.key} is not a valid stateKey`;
    }
  }

  observeItemsForChanges() {
    // maybe we don't need this.  maybe more targeted observers would be more useful right now
    // deepObserve(UIStore.get().stateTree, this.handleUIStoreUpdated);

    // todo: each of these calls to 'observe' is a memory leak unless we clean it up
    deepObserve(UIStore.get().stateTree.controlPanel.activeControls, this.handleLiveControlsUpdated);
  }

  // handle activeControl state updated on frontend
  // e.g., a user used a knob to change the value
  handleLiveControlsUpdated(change, path) {
    // Ignore these events
    if (change.type === "splice") {
      return;
    }

    console.log("got handleLiveControlsUpdate", change, path);
    debugger

    // actually, here I need to figure out if it is anything the backend cares about
    // we don't care about (or want to respond to) having our activeState updated
    // if (change.name === "currentValue")

    // here I need to send a stateUpdate message via websocket
    const data = {

    };

    this.ws.sendMessage('stateUpdate', data)
  }

  // handle activeControl state updated on frontend
  // e.g., a user used a knob to change the value
  handleUIStoreUpdated(change, path) {
    console.log("got handleUIStoreUpdated", change, path);
    debugger

    // actually, here I need to figure out if it is anything the backend cares about
    // we don't care about (or want to respond to) having our activeState updated
    // if (change.name === "currentValue")

    // here I need to send a stateUpdate message via websocket
    const data = {

    };

    this.ws.sendMessage('stateUpdate', data)
  }
}
