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
import { action, computed, reaction } from 'mobx';
import PlaylistStore from '../../stores/PlaylistStore';
import SceneStore from '../../stores/SceneStore';
import UIStore from '../../stores/UIStore';
import PlaylistDetailModal from '../modals/PlaylistDetailModal';
import Button from 'react-bootstrap/Button';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

@observer
class PlayListsPanel extends React.Component {
  constructor(...args) {
    super(...args);

    // Reacts when items in the playlist store change
    // Only set this value once (after we've loaded initial data)
    const setActivePlaylistOnLoadDisposer = reaction(
      () => { return PlaylistStore.get().getItems().map(i => i); },
      (playlists) => {
        this.activePlaylist = playlists[0];
        setActivePlaylistOnLoadDisposer();
      },
    );

    // Bind event handlers to the correct value of 'this'
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  @computed get activePlaylist() {
    return UIStore.get().stateTree.playlistsPanel.activePlaylist;
  }

  @action _setActivePlaylist(value) {
    UIStore.get().stateTree.playlistsPanel.activePlaylist = value;
  }

  // We can't set this as an 'action' because mobx doesn't allow setting an action to a js setter for some reason
  set activePlaylist(value) {
    this._setActivePlaylist(value);
  }

  // Trigger this function when we click a playlist in the PlaylistsList
  // This will set the current playlist
  // Called with the dom element and the playlist model
  handlePlaylistClick(dom, playlist) {
    this.activePlaylist = playlist;
  }

  // Handle a drag from the Scene list to the Playlist
  handleSceneDragToPlaylist(source, destination) {
    const sourceList = Util.getListForDroppable(source.droppableId);

    // Now we need to add a new instance of the dragged Scene to the activePlaylist
    this.activePlaylist.addScene(sourceList[source.index], destination.index);
  }

  // Handle a drag to reorder playlist elements
  handlePlaylistGridReorder(source, destination) {
    const items = Util.reorder(
      this.activePlaylist.items,
      source.index,
      destination.index,
    );

    this.activePlaylist.items.replace(items);
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

  handleEditClick() {
    UIStore.get().stateTree.playlistModal.activePlaylist = this.activePlaylist;
    UIStore.get().stateTree.playlistModal.isOpen = true;
  }

  handleDeleteClick() {
      // handle delete
  }

  render() {
    const activePlaylist = this.activePlaylist;

    let playlistEditor;
    if (activePlaylist) {
      playlistEditor = <PlaylistEditor activePlaylist={ activePlaylist } />;
    } else {
      playlistEditor = <span>No Current Playlist</span>;
    }

    const displayName = this.activePlaylist != null ? this.activePlaylist.displayName : '<none>';

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
              <PlaylistDetailModal />
              <PlaylistsList
                items={ PlaylistStore.get().getItems() }
                activePlaylist={ this.activePlaylist }
                onItemClick={ this.handlePlaylistClick } />
              <ScenesList scenes={ SceneStore.get().getItems() } />
            </Col>
            <Col>
              <Row>
                <div className="d-flex flex-row">
                  <div className="m-2">Current playlist: { displayName }</div>
                  <Button className="m-2" variant="primary" onClick={ this.handleEditClick }><EditIcon /></Button>
                  <Button className="m-2" variant="primary" onClick={ this.handleDeleteClick }><DeleteIcon /></Button>
                </div>
              </Row>
              <Row>
                { playlistEditor }
              </Row>
            </Col>
          </Row>
        </Container>
      </DragDropContext>
    );
  }
}

PlayListsPanel.propTypes = {};

export default PlayListsPanel;
