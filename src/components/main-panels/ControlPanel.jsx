import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/es/ButtonGroup';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import PlaylistsList from '../PlaylistsList';
import { action, computed } from 'mobx';
import UIStore from '../../stores/UIStore';
import { DragDropContext } from 'react-beautiful-dnd';
import ChannelControls from '../ChannelControls';
import PlaylistStore from '../../stores/PlaylistStore';
import PlaylistItemView from '../PlaylistItemView';
import PlaylistModel from '../../models/PlaylistModel';
import LoopIcon from '@material-ui/icons/Loop';
import PlayIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import EditIcon from '@material-ui/icons/Edit';
import SceneModal from '../modals/SceneModal';

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
    this.handleEditSceneClick = this.handleEditSceneClick.bind(this);
    this.handleResetSceneSettingsClick = this.handleResetSceneSettingsClick.bind(this);
    this.handleSaveSceneSettingsClick = this.handleSaveSceneSettingsClick.bind(this);
    this.handleSaveAsSceneSettingsClick = this.handleSaveAsSceneSettingsClick.bind(this);
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

  @computed get activePlaylistItem() {
    return UIStore.get().stateTree.controlPanel.activePlaylistItem;
  }

  // dunno if computed is the right thing here.
  @computed get activeControls() {
    return UIStore.get().stateTree.controlPanel.activeControls;
  }

  // dunno if computed is the right thing here.
  @computed get activePlaylist() {
    return UIStore.get().stateTree.controlPanel.activePlaylist;
  }

  @computed get isPlaying() {
    return this.currentPlayState === PlaylistModel.playState.PLAYING;
  }

  @computed get isLooping() {
    return this.currentPlayState === PlaylistModel.playState.LOOP_SCENE;
  }

  @computed get isStopped() {
    return this.currentPlayState === PlaylistModel.playState.STOPPED;
  }

  @action handleEditSceneClick() {
    UIStore.get().stateTree.sceneModal.activeScene = this.activePlaylistItem.scene;
    UIStore.get().stateTree.sceneModal.isOpen = true;
  }

  @action handleResetSceneSettingsClick() {
    // TODO: find a better way to do this (gotta rethink a bunch of stuff for that to happen)
    // The active controls should always be a clone of the activePlaylistItem's controls, so we don't have to be too careful syncing the values
    // if we're wrong, video clip will break first :)
    const controls = UIStore.get().stateTree.controlPanel.activeControls;

    controls.forEach((control, idx) => {
      // this contains the original value of the control
      const originalValue = this.activePlaylistItem.scene.clipControls[idx].currentValue;
      // console.log(`[ControlPanel] Resetting ${control.displayName} ${control.fieldName} to ${originalValue}`);
      control.currentValue = originalValue;
    });
  }

  @action handleSaveSceneSettingsClick() {
    // Save current settings to scene
    // this needs to do the opposite of reset: take the activeControls settings and apply them to 'scene'
    console.log('[ControlPanel] Clicked "Save Scene Settings"');

    const scene = this.activePlaylistItem.scene;

    const controls = UIStore.get().stateTree.controlPanel.activeControls;

    const controlValues = controls.map(control => control.currentValue);

    scene.setClipValues(scene.clip, controlValues);
  }

  // Pop up a modal allowing a user to create a new scene
  handleSaveAsSceneSettingsClick() {
    UIStore.get().stateTree.sceneModal.isOpen = true;
  }

  // Renders the container for the currently playing Scene
  renderSceneEditButtons() {
    const buttonClass = 'mb-2 ml-4 mr-4';

    let buttons;
    if (this.activePlaylistItem) {
      buttons = (
        <ButtonToolbar className="d-flex flex-row justify-content-around">
          <div><Button variant="primary" size="lg" className={ buttonClass } onClick={ this.handleEditSceneClick }><EditIcon /></Button></div>
          <div><Button variant="primary" size="lg" className={ buttonClass } onClick={ this.handleResetSceneSettingsClick }>Reset Scene</Button></div>
          <div><Button variant="primary" size="lg" className={ buttonClass } onClick={ this.handleSaveSceneSettingsClick }>Save Scene Settings</Button></div>
          <div><Button variant="primary" size="lg" className={ buttonClass } onClick={ this.handleSaveAsSceneSettingsClick }>Save as new Scene</Button></div>
        </ButtonToolbar>
      );
    } else {
      buttons = null;
    }
    return buttons;
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
    if (this.activePlaylist == null) {
      return null;
    }
    return (
      <PlaylistItemView
        playlist={ this.activePlaylist }
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
                { this.renderSceneEditButtons() }
                { this.renderControlsContainer() }
              </Container>
            </Col>
          </Row>
        </Container>
        <SceneModal />
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
