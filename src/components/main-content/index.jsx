/* eslint-disable no-return-assign */
import React from 'react';
import PropTypes from 'prop-types';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { observer } from 'mobx-react';
import ControlPanel from '../main-panels/ControlPanel';
import ClipsPanel from '../main-panels/ClipsPanel';
import PlayListsPanel from '../main-panels/PlaylistsPanel';
import ScenesPanel from '../main-panels/ScenesPanel';
import SettingsPanel from '../main-panels/SettingsPanel';
import AboutPanel from '../main-panels/AboutPanel';
import PageHeader from '../page-header';
import PlaylistStore from '../../stores/PlaylistStore';
import ClipStore from '../../stores/ClipStore';
import SceneStore from '../../stores/SceneStore';
import { observable } from 'mobx';
import WebsocketController from '../WebsocketController';
import WebsocketIndicatorModel from '../../models/WebsocketIndicatorModel';

@observer
class MainContent extends React.Component {
  // Clip store is where data about clips is stored
  clipStore = null;

  // Clip store is where data about clips is stored
  playlistStore = null;

  // Reference to websocket;
  @observable websocketRef = null;

  @observable websocketIndicatorModel = null;

  constructor(...args) {
    super(...args);
  }

  componentWillMount() {
    this.clipStore = ClipStore.get();
    this.sceneStore = SceneStore.get();
    this.playlistStore = PlaylistStore.get();

    this.websocketIndicatorModel = new WebsocketIndicatorModel();
  }

  render() {
    return (
      <div className="MainContent ml-4 mr-4 mb-4 pt-4">
        <WebsocketController
          websocketIndicatorModel={ this.websocketIndicatorModel } />
        <PageHeader isConnected={ this.websocketIndicatorModel.isConnected } />
        <Tab.Container defaultActiveKey="live-control">
          <Row>
            <Col sm={ 1 }>
              <Nav variant="pills" className="flex-column tesseract-sidebar">
                <Nav.Item><Nav.Link eventKey="live-control">Live Control</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="playlists">Playlists</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="scenes">Scenes</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="clips">Clips</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="settings">Settings</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="about">About</Nav.Link></Nav.Item>
              </Nav>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="live-control">
                  <ControlPanel
                    playlistStore={ this.playlistStore }
                    websocketRef={ this.websocketRef } />
                </Tab.Pane>
                <Tab.Pane eventKey="playlists">
                  <PlayListsPanel sceneStore={ this.sceneStore }
                                  playlistStore={ this.playlistStore } />
                </Tab.Pane>
                <Tab.Pane eventKey="scenes">
                  <ScenesPanel sceneStore={ this.sceneStore } clipStore={ this.clipStore } />
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
