import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PlaylistModel from '../models/PlaylistModel';
import PlaylistItemModel from '../models/PlaylistItemModel';

interface PlaylistItemViewProps {
  playlist: PlaylistModel;
  activePlaylistItem: PlaylistItemModel | null;
  onItemClick: (dom: React.MouseEvent, item: PlaylistItemModel) => void;
}

class PlaylistItemView extends React.Component<PlaylistItemViewProps> {
  readonly props!: PlaylistItemViewProps;

  render(): React.ReactNode {
    return (
      <Card className="mt-3 mb-3">
        <Card.Header>Scenes</Card.Header>
        <ListGroup as="ul">
          {
            this.props.playlist.items.map((item, idx) => (
              <ListGroup.Item
                action
                as="li"
                key={ idx }
                onClick={ (dom: React.MouseEvent) => this.props.onItemClick(dom, item) }
                active={ Boolean(this.props.activePlaylistItem && this.props.activePlaylistItem.id === item.id) }>
                { item.scene.displayName }
              </ListGroup.Item>
            ))
          }
        </ListGroup>
      </Card>
    );
  }
}

export default observer(PlaylistItemView as any);
