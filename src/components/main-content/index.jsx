import React from 'react';
import PropTypes from 'prop-types';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import ControlPanel from '../control-panel';
import ClipsPanel from '../clips-panel';
import PlayListsPanel from '../playlists-panel';

const MainContent = () => (
  <Tab.Container id="left-tabs-example" defaultActiveKey="first">
    <Row>
      <Col sm={3}>
        <Nav variant="pills" className="flex-column">
          <Nav.Item><Nav.Link eventKey="first">Tab 1</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="second">Tab 2</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="second">Tab 2</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="second">Tab 2</Nav.Link></Nav.Item>
        </Nav>
      </Col>
      <Col sm={9}>
        <Tab.Content>
          <Tab.Pane eventKey="first">
            <ControlPanel />
          </Tab.Pane>
          <Tab.Pane eventKey="second">
            <ClipsPanel />
          </Tab.Pane>
          <Tab.Pane eventKey="third">
            <PlayListsPanel />
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>
);

MainContent.propTypes = {
  title: PropTypes.string,
};

export default MainContent;
