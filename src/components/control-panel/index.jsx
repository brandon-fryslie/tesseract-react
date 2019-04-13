import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/es/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';

const ControlPanel = () => (
  <Container>
    <Row>
      <Col>
        <Container>
          <Row>
            <Col>
              Current Playlist: RadPlaylist
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={ { width: '18rem' } }>
                <Card.Header>Playlists</Card.Header>
                <ListGroup as="ul">
                  <ListGroup.Item as="li" active>pl1</ListGroup.Item>
                  <ListGroup.Item as="li">pl2</ListGroup.Item>
                  <ListGroup.Item as="li">pl3</ListGroup.Item>
                  <ListGroup.Item as="li">pl4</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <ButtonGroup>
              <Button variant="primary">Shuffle Clips</Button>
              <Button variant="primary">Repeat Playlist</Button>
              <Button variant="primary">Blend Clips</Button>
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

ControlPanel.propTypes = {};

export default ControlPanel;
