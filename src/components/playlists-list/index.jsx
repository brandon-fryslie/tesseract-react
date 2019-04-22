import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/es/ButtonGroup';
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

    if (activePlaylist) {

    }

    return (
      <Card style={ { width: '18rem' } }>
        <Card.Header>Playlists</Card.Header>
        <ListGroup as="ul">
          {
            playlistStore.playlists.map((playlist, idx) =>
              <ListGroup.Item
                action
                as="li"
                key={ idx }
                onClick={ dom => this.props.onItemClick(dom, playlist) }
                active={ this.activePlaylist && this.activePlaylist.id === playlist.id }>
                { playlist.displayName }
              </ListGroup.Item>,
            )
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
