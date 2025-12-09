import React from 'react';
import { observer } from 'mobx-react';
import Button from 'react-bootstrap/Button';
import UIStore from '../stores/UIStore';

interface NewPlaylistButtonProps {}

class NewPlaylistButton extends React.Component<NewPlaylistButtonProps> {
  readonly props!: NewPlaylistButtonProps;

  constructor(...args: any[]) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(): void {
    UIStore.get().stateTree.playlistModal.isOpen = true;
    UIStore.get().stateTree.playlistModal.activePlaylist = null;
  }

  render(): React.ReactNode {
    return (
      <div className="d-grid">
        <Button variant="primary" onClick={ this.handleClick }>+ New Playlist</Button>
      </div>
    );
  }
}

export default observer(NewPlaylistButton as any);
