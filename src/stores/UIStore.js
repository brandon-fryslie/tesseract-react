import { observable, computed, reaction, action } from 'mobx';
import ClipModel from '../models/ClipModel';
import ControlModel from '../models/ControlModel';

// keeps track of the UI state.  put it into one spot so we can update it easily
export default class UIStore {
  @observable stateTree = {
    controlPanel: {
      activeScene: null, // Active scene on control panel
      activePlaylist: null, // Active playlist on control panel
      activeControls: [], // Controls for the active scene on control panel
    },
    settingsPanel: {
      shouldShowFullScreenButton: false,
      serverAddr: '192.168.0.32',
      // State of any edited fields, if this has values we know we have unsaved data
      editState: {},
    },
  };

  // singleton pattern
  static instance;

  static get() {
    if (this.instance == null) {
      this.instance = observable(new UIStore());
    }
    return this.instance;
  }

  getValue(panelKey, propertyKey) {
    return this.stateTree[panelKey][propertyKey];
  }

  setValue(panelKey, propertyKey, value) {
    this.stateTree[panelKey][propertyKey] = value;
  }

  setControlPanelActiveScene(scene) {
    this.updateControlPanelClipControls(scene);
    this.stateTree.controlPanel.activeScene = scene;
  }

  // Update the activeControls to match the new activeScene
  // We clone the objects because the values on the Scene itself won't be updated
  // when we are editing the 'live' controls
  updateControlPanelClipControls(scene) {
    const controls = scene.clipControls.map((control) => {
      return ControlModel.fromJS(control.toJS());
    });

    this.stateTree.controlPanel.activeControls.replace(controls);
  }
}
