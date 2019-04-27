import React from 'react';
import { observer } from 'mobx-react';
import Button from 'react-bootstrap/Button';

@observer
class NewPlaylistButton extends React.Component {
  render() {
    // const playlistStore = this.props.playlistStore;
    // const controlPanelStore = this.props.controlPanelStore;
    // const activePlaylist = controlPanelStore.currentPlaylist;

    return (
      <Button variant="primary" block>+ New Playlist</Button>
    );
  }
}

NewPlaylistButton.propTypes = {};

export default NewPlaylistButton;
