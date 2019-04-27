import React from 'react';
import PropTypes from 'prop-types';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { observer } from 'mobx-react';
import style from './MainContent.scss';
import ControlPanel from '../main-panels/ControlPanel';
import ClipsPanel from '../main-panels/ClipsPanel';
import PlayListsPanel from '../main-panels/PlaylistsPanel';
import SettingsPanel from '../main-panels/SettingsPanel';
import AboutPanel from '../main-panels/AboutPanel';
import PageHeader from '../page-header';
import PlaylistStore from '../../stores/PlaylistStore';
import ControlPanelStore from '../../stores/ControlPanelStore';
import ClipStore from '../../stores/ClipStore';
import PlaylistPanelStore from '../../stores/PlaylistPanelStore';
import MockData from '../../util/MockData';
import SceneStore from '../../stores/SceneStore';

@observer
class MainContent extends React.Component {
  // Clip store is where data about clips is stored
  clipStore = null;

  // Clip store is where data about clips is stored
  playlistStore = null;

  // Store for panel specific state, like which buttons are active, etc
  controlPanelStore = null;

  componentWillMount() {
    this.clipStore = ClipStore.fromJS(MockData.getClipStoreData());

    this.sceneStore = SceneStore.fromJS(MockData.getSceneStoreData(this.clipStore));
    this.playlistStore = PlaylistStore.fromJS(MockData.getPlaylistStoreData(this.sceneStore));

    this.controlPanelStore = new ControlPanelStore();

    this.playlistPanelStore = new PlaylistPanelStore();
    this.playlistPanelStore.currentPlaylist = this.playlistStore.items[0];
  }

  render() {
    return (
      <div className="MainContent">
        <PageHeader />
        <Tab.Container defaultActiveKey="playlists">
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
            <Col sm={ 8 }>
              <Tab.Content>
                <Tab.Pane eventKey="control">
                  <ControlPanel
                    controlPanelStore={ this.controlPanelStore }
                    playlistStore={ this.playlistStore } />
                </Tab.Pane>
                <Tab.Pane eventKey="playlists">
                  <PlayListsPanel
                    playlistPanelStore={ this.playlistPanelStore }
                    playlistStore={ this.playlistStore } />
                </Tab.Pane>
                <Tab.Pane eventKey="clips"><ClipsPanel /></Tab.Pane>
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
