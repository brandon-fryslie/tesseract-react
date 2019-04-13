import React from 'react';
import PropTypes from 'prop-types';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import ControlPanel from '../control-panel';
import ClipsPanel from '../clips-panel';
import PlayListsPanel from '../playlists-panel';
import SettingsPanel from '../settings-panel';
import AboutPanel from '../about-panel';
import PageHeader from '../page-header';

const MainContent = () => (
  <div>
    <PageHeader />
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={ 3 }>
          <Nav variant="pills" className="flex-column">
            <Nav.Item><Nav.Link eventKey="control">Control</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="playlists">Playlists</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="clips">Clips</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="settings">Settings</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="about">About</Nav.Link></Nav.Item>
          </Nav>
        </Col>
        <Col sm={ 9 }>
          <Tab.Content>
            <Tab.Pane eventKey="control"><ControlPanel/></Tab.Pane>
            <Tab.Pane eventKey="playlists"><ClipsPanel/></Tab.Pane>
            <Tab.Pane eventKey="clips"><PlayListsPanel/></Tab.Pane>
            <Tab.Pane eventKey="settings"><SettingsPanel/></Tab.Pane>
            <Tab.Pane eventKey="about"><AboutPanel/></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </div>
);

MainContent.propTypes = {
  title: PropTypes.string,
};

export default MainContent;
