import React from 'react';
import { observer } from 'mobx-react';
import Button from 'react-bootstrap/Button';
import UIStore from '../stores/UIStore';

@observer
class NewPlaylistButton extends React.Component {
  constructor(...args) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    UIStore.get().stateTree.playlistsPanel.newPlaylistModalIsOpen = true;
  }

  render() {
    return (
      <Button variant="primary" onClick={ this.handleClick } block>+ New Playlist</Button>
    );
  }
}

NewPlaylistButton.propTypes = {
  // onClick: PropTypes.func.isRequired,
};

export default NewPlaylistButton;
