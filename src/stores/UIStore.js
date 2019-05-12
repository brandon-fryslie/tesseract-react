import { observable, computed, reaction, action } from 'mobx';
import ClipModel from '../models/ClipModel';
import ControlModel from '../models/ControlModel';

// keeps track of the UI state.  put it into one spot so we can update it easily
export default class UIStore {
  @observable stateTree = {
    controlPanel: {
      activeScene: null, // Active scene on control panel
      activePlaylist: null, // Active playlist on control panel
      activeControls: null, // Controls for the active scene on control panel
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

  setControlPanelActiveScene(scene) {
    this.updateControlPanelClipControls(scene);
    this.stateTree.controlPanel.activeScene = scene;
  }

  updateControlPanelClipControls(scene) {
    const controls = scene.clipControls.map((control) => {
      return ControlModel.fromJS(control.toJS());
    });

    this.stateTree.controlPanel.activeControls = controls;
  }
}
