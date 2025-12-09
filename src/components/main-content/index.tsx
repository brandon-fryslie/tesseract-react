/* eslint-disable no-return-assign */
import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { observer } from 'mobx-react';
import ControlPanel from '../main-panels/ControlPanel';
import PlaylistsPanel from '../main-panels/PlaylistsPanel';
import SettingsPanel from '../main-panels/SettingsPanel';
import AboutPanel from '../main-panels/AboutPanel';
import PlaylistStore from '../../stores/PlaylistStore';
import ClipStore from '../../stores/ClipStore';
import SceneStore from '../../stores/SceneStore';
import { observable, makeObservable } from 'mobx';
import WebsocketController from '../WebsocketController';
import SidebarButtons from '../SidebarButtons';

// Don't remove this or the styles won't be imported
import style from './MainContent.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

interface MainContentProps {}

class MainContent extends React.Component<MainContentProps> {
  readonly props!: MainContentProps;

  // Clip store is where data about clips is stored
  clipStore: ClipStore | null = null;

  // Scene store is where data about scenes is stored
  sceneStore: SceneStore | null = null;

  // Playlist store is where data about playlists is stored
  playlistStore: PlaylistStore | null = null;

  // Reference to websocket;
  @observable websocketRef: any = null;

  constructor(...args: any[]) {
    super(...args);
    makeObservable(this);
  }

  componentDidMount(): void {
    this.clipStore = ClipStore.get();
    this.sceneStore = SceneStore.get();
    this.playlistStore = PlaylistStore.get();
  }

  render(): React.ReactNode {
    return (
      <div className="MainContent ml-4 mr-4 mb-4 pt-4">
        <WebsocketController />
        <Tab.Container defaultActiveKey="live-control">
          <Row>
            <Col sm={ 1 } className="d-flex align-items-end flex-column">
              <div><h2>draco ui</h2></div>
              <Nav variant="pills" className="flex-column tesseract-sidebar">
                <Nav.Item><Nav.Link eventKey="live-control">Live Control</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="playlists">Playlists</Nav.Link></Nav.Item>
                {/*<Nav.Item><Nav.Link eventKey="scenes">Scenes</Nav.Link></Nav.Item>*/}
                {/*<Nav.Item><Nav.Link eventKey="clips">Clips</Nav.Link></Nav.Item>*/}
                <Nav.Item><Nav.Link eventKey="settings">Settings</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="about">About</Nav.Link></Nav.Item>
              </Nav>
              <div className="mt-auto p-2">
                <SidebarButtons />
              </div>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="live-control"><ControlPanel /></Tab.Pane>
                <Tab.Pane eventKey="playlists"><PlaylistsPanel /></Tab.Pane>
                {/*<Tab.Pane eventKey="scenes"><ScenesPanel /></Tab.Pane> Remove this for now, may not need it */}
                {/*<Tab.Pane eventKey="clips"><ClipsPanel /></Tab.Pane>*/}
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

export default observer(MainContent as any);
