import React from 'react';
import { observer } from 'mobx-react';
import PlaylistEditorGrid from './data-grids/PlaylistEditorGrid';
import PlaylistModel from '../models/PlaylistModel';

// This panel contains a view of a playlist that shows
// - each scene w/ duration
//   - tap / click on item to adjust duration
//   - drag target at the bottom to add scenes / clips to the playlist

interface PlaylistEditorProps {
  activePlaylist: PlaylistModel;
}

class PlaylistEditor extends React.Component<PlaylistEditorProps> {
  readonly props!: PlaylistEditorProps;

  render(): React.ReactNode {
    return (
      <PlaylistEditorGrid playlist={ this.props.activePlaylist } />
    );
  }
}

export default observer(PlaylistEditor as any);
