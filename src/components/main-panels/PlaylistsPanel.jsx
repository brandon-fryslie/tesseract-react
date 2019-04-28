import React from 'react';
import { observer } from 'mobx-react/index';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import NewPlaylistButton from '../NewPlaylistButton';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import PlaylistsList from '../PlaylistsList';
import PropTypes from 'prop-types';
import PlaylistEditor from '../PlaylistEditor';
import Util from '../../util/Util';
import { DragDropContext } from 'react-beautiful-dnd';
import ScenesList from '../ScenesList';

@observer
class PlayListsPanel extends React.Component {
  constructor(...args) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  // Trigger this function when we click a playlist in the PlaylistsList
  // This will set the current playlist
  // Called with the dom element and the playlist model
  handlePlaylistClick(dom, playlist) {
    this.props.playlistPanelStore.setCurrentPlaylist(playlist);
  }

  // Handle all dragging.  we've gotta handle all dragging interactions in this one handler
  // result contains data bout the dropped item
  handleDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = Util.reorder(
        this.props.playlistPanelStore.currentPlaylist.items,
        source.index,
        destination.index,
      );

      this.props.playlistPanelStore.currentPlaylist.items = items;
    } else {
      console.log('Dropped on the wrong target');
    }
  }

  render() {
    // const playlistStore = this.props.playlistStore;
    // const controlPanelStore = this.props.controlPanelStore;
    const currentPlaylist = this.props.playlistPanelStore.currentPlaylist;

    return (
      <DragDropContext onDragEnd={ this.handleDragEnd }>
        <Container fluid>
          {/* One row that spans the entire content area */ }
          <Row>
            {/* Two columns. Col one: playlists list, scenes list.  Col two: Current playlist state */ }
            <Col sm={ 3 }>
              <ButtonToolbar>
                <NewPlaylistButton />
              </ButtonToolbar>

              <PlaylistsList
                onItemClick={ this.handlePlaylistClick }
                controlPanelStore={ this.props.playlistPanelStore }
                playlistStore={ this.props.playlistStore } />

              <ScenesList
                sceneStore={ this.props.sceneStore } />
            </Col>
            <Col>
              <PlaylistEditor currentPlaylist={ currentPlaylist } />
            </Col>
          </Row>
        </Container>
      </DragDropContext>
    );
  }
}

PlayListsPanel.propTypes = {
  playlistStore: PropTypes.object.isRequired,
  sceneStore: PropTypes.object.isRequired,
  playlistPanelStore: PropTypes.object.isRequired,
};

export default PlayListsPanel;
