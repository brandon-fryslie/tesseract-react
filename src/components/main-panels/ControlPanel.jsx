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
import { Websocket } from 'react-websocket';

@observer
class ControlPanel extends React.Component {
  @observable currentPlaylist = null;
  @observable isPlaying = false;
  @observable shuffleEnabled = false;
  @observable repeatEnabled = false;

  constructor(...args) {
    super(...args);

    const props = args[0];

    this.currentPlaylist = props.playlistStore.items[0];

    // Bind event handlers to the correct value of 'this'
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handleShuffleButtonClick = this.handleShuffleButtonClick.bind(this);
    this.handleRepeatButtonClick = this.handleRepeatButtonClick.bind(this);
  }

  // @action
  toggleIsPlaying() {
    this.isPlaying = !this.isPlaying;

    // For now, this is also going to send messages via websocket
    if (!this.props.websocketRef) {
      throw "Error: no websocket ref";
    }

    const msg = {
      action: 'rotate_left',
      value: 100
    };

    const msgStr = JSON.stringify(msg)

    console.log(`Sending websocket message: ${msgStr}`);

    this.props.websocketRef.sendMessage(msgStr);
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
    this.currentPlaylist = playlist;
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

  render() {
    let currentPlaylistName;

    if (this.currentPlaylist == null) {
      currentPlaylistName = '<none>';
    } else {
      currentPlaylistName = this.currentPlaylist.displayName;
    }

    return (
      <Container fluid>
        <Row>
          <Col sm={ 2 }>
            <Container fluid>
              <Row>
                <Col>
                  Current Playlist: { currentPlaylistName }
                </Col>
              </Row>
              <Row>
                <Col>
                  <PlaylistsList
                    currentPlaylist={ this.currentPlaylist }
                    onItemClick={ this.handlePlaylistClick }
                    playlistStore={ this.props.playlistStore } />
                </Col>
              </Row>
              <Row>
                <ButtonGroup>
                  <ControlPanelButton active={ this.isPlaying } onClick={ this.handlePlayButtonClick }>Play</ControlPanelButton>
                  <ControlPanelButton active={ this.shuffleEnabled } onClick={ this.handleShuffleButtonClick }>Shuffle Clips</ControlPanelButton>
                  <ControlPanelButton active={ this.repeatEnabled } onClick={ this.handleRepeatButtonClick }>Repeat Playlist</ControlPanelButton>
                </ButtonGroup>
              </Row>
            </Container>
          </Col>
          <Col>
            <Container>
              <div className="fill-parent">More Controls</div>
            </Container>
          </Col>
        </Row>
      </Container>
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
