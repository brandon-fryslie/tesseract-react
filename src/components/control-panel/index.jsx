import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/es/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import PlaylistsList from '../playlists-list';

@observer
class ControlPanel extends React.Component {
  constructor(...args) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handleShuffleButtonClick = this.handleShuffleButtonClick.bind(this);
    this.handleRepeatButtonClick = this.handleRepeatButtonClick.bind(this);
  }

  // Trigger this function when we click a playlist in the PlaylistsList
  // This will set the current playlist
  // Called with the dom element and the playlist model
  handlePlaylistClick(dom, playlist) {
    this.props.controlPanelStore.setCurrentPlaylist(playlist);
  }

  // Triggered when we click the play button
  handlePlayButtonClick() {
    this.props.controlPanelStore.toggleIsPlaying();
  }

  // Triggered when we click the shuffle button
  handleShuffleButtonClick() {
    this.props.controlPanelStore.toggleShuffleClips();
  }

  // Triggered when we click the repeat button
  handleRepeatButtonClick() {
    this.props.controlPanelStore.toggleRepeatPlayList();
  }

  render() {
    const controlPanelStore = this.props.controlPanelStore;
    let currentPlaylistName;

    if (controlPanelStore.currentPlaylist == null) {
      currentPlaylistName = '<none>';
    } else {
      currentPlaylistName = controlPanelStore.currentPlaylist.displayName;
    }

    return (
      <Container>
        <Row>
          <Col>
            <Container>
              <Row>
                <Col>
                  Current Playlist: { currentPlaylistName }
                </Col>
              </Row>
              <Row>
                <Col>
                  <PlaylistsList
                    onItemClick={ this.handlePlaylistClick }
                    controlPanelStore={ this.props.controlPanelStore }
                    playlistStore={ this.props.playlistStore } />
                </Col>
              </Row>
              <Row>
                <ButtonGroup>
                  <ControlPanelButton active={ controlPanelStore.isPlaying } onClick={ this.handlePlayButtonClick }>Play</ControlPanelButton>
                  <ControlPanelButton active={ controlPanelStore.shuffleEnabled } onClick={ this.handleShuffleButtonClick }>Shuffle Clips</ControlPanelButton>
                  <ControlPanelButton active={ controlPanelStore.repeatEnabled } onClick={ this.handleRepeatButtonClick }>Repeat Playlist</ControlPanelButton>
                </ButtonGroup>
              </Row>
            </Container>
          </Col>
          <Col>
            <Container>
              <div>More Controls</div>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

ControlPanel.propTypes = {
  playlistStore: PropTypes.object.isRequired,
  controlPanelStore: PropTypes.object.isRequired,
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
