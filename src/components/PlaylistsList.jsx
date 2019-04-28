import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

@observer
class PlaylistsList extends React.Component {
  render() {
    const playlistStore = this.props.playlistStore;
    const currentPlaylist = this.props.currentPlaylist;

    return (
      <Card className="mt-3 mb-3">
        <Card.Header>Playlists</Card.Header>
        <ListGroup as="ul">
          {
            playlistStore.items.map((playlist, idx) => (
              <ListGroup.Item
                action
                as="li"
                key={ idx }
                onClick={ dom => this.props.onItemClick(dom, playlist) }
                active={ currentPlaylist && currentPlaylist.id === playlist.id }>
                { playlist.displayName }
              </ListGroup.Item>
            ))
          }
        </ListGroup>
      </Card>
    );
  }
}

PlaylistsList.propTypes = {
  playlistStore: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired,
  currentPlaylist: PropTypes.object.isRequired,
};

export default PlaylistsList;
