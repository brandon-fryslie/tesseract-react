import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

@observer
class PlaylistsList extends React.Component {
  render() {
    const playlistStore = this.props.playlistStore;
    const controlPanelStore = this.props.controlPanelStore;
    const activePlaylist = controlPanelStore.currentPlaylist;

    return (
      <Card style={ { width: '18rem' } }>
        <Card.Header>Playlists</Card.Header>
        <ListGroup as="ul">
          {
            playlistStore.playlists.map((playlist, idx) => (
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

PlaylistsList.propTypes = {
  playlistStore: PropTypes.object.isRequired,
  controlPanelStore: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default PlaylistsList;
