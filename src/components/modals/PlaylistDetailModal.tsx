import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable, makeObservable } from 'mobx';
import PlaylistStore from '../../stores/PlaylistStore';
import UIStore from '../../stores/UIStore';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import PlaylistModel from '../../models/PlaylistModel';

class PlaylistDetailModal extends React.Component {
  readonly props!: Record<string, never>;

  // value of the input textfield
  @observable nameValue: string = '';

  @observable defaultDurationValue: number = 60;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);

    // Bind event handlers to the correct value of 'this'
    this.handleNameFieldChange = this.handleNameFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDefaultDurationValueChange = this.handleDefaultDurationValueChange.bind(this);
  }

  handleDialogClose(): void {
    this.closeDialog();
  }

  @action handleNameFieldChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.nameValue = event.target.value;
  }

  @action handleDefaultDurationValueChange(event: React.ChangeEvent<HTMLInputElement>): void {
    let val = parseInt(event.target.value, 10);
    if (Number.isNaN(val)) {
      val = 60;
      console.log(`[PlaylistDetailModal] Error: ${event.target.value} is not a valid integer. Defaulting to 60`);
    }

    this.defaultDurationValue = val;
  }

  @computed get activePlaylist(): PlaylistModel | null {
    return UIStore.get().stateTree.playlistModal.activePlaylist;
  }

  @computed get isEditing(): boolean {
    return UIStore.get().stateTree.playlistModal.activePlaylist != null;
  }

  @action handleDialogOpen(): void {
    if (this.isEditing && this.activePlaylist) {
      this.nameValue = this.activePlaylist.displayName;
      this.defaultDurationValue = this.activePlaylist.defaultDuration;
    }
  }

  @action handleSubmit(_event: React.MouseEvent<HTMLButtonElement>): void {
    if (this.isEditing && this.activePlaylist) {
      this.activePlaylist.displayName = this.nameValue;
      this.activePlaylist.defaultDuration = this.defaultDurationValue;
      this.closeDialog();
      return;
    }

    (PlaylistStore.get() as any).addNewPlaylist(this.nameValue, this.defaultDurationValue, []);
    this.nameValue = '';
    this.closeDialog();
  }

  @action closeDialog(): void {
    UIStore.get().stateTree.playlistModal.isOpen = false;
    UIStore.get().stateTree.playlistModal.activePlaylist = null;
    this.nameValue = '';
    this.defaultDurationValue = 60;
  }

  @computed get isOpen(): boolean {
    return UIStore.get().stateTree.playlistModal.isOpen;
  }

  @computed get dialogTitle(): string {
    if (this.isEditing) {
      return 'Edit Playlist';
    } else {
      return 'Add Playlist';
    }
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.isOpen}
        TransitionProps={{ onEnter: this.handleDialogOpen }}
        onClose={this.handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{this.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a Scene, drag one from the list of Scenes on the left.
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
          <TextField
            autoFocus
            margin="dense"
            id="defaultDuration"
            label="Default Duration"
            type="text"
            value={this.defaultDurationValue}
            onChange={this.handleDefaultDurationValueChange}
            fullWidth
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

export default observer(PlaylistDetailModal as any);
