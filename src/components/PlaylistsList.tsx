import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PlaylistModel from '../models/PlaylistModel';

interface PlaylistsListProps {
  onItemClick: (event: React.MouseEvent, playlist: PlaylistModel) => void;
  activePlaylist?: PlaylistModel | null;
  items: PlaylistModel[];
}

class PlaylistsList extends React.Component<PlaylistsListProps> {
  readonly props!: PlaylistsListProps;

  constructor(props: PlaylistsListProps) {
    super(props);
  }

  render(): React.ReactNode {
    const activePlaylist = this.props.activePlaylist;

    // I copied this from the internet, could fix it later
    // eslint-disable-next-line no-nested-ternary
    const sortedItems = this.props.items.slice().sort((p1, p2) => {
      return p1.id < p2.id ? -1 : p1.id > p2.id ? 1 : 0;
    });

    return (
      <Card className="mt-3 mb-3">
        <Card.Header>Playlists</Card.Header>
        <ListGroup as="ul">
          {
            sortedItems.map((playlist, idx) => (
              <ListGroup.Item
                action
                as="li"
                key={ idx }
                onClick={ (event: React.MouseEvent) => this.props.onItemClick(event, playlist) }
                active={ Boolean(activePlaylist && activePlaylist.id === playlist.id) }>
                { playlist.displayName }
              </ListGroup.Item>
            ))
          }
        </ListGroup>
      </Card>
    );
  }
}

export default observer(PlaylistsList as any);
