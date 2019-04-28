import React from 'react';
import { observer } from 'mobx-react';
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
import { observable } from 'mobx';

@observer
class PlayListsPanel extends React.Component {
  @observable currentPlaylist;

  constructor(...args) {
    super(...args);

    const props = args[0];
    this.currentPlaylist = props.playlistStore.items[0];

    //
    // Bind event handlers to the correct value of 'this'
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  // Trigger this function when we click a playlist in the PlaylistsList
  // This will set the current playlist
  // Called with the dom element and the playlist model
  handlePlaylistClick(dom, playlist) {
    this.currentPlaylist = playlist;
  }

  // Handle a drag from the Scene list to the Playlist
  handleSceneDragToPlaylist(source, destination) {
    const sourceList = Util.getListForDroppable(source.droppableId);

    // Now we need to add a new instance of the dragged Scene to the currentPlaylist
    this.currentPlaylist.addScene(sourceList[source.index], destination.index);
  }

  // Handle a drag to reorder playlist elements
  handlePlaylistGridReorder(source, destination) {
    const items = Util.reorder(
      this.currentPlaylist.items,
      source.index,
      destination.index,
    );

    this.currentPlaylist.items = items;
  }

  // Handle all dragging.  we've gotta handle all dragging interactions in this one handler
  // result contains data bout the dropped item
  handleDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === 'playlistPanelScenesList' && destination.droppableId === 'playlistEditorGridContainer') {
      this.handleSceneDragToPlaylist(source, destination);
      return;
    }

    if (source.droppableId === 'playlistEditorGridContainer' && destination.droppableId === 'playlistEditorGridContainer') {
      this.handlePlaylistGridReorder(source, destination);
      return;
    }

    console.log(`WARNING: No drag handler set for combo of source ${ source.droppableId } and dest ${ destination.droppableId }`);
  }

  render() {
    const currentPlaylist = this.currentPlaylist;

    return (
      <DragDropContext onDragEnd={ this.handleDragEnd }>
        <Container fluid>
          {/* One row that spans the entire content area */ }
          <Row>
            {/* Two columns. Col one: playlists list, scenes list.  Col two: Current playlist state */ }
            <Col sm={ 2 }>
              <ButtonToolbar>
                <NewPlaylistButton />
              </ButtonToolbar>

              <PlaylistsList currentPlaylist={ this.currentPlaylist }
                             onItemClick={ this.handlePlaylistClick }
                             playlistStore={ this.props.playlistStore } />

              <ScenesList sceneStore={ this.props.sceneStore } />
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
};

export default PlayListsPanel;
