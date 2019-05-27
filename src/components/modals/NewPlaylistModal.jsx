import React from 'react';
import { observer } from 'mobx-react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import NewPlaylistButton from '../NewPlaylistButton';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import PlaylistsList from '../PlaylistsList';
import PropTypes from 'prop-types';
import PlaylistEditor from '../PlaylistEditor';
import Util from '../../util/Util';
import { DragDropContext } from 'react-beautiful-dnd';
import ScenesList from '../ScenesList';
import { action, computed, observable, reaction } from 'mobx';
import PlaylistStore from '../../stores/PlaylistStore';
import SceneStore from '../../stores/SceneStore';
import UIStore from '../../stores/UIStore';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

@observer
class NewPlaylistModal extends React.Component {

  // value of the input textfield
  @observable nameValue = '';

  constructor(...args) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handleNameFieldChange = this.handleNameFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleDialogClose() {
    this.closeDialog();
  }

  handleNameFieldChange(event) {
    this.nameValue = event.target.value;
  }

  handleSubmit(event) {
    PlaylistStore.get().addNewPlaylist(this.nameValue, []);
    this.nameValue = '';
    this.closeDialog();
  }

  @action closeDialog() {
    UIStore.get().stateTree.playlistsPanel.newPlaylistModalIsOpen = false;
  }

  render() {
    const isOpen = UIStore.get().stateTree.playlistsPanel.newPlaylistModalIsOpen;

    return (
      <Dialog open={ isOpen } onClose={ this.handleDialogClose } aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Playlists are empty when first created. Drag a Scene from the list of Scenes on the left.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={ this.nameValue }
            onChange={ this.handleNameFieldChange }
            fullWidth
          />
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

NewPlaylistModal.propTypes = {};

export default NewPlaylistModal;
