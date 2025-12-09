import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable, makeObservable } from 'mobx';
import UIStore from '../../stores/UIStore';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import SceneStore from '../../stores/SceneStore';
import ClipsList from '../ClipsList';
import ClipStore from '../../stores/ClipStore';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import SceneModel from '../../models/SceneModel';
import ClipModel from '../../models/ClipModel';

class SceneModal extends React.Component {
  readonly props!: Record<string, never>;

  // value of the input textfield
  @observable nameValue: string = '';

  @observable sceneClipValue: ClipModel | null = null;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);

    // Bind event handlers to the correct value of 'this'
    this.handleNameFieldChange = this.handleNameFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSceneClipValueChange = this.handleSceneClipValueChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDialogExited = this.handleDialogExited.bind(this);
  }

  @action handleDialogClose(): void {
    this.closeDialog();
  }

  @action handleNameFieldChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.nameValue = event.target.value;
  }

  @action handleSceneClipValueChange(_event: React.MouseEvent, clip: ClipModel): void {
    this.sceneClipValue = clip;
  }

  @computed get activeScene(): SceneModel | null {
    return UIStore.get().stateTree.sceneModal.activeScene;
  }

  @computed get isEditing(): boolean {
    return UIStore.get().stateTree.sceneModal.activeScene != null;
  }

  @action handleDialogOpen(): void {
    if (this.isEditing && this.activeScene) {
      this.nameValue = this.activeScene.displayName;
      this.sceneClipValue = this.activeScene.clip;
      return;
    }

    if (UIStore.get().stateTree.controlPanel.activePlaylistItem != null) {
      this.nameValue = UIStore.get().stateTree.controlPanel.activePlaylistItem!.scene.displayName;
      this.sceneClipValue = UIStore.get().stateTree.controlPanel.activePlaylistItem!.scene.clip;
      return;
    }

    console.log('when does this happen?');
    // eslint-disable-next-line no-debugger
    debugger;
  }

  @action handleSubmit(_event: React.MouseEvent<HTMLButtonElement>): void {
    if (this.isEditing && this.activeScene && this.sceneClipValue) {
      this.activeScene.displayName = this.nameValue;
      this.activeScene.setClip(this.sceneClipValue);

      this.closeDialog();
      return;
    }

    if (this.sceneClipValue) {
      (SceneStore.get() as any).addNewScene(this.nameValue, this.sceneClipValue);
    }
    this.closeDialog();
  }

  @action clearDialogValues(): void {
    UIStore.get().stateTree.sceneModal.activeScene = null;
    this.nameValue = '';
    this.sceneClipValue = null;
  }

  @action closeDialog(): void {
    UIStore.get().stateTree.sceneModal.isOpen = false;
  }

  @computed get isOpen(): boolean {
    return UIStore.get().stateTree.sceneModal.isOpen;
  }

  @computed get dialogTitle(): string {
    if (this.isEditing) {
      return 'Edit Scene';
    } else {
      return 'Add Scene';
    }
  }

  handleDialogExited(): void {
    this.clearDialogValues();
  }

  // remove the active scene from the store
  @action handleDeleteClick(): void {
    if (this.activeScene) {
      SceneStore.get().removeItem(this.activeScene);
    }

    UIStore.get().stateTree.sceneModal.isOpen = false;
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.isOpen}
        TransitionProps={{ onEnter: this.handleDialogOpen, onExited: this.handleDialogExited }}
        onClose={this.handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <div className="d-flex flex-row">
            <h2>{this.dialogTitle}</h2>
            <div className="ml-auto">
              <Button onClick={this.handleDeleteClick}>
                <DeleteIcon />
              </Button>
            </div>
          </div>
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
            value={this.nameValue}
            onChange={this.handleNameFieldChange}
            fullWidth
          />
          <ClipsList
            items={ClipStore.get().getItems()}
            activeClip={this.sceneClipValue}
            onItemClick={this.handleSceneClipValueChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default observer(SceneModal as any);
