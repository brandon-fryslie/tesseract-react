/* eslint-disable no-return-assign */
import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { observer } from 'mobx-react';
import ControlPanel from '../main-panels/ControlPanel';
import PlaylistsPanel from '../main-panels/PlaylistsPanel';
import SettingsPanel from '../main-panels/SettingsPanel';
import AboutPanel from '../main-panels/AboutPanel';
import PlaylistStore from '../../stores/PlaylistStore';
import ClipStore from '../../stores/ClipStore';
import SceneStore from '../../stores/SceneStore';
import UIStore from '../../stores/UIStore';
import { observable, makeObservable, action } from 'mobx';
import WebsocketController from '../WebsocketController';
import SidebarButtons from '../SidebarButtons';

// Don't remove this or the styles won't be imported
import style from './MainContent.scss';
import '../../styles/dark-theme.scss';
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

  // Mobile sidebar visibility state
  @observable sidebarOpen: boolean = false;

  constructor(props: MainContentProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount(): void {
    this.clipStore = ClipStore.get<ClipStore>();
    this.sceneStore = SceneStore.get<SceneStore>();
    this.playlistStore = PlaylistStore.get<PlaylistStore>();
  }

  @action
  toggleSidebar = () => {
    this.sidebarOpen = !this.sidebarOpen;
  };

  render(): React.ReactNode {
    const useNewUI = UIStore.get().getValue('settingsPanel', 'useNewUI');
    const containerClass = useNewUI ? 'MainContent dark-theme px-3 px-lg-4 pb-4 pt-3 pt-lg-4' : 'MainContent ml-4 mr-4 mb-4 pt-4';

    return (
      <div className={containerClass}>
        <WebsocketController />
        <Tab.Container defaultActiveKey="live-control">
          {/* Mobile header with hamburger menu */}
          <div className="d-lg-none mb-3 d-flex justify-content-between align-items-center">
            <h2 className="mb-0">draco ui</h2>
            <Button
              variant="outline-primary"
              onClick={this.toggleSidebar}
              aria-controls="mobile-sidebar"
              aria-expanded={this.sidebarOpen}
              className="d-lg-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>
          </div>

          <Row className="g-3 g-lg-4">
            {/* Sidebar Column - Responsive */}
            <Col
              xs={12}
              lg={2}
              xl={2}
              className="sidebar-column"
            >
              {/* Desktop: Always visible header */}
              <div className="d-none d-lg-block mb-3">
                <h2>draco ui</h2>
              </div>

              {/* Mobile: Collapsible sidebar */}
              <Collapse in={this.sidebarOpen} className="d-lg-none">
                <div id="mobile-sidebar">
                  <Nav variant="pills" className="flex-column tesseract-sidebar mb-3">
                    <Nav.Item>
                      <Nav.Link eventKey="live-control" onClick={this.toggleSidebar}>
                        Live Control
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="playlists" onClick={this.toggleSidebar}>
                        Playlists
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="settings" onClick={this.toggleSidebar}>
                        Settings
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="about" onClick={this.toggleSidebar}>
                        About
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <div className="mb-3">
                    <SidebarButtons />
                  </div>
                </div>
              </Collapse>

              {/* Desktop: Always visible sidebar */}
              <div className="d-none d-lg-flex flex-column h-100">
                <Nav variant="pills" className="flex-column tesseract-sidebar">
                  <Nav.Item>
                    <Nav.Link eventKey="live-control">Live Control</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="playlists">Playlists</Nav.Link>
                  </Nav.Item>
                  {/*<Nav.Item><Nav.Link eventKey="scenes">Scenes</Nav.Link></Nav.Item>*/}
                  {/*<Nav.Item><Nav.Link eventKey="clips">Clips</Nav.Link></Nav.Item>*/}
                  <Nav.Item>
                    <Nav.Link eventKey="settings">Settings</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="about">About</Nav.Link>
                  </Nav.Item>
                </Nav>
                <div className="mt-auto pt-3">
                  <SidebarButtons />
                </div>
              </div>
            </Col>

            {/* Content Column - Responsive */}
            <Col xs={12} lg={10} xl={10}>
              <Tab.Content>
                <Tab.Pane eventKey="live-control">
                  <ControlPanel />
                </Tab.Pane>
                <Tab.Pane eventKey="playlists">
                  <PlaylistsPanel />
                </Tab.Pane>
                {/*<Tab.Pane eventKey="scenes"><ScenesPanel /></Tab.Pane> Remove this for now, may not need it */}
                {/*<Tab.Pane eventKey="clips"><ClipsPanel /></Tab.Pane>*/}
                <Tab.Pane eventKey="settings">
                  <SettingsPanel />
                </Tab.Pane>
                <Tab.Pane eventKey="about">
                  <AboutPanel />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

export default observer(MainContent as any);
