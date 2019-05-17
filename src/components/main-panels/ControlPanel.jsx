import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/es/ButtonGroup';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import PlaylistsList from '../PlaylistsList';
import { action, computed, observable } from 'mobx';
import UIStore from '../../stores/UIStore';
import { DragDropContext } from 'react-beautiful-dnd';
import ChannelControls from '../ChannelControls';

@observer
class ControlPanel extends React.Component {
  @observable activePlaylist = null;
  @observable isPlaying = false;
  @observable shuffleEnabled = false;
  @observable repeatEnabled = false;

  // The currently active scene
  // @observable activeScene;

  @observable uiStore;

  constructor(...args) {
    super(...args);

    const props = args[0];

    // this.uiStore = UIStore.get();

    // this isn't set here
    // UIStore.get().stateTree.controlPanel.activePlaylist = props.playlistStore.items[0];

    // Bind event handlers to the correct value of 'this'
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handleShuffleButtonClick = this.handleShuffleButtonClick.bind(this);
    this.handleRepeatButtonClick = this.handleRepeatButtonClick.bind(this);
    this.handleClipSelect = this.handleClipSelect.bind(this);
  }

  @action
  toggleIsPlaying() {
    this.isPlaying = !this.isPlaying;
  }

  @action
  toggleShuffleClips() {
    this.shuffleEnabled = !this.shuffleEnabled;
  }

  @action
  toggleRepeatPlaylist() {
    this.repeatEnabled = !this.repeatEnabled;
  }

  // Trigger this function when we click a playlist in the PlaylistsList
  // This will set the current playlist
  // Called with the dom element and the playlist model
  handlePlaylistClick(dom, playlist) {
    UIStore().stateTree.controlPanel.activePlaylist = playlist;
  }

  // Triggered when we click the play button
  handlePlayButtonClick() {
    this.toggleIsPlaying();
  }

  // Triggered when we click the shuffle button
  handleShuffleButtonClick() {
    this.toggleShuffleClips();
  }

  // Triggered when we click the repeat button
  handleRepeatButtonClick() {
    this.toggleRepeatPlaylist();
  }

  // dunno if computed is the right thing here.
  @computed get activeScene() {
    return UIStore.get().stateTree.controlPanel.activeScene;
  }

  // dunno if computed is the right thing here.
  @computed get activeControls() {
    return UIStore.get().stateTree.controlPanel.activeControls;
  }

  // dunno if computed is the right thing here.
  @computed get activePlaylist() {
    return UIStore.get().stateTree.controlPanel.activePlaylist;
  }

  handleClipSelect() {

  }

  // Renders the container for the currently playing Scene
  renderControlsContainer() {
    let channelControls;
    if (this.activeScene) {
      channelControls = (
        <ChannelControls
          showClipSelector={false}
          scene={ this.activeScene }
          controls={ this.activeControls }
          onItemClick={ this.handleClipSelect } />
      );
    } else {
      channelControls = <span>No active scene</span>;
    }
    return channelControls;
  }

  render() {
    // 'Using' these values here will cause the mobx library to rerender this component when they change
    // This is not the exact right way to do this, but it works
    const activeScene = UIStore.get().stateTree.controlPanel.activeScene;
    const activeControls = UIStore.get().stateTree.controlPanel.activeControls;
    const activePlaylist = UIStore.get().stateTree.controlPanel.activePlaylist;
    let activePlaylistName;

    if (activePlaylist == null) {
      activePlaylistName = '<none>';
    } else {
      activePlaylistName = activePlaylist.displayName;
    }

    return (
      <DragDropContext>
        <Container fluid>
          <Row>
            <Col sm={ 2 }>
              <Container fluid>
                <Row>
                  <Col>
                    Current Playlist: { activePlaylistName }
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <PlaylistsList
                      activePlaylist={ activePlaylist }
                      onItemClick={ this.handlePlaylistClick } />
                  </Col>
                </Row>
                <Row>
                  <ButtonGroup>
                    <ControlPanelButton
                      active={ this.isPlaying }
                      onClick={ this.handlePlayButtonClick }>
                      Play
                    </ControlPanelButton>
                    <ControlPanelButton
                      active={ this.shuffleEnabled }
                      onClick={ this.handleShuffleButtonClick }>
                      Shuffle Clips
                    </ControlPanelButton>
                    <ControlPanelButton
                      active={ this.repeatEnabled }
                      onClick={ this.handleRepeatButtonClick }>
                      Repeat Playlist
                    </ControlPanelButton>
                  </ButtonGroup>
                </Row>
              </Container>
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

ControlPanel.propTypes = {
  playlistStore: PropTypes.object.isRequired,
  websocketRef: PropTypes.object,
};

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
