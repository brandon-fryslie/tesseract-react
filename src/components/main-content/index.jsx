import React from 'react';
import PropTypes from 'prop-types';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { observer } from 'mobx-react';
import style from './MainContent.scss';
import ControlPanel from '../control-panel';
import ClipsPanel from '../clips-panel';
import PlayListsPanel from '../playlists-panel';
import SettingsPanel from '../settings-panel';
import AboutPanel from '../about-panel';
import PageHeader from '../page-header';
import PlaylistStore from '../../stores/PlaylistStore';
import ControlPanelStore from '../../stores/ControlPanelStore';
import ClipStore from '../../stores/ClipStore';

@observer
class MainContent extends React.Component {
  // Clip store is where data about clips is stored
  clipStore = null;

  // Clip store is where data about clips is stored
  playlistStore = null;

  // Store for panel specific state, like which buttons are active, etc
  controlPanelStore = null;

  componentWillMount() {
    this.clipStore = ClipStore.fromJS([
      { id: '1', displayName: 'Shimmer 1', clipId: 'shimmer_1', duration: 61 },
      { id: '2', displayName: 'Shimmer 2', clipId: 'shimmer_2', duration: 35 },
      { id: '3', displayName: 'Audio Reactive 1', clipId: 'audio_reactive_1', duration: 127 },
      { id: '4', displayName: 'Blue Waves 1', clipId: 'blue_waves_1', duration: 106 },
      { id: '5', displayName: 'Blue Waves 2', clipId: 'blue_waves_2', duration: 74 },
      { id: '6', displayName: 'Blue Waves 3', clipId: 'blue_waves_3', duration: 87 },
      { id: '7', displayName: 'Ocean Bottom 1', clipId: 'ocean_bottom_1', duration: 90 },
      { id: '8', displayName: 'Grassy Fields', clipId: 'grassy_fields', duration: 89 },
      { id: '9', displayName: 'Shiny Red', clipId: 'shiny_red', duration: 87 },
      { id: '10', displayName: 'Shiny Rainbow', clipId: 'shiny_rainbow', duration: 78 },
      { id: '11', displayName: 'Shiny Rainbow 2', clipId: 'shiny_rainbow_2', duration: 68 },
      { id: '12', displayName: 'Audio Reactive 2', clipId: 'audio_reactive_2', duration: 267 },
    ]);

    this.playlistStore = PlaylistStore.fromJS([
      {
        id: '1',
        displayName: 'Rad Playlist',
        clips: [
          this.clipStore.findClip('shimmer_1'),
          this.clipStore.findClip('shimmer_2'),
          this.clipStore.findClip('audio_reactive_1'),
          this.clipStore.findClip('audio_reactive_2'),
          this.clipStore.findClip('audio_reactive_1'),
          this.clipStore.findClip('audio_reactive_2'),
          this.clipStore.findClip('shiny_rainbow'),
          this.clipStore.findClip('shiny_rainbow_2'),
          this.clipStore.findClip('shiny_rainbow_2'),
        ],
      },
      {
        id: '2',
        displayName: 'Glowy Lights',
        clips: [
          this.clipStore.findClip('blue_waves_1'),
          this.clipStore.findClip('blue_waves_2'),
          this.clipStore.findClip('blue_waves_3'),
          this.clipStore.findClip('ocean_bottom_1'),
        ],
      },
      {
        id: '3',
        displayName: 'Flame Colors',
        clips: [
          this.clipStore.findClip('shiny_red'),
          this.clipStore.findClip('shiny_rainbow'),
          this.clipStore.findClip('shiny_rainbow_2'),
          this.clipStore.findClip('audio_reactive_1'),
          this.clipStore.findClip('audio_reactive_2'),
        ],
      },
      {
        id: '4',
        displayName: 'Audio Reactive',
        clips: [
          this.clipStore.findClip('audio_reactive_1'),
          this.clipStore.findClip('audio_reactive_2'),
        ],
      },
    ]);

    this.controlPanelStore = new ControlPanelStore();
  }

  render() {
    console.log(style);
    return (
      <div className="MainContent">
        <PageHeader />
        <Tab.Container defaultActiveKey="control">
          <Row>
            <Col sm={ 1 }>
              <Nav variant="pills" className="flex-column tesseract-sidebar">
                <Nav.Item><Nav.Link eventKey="control">Control</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="playlists">Playlists</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="clips">Clips</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="settings">Settings</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="about">About</Nav.Link></Nav.Item>
              </Nav>
            </Col>
            <Col sm="auto">
              <Tab.Content>
                <Tab.Pane eventKey="control">
                  <ControlPanel
                    controlPanelStore={ this.controlPanelStore }
                    playlistStore={ this.playlistStore } />
                </Tab.Pane>
                <Tab.Pane eventKey="playlists"><ClipsPanel /></Tab.Pane>
                <Tab.Pane eventKey="clips"><PlayListsPanel /></Tab.Pane>
                <Tab.Pane eventKey="settings"><SettingsPanel /></Tab.Pane>
                <Tab.Pane eventKey="about"><AboutPanel /></Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

MainContent.propTypes = {};

export default MainContent;
