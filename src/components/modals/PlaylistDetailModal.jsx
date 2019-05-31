import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable, reaction } from 'mobx';
import PlaylistStore from '../../stores/PlaylistStore';
import UIStore from '../../stores/UIStore';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

@observer
class PlaylistDetailModal extends React.Component {

  // value of the input textfield
  @observable nameValue = '';

  @observable defaultDurationValue = 60;

  constructor(...args) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handleNameFieldChange = this.handleNameFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDefaultDurationValueChange = this.handleDefaultDurationValueChange.bind(this);
  }

  handleDialogClose() {
    this.closeDialog();
  }

  handleNameFieldChange(event) {
    this.nameValue = event.target.value;
  }

  handleDefaultDurationValueChange(event) {
    let val = parseInt(event.target.value, 10);
    if (Number.isNaN(val)) {
      val = 60;
      console.log(`[PlaylistDetailModal] Error: ${event.target.value} is not a valid integer.  Defaulting to 60`);
    }

    this.defaultDurationValue = val;
  }

  @computed get activePlaylist() {
    return UIStore.get().stateTree.playlistModal.activePlaylist;
  }

  @computed get isEditing() {
    return UIStore.get().stateTree.playlistModal.activePlaylist != null;
  }

  handleDialogOpen() {
    if (this.isEditing) {
      this.nameValue = this.activePlaylist.displayName;
      this.defaultDurationValue = this.activePlaylist.defaultDuration;
    }
  }

  handleSubmit(event) {
    if (this.isEditing) {
      this.activePlaylist.displayName = this.nameValue;
      this.activePlaylist.defaultDuration = this.defaultDurationValue;
      this.closeDialog();
      return;
    }

    PlaylistStore.get().addNewPlaylist(this.nameValue, this.defaultDurationValue, []);
    this.nameValue = '';
    this.closeDialog();
  }

  @action closeDialog() {
    UIStore.get().stateTree.playlistModal.isOpen = false;
    UIStore.get().stateTree.playlistModal.activePlaylist = null;
    this.nameValue = '';
    this.defaultDurationValue = '';
  }

  @computed get isOpen() {
    return UIStore.get().stateTree.playlistModal.isOpen;
  }

  @computed get dialogTitle() {
    if (this.isEditing) {
      return 'Edit Playlist';
    } else {
      return 'Add Playlist';
    }
  }

  render() {

    return (
      <Dialog open={ this.isOpen } onEnter={ this.handleDialogOpen } onClose={ this.handleDialogClose } aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{ this.dialogTitle }</DialogTitle>
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
            value={ this.nameValue }
            onChange={ this.handleNameFieldChange }
            fullWidth />
          <TextField
            autoFocus
            margin="dense"
            id="defaultDuration"
            label="Default Duration"
            type="text"
            value={ this.defaultDurationValue }
            onChange={ this.handleDefaultDurationValueChange }
            fullWidth />
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

PlaylistDetailModal.propTypes = {};

export default PlaylistDetailModal;
