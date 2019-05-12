import ClipStore from '../stores/ClipStore';
import SceneStore from '../stores/SceneStore';
import PlaylistStore from '../stores/PlaylistStore';
import UIStore from '../stores/UIStore';

export default class StateManager {

  // Instance of WebsocketController
  ws;

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

}
