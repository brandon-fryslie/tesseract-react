import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/es/ButtonGroup';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import PlaylistsList from '../PlaylistsList';
import { action, observable } from 'mobx';
import UIStore from '../../stores/UIStore';
import { DragDropContext } from 'react-beautiful-dnd';
import ChannelControls from '../ChannelControls';
import PlaylistStore from '../../stores/PlaylistStore';
import PlaylistItemView from '../PlaylistItemView';
import PlaylistModel from '../../models/PlaylistModel';
import LoopIcon from '@material-ui/icons/Loop';
import PlayIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

@observer
class ControlPanel extends React.Component {
  constructor(...args) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
    this.handlePlaylistItemClick = this.handlePlaylistItemClick.bind(this);
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handleLoopSceneButtonClick = this.handleLoopSceneButtonClick.bind(this);
    this.handleStopButtonClick = this.handleStopButtonClick.bind(this);
  }

  get currentPlayState() {
    return UIStore.get().getValue('controlPanel', 'playState');
  }

  set currentPlayState(value) {
    UIStore.get().updateControlPanelState({
      playState: value,
    });

    // UIStore.get().setValue('controlPanel', 'playState', value);
  }

  // Trigger this function when we click a playlist in the PlaylistsList
  // This will set the current playlist
  // Called with the dom element and the playlist model
  @action handlePlaylistClick(dom, playlist) {
    // we need to set the activePlaylistItem as well
    // todo: this will probably break if we have an empty playlist
    const activePlaylistItem = playlist.items[0];

    UIStore.get().updateControlPanelState({
      activePlaylist: playlist,
      activePlaylistItem: activePlaylistItem,
    });
  }

  // Trigger this function when we click a playlist in the PlaylistsList
  // This will set the current playlist
  // Called with the dom element and the playlist model
  @action handlePlaylistItemClick(dom, playlistItem) {
    // TODO: here we need to tell the backend to switch to this scene?
    // not sure what I need to do here yet

    UIStore.get().updateControlPanelState({
      activePlaylistItem: playlistItem,
    });
  }

  // Triggered when we click the play button
  @action handlePlayButtonClick() {
    this.currentPlayState = PlaylistModel.playState.PLAYING;
  }

  // Triggered when we click the 'loop scene' button
  @action handleLoopSceneButtonClick() {
    this.currentPlayState = PlaylistModel.playState.LOOP_SCENE;
  }

  // Triggered when we click the stop button
  @action handleStopButtonClick() {
    this.currentPlayState = PlaylistModel.playState.STOPPED;
  }

  get activePlaylistItem() {
    return UIStore.get().stateTree.controlPanel.activePlaylistItem;
  }

  // set activePlaylistItem(value) {
  //   UIStore.get().stateTree.controlPanel.activePlaylistItem = value;
  // }

  // dunno if computed is the right thing here.
  get activeControls() {
    return UIStore.get().stateTree.controlPanel.activeControls;
  }

  // dunno if computed is the right thing here.
  getActivePlaylist() {
    return UIStore.get().stateTree.controlPanel.activePlaylist;
  }

  get isPlaying() {
    return this.currentPlayState === PlaylistModel.playState.PLAYING;
  }

  get isLooping() {
    return this.currentPlayState === PlaylistModel.playState.LOOP_SCENE;
  }

  get isStopped() {
    return this.currentPlayState === PlaylistModel.playState.STOPPED;
  }

  // Renders the container for the currently playing Scene
  renderControlsContainer() {
    let channelControls;
    if (this.activePlaylistItem) {
      channelControls = (
        <ChannelControls
          showClipSelector={ false }
          scene={ this.activePlaylistItem.scene }
          controls={ this.activeControls } />
      );
    } else {
      channelControls = <span>No active scene</span>;
    }
    return channelControls;
  }

  renderPlaylistControlButtons() {
    return (
      <ButtonGroup className="d-flex" size="lg">
        <ControlPanelButton
          active={ this.isPlaying }
          onClick={ this.handlePlayButtonClick }>
          <PlayIcon />
        </ControlPanelButton>
        <ControlPanelButton
          active={ this.isLooping }
          onClick={ this.handleLoopSceneButtonClick }>
          <LoopIcon />
        </ControlPanelButton>
        <ControlPanelButton
          active={ this.isStopped }
          onClick={ this.handleStopButtonClick }>
          <StopIcon />
        </ControlPanelButton>
      </ButtonGroup>
    );
  }

  renderPlaylistItemList() {
    const activePlaylist = this.getActivePlaylist();

    if (activePlaylist == null) {
      return null;
    }
    return (
      <PlaylistItemView
        playlist={ activePlaylist }
        activePlaylistItem={ this.activePlaylistItem }
        onItemClick={ this.handlePlaylistItemClick } />
    );
  }

  render() {
    // 'Using' these values here will cause the mobx library to rerender this component when they change
    // This is not the exact right way to do this, but it works
    const activeControls = UIStore.get().stateTree.controlPanel.activeControls;
    const activePlaylist = UIStore.get().stateTree.controlPanel.activePlaylist;
    const activePlaylistItem = UIStore.get().stateTree.controlPanel.activePlaylistItem;
    let activePlaylistName, sceneItems;

    if (activePlaylist == null) {
      activePlaylistName = '<none>';
    } else {
      activePlaylistName = activePlaylist.displayName;
    }

    const playlistItems = PlaylistStore.get().getItems();

    return (
      <DragDropContext>
        <Container fluid>
          <Row>
            <Col sm={ 2 }>
              <Container fluid>
                <Row>
                  <Col>
                    <div>Current Playlist: { activePlaylistName }</div>
                    <div className="mt-3 mb-3">({ this.currentPlayState })</div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    { this.renderPlaylistControlButtons() }
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <PlaylistsList
                      items={ playlistItems }
                      activePlaylist={ activePlaylist }
                      onItemClick={ this.handlePlaylistClick } />
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col sm={ 2 }>
              { this.renderPlaylistItemList() }
            </Col>
            <Col>
              <Container fluid>
                { this.renderControlsContainer() }
              </Container>
            </Col>
          </Row>
        </Container>
      </DragDropContext>
    );
  }
}

ControlPanel.propTypes = {};

export default ControlPanel;

// Control Panel Buttons

const ControlPanelButton = (props) => {
  const variant = props.active ? 'primary' : 'outline-primary';
  return <Button variant={ variant } onClick={ props.onClick }>{ props.children }</Button>;
};

ControlPanelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  children: PropTypes.any,
};
