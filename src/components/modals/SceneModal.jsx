import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import UIStore from '../../stores/UIStore';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import SceneStore from '../../stores/SceneStore';
import ClipsList from '../ClipsList';
import ClipStore from '../../stores/ClipStore';
import DeleteIcon from '@material-ui/icons/DeleteForever';

@observer
class SceneModal extends React.Component {

  // value of the input textfield
  @observable nameValue = '';

  @observable sceneClipValue = null;

  constructor(...args) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handleNameFieldChange = this.handleNameFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSceneClipValueChange = this.handleSceneClipValueChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDialogExited = this.handleDialogExited.bind(this);
  }

  @action handleDialogClose() {
    this.closeDialog();
  }

  @action handleNameFieldChange(event) {
    this.nameValue = event.target.value;
  }

  @action handleSceneClipValueChange(event, clip) {
    this.sceneClipValue = clip;
  }

  @computed get activeScene() {
    return UIStore.get().stateTree.sceneModal.activeScene;
  }

  @computed get isEditing() {
    return UIStore.get().stateTree.sceneModal.activeScene != null;
  }

  handleDialogOpen() {
    if (this.isEditing) {
      this.nameValue = this.activeScene.displayName;
      this.sceneClipValue = this.activeScene.clip;
      return;
    }

    if (UIStore.get().stateTree.controlPanel.activePlaylistItem != null) {
      this.nameValue = UIStore.get().stateTree.controlPanel.activePlaylistItem.scene.displayName;
      this.sceneClipValue = UIStore.get().stateTree.controlPanel.activePlaylistItem.scene.clip;
      return;
    }

    console.log("when does this happen?");
    debugger;
  }

  handleSubmit(event) {
    if (this.isEditing) {
      this.activeScene.displayName = this.nameValue;
      this.activeScene.setClip(this.sceneClipValue);

      this.closeDialog();
      return;
    }

    SceneStore.get().addNewScene(this.nameValue, this.sceneClipValue);
    this.closeDialog();
  }

  @action clearDialogValues() {
    UIStore.get().stateTree.sceneModal.activeScene = null;
    this.nameValue = '';
    this.sceneClipValue = null;
  }

  @action closeDialog() {
    UIStore.get().stateTree.sceneModal.isOpen = false;
  }

  @computed get isOpen() {
    return UIStore.get().stateTree.sceneModal.isOpen;
  }

  @computed get dialogTitle() {
    if (this.isEditing) {
      return 'Edit Scene';
    } else {
      return 'Add Scene';
    }
  }

  handleDialogExited() {
    this.clearDialogValues();
  }

  // remove the active scene from the store
  @action handleDeleteClick() {
    SceneStore.get().removeItem(this.activeScene);

    UIStore.get().stateTree.sceneModal.isOpen = false;
  }

  render() {
    return (
      <Dialog open={ this.isOpen } onEnter={ this.handleDialogOpen } onClose={ this.handleDialogClose } onExited={ this.handleDialogExited } aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <div className="d-flex flex-row">
            <h2>{ this.dialogTitle }</h2>
            <div className="ml-auto">
              <Button onClick={ this.handleDeleteClick }><DeleteIcon /></Button>
            </div>

          </div>
          {/*<h4>{ this.dialogTitle }</h4>*/}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set the name of the Scene, and choose a clip.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={ this.nameValue }
            onChange={ this.handleNameFieldChange }
            fullWidth />
          <ClipsList
            items={ ClipStore.get().getItems() }
            activeClip={ this.sceneClipValue }
            onItemClick={ this.handleSceneClipValueChange } />
        </DialogContent>
        <DialogActions>
          <Button onClick={ this.handleDialogClose } color="primary">
            Cancel
          </Button>
          <Button onClick={ this.handleSubmit } color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SceneModal.propTypes = {};

export default SceneModal;
