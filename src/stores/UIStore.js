import { observable, computed, reaction, action } from 'mobx';
import ClipModel from '../models/ClipModel';

// keeps track of the UI state.  put it into one spot so we can update it easily
export default class UIStore {
  @observable static stateTree = {
    controlPanel: {
      activeScene: null,
      activePlaylist: null,
    },
  };


  // // singleton pattern
  // static instance;
  // static get() {
  //   if (this.instance == null) {
  //     this.instance = observable(new UIStore());
  //   }
  //   return this.instance;
  // }

  // // Refresh store contents from parsed JSON
  // refreshFromJS(arr) {
  //   this.items = arr.map(item => ClipModel.fromJS(item));
  // }
}
