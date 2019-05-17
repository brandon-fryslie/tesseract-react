import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import PlaylistStore from '../stores/PlaylistStore';

@observer
class PlaylistItemView extends React.Component {
  render() {
    const activePlaylist = this.props.activePlaylist;

    return (
      <Card className="mt-3 mb-3">
        <Card.Header>Playlists</Card.Header>
        <ListGroup as="ul">
          {
            this.props.items.map((playlist, idx) => (
              <ListGroup.Item
                action
                as="li"
                key={ idx }
                onClick={ dom => this.props.onItemClick(dom, playlist) }
                active={ activePlaylist && activePlaylist.id === playlist.id }>
                { playlist.displayName }
              </ListGroup.Item>
            ))
          }
        </ListGroup>
      </Card>
    );
  }
}

PlaylistItemView.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  activePlaylist: PropTypes.object,
  items: PropTypes.array.isRequired,
};

export default PlaylistItemView;
