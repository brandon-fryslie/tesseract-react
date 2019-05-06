import React from 'react';
import { observer } from 'mobx-react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import NewPlaylistButton from '../NewPlaylistButton';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import PlaylistsList from '../PlaylistsList';
import PropTypes from 'prop-types';
import PlaylistEditor from '../PlaylistEditor';
import Util from '../../util/Util';
import { DragDropContext } from 'react-beautiful-dnd';
import ScenesList from '../ScenesList';
import { observable } from 'mobx';
import Button from 'react-bootstrap/Button';
import ChannelControlsContainer from '../ChannelControlsContainer';

@observer
class ScenesPanel extends React.Component {
  @observable activeScene;

  constructor(...args) {
    super(...args);

    const props = args[0];
    this.activeScene = props.sceneStore.items[0];

    // Bind event handlers to the correct value of 'this'
    this.handleSceneClick = this.handleSceneClick.bind(this);
  }

  // Trigger this function when we click a playlist in the PlaylistsList
  // This will set the current playlist
  // Called with the dom element and the playlist model
  handleSceneClick(dom, scene) {
    this.activeScene = scene;
  }

  handleNewSceneButtonClick() {

  }

  render() {
    const activeScene = this.activeScene;

    let channelControlsContainer;
    if (activeScene) {
      channelControlsContainer = <ChannelControlsContainer scene={ this.activeScene } clipStore={ this.props.clipStore } />;
    } else {
      channelControlsContainer = <span>No active scene</span>;
    }

    return (
      <DragDropContext onDragEnd={ this.handleDragEnd }>
        <Container fluid>
          {/* One row that spans the entire content area */ }
          <Row>
            {/* Two columns. Col one: playlists list, scenes list.  Col two: Current playlist state */ }
            <Col sm={ 2 }>
              <ButtonToolbar>
                <Button variant="primary" block>+ New Scene</Button>
              </ButtonToolbar>
              <ScenesList activeScene={ this.activeScene }
                          onItemClick={ this.handleSceneClick }
                          sceneStore={ this.props.sceneStore } />
            </Col>
            <Col>
              { channelControlsContainer }
            </Col>
          </Row>
        </Container>
      </DragDropContext>
    );
  }
}

ScenesPanel.propTypes = {
  // playlistStore: PropTypes.object.isRequired,
  sceneStore: PropTypes.object.isRequired,
  clipStore: PropTypes.object.isRequired,
};

export default ScenesPanel;
