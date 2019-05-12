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
import SceneStore from '../../stores/SceneStore';
import ChannelControls from '../ChannelControls';

@observer
class ScenesPanel extends React.Component {
  @observable activeScene;

  constructor(...args) {
    super(...args);

    // const props = args[0];
    this.activeScene = SceneStore.get().items[0];

    // Bind event handlers to the correct value of 'this'
    this.handleSceneClick = this.handleSceneClick.bind(this);
    this.handleClipSelect = this.handleClipSelect.bind(this);
    this.handleNewSceneButtonClick = this.handleNewSceneButtonClick.bind(this);
  }

  // Trigger this function when we click a playlist in the PlaylistsList
  // This will set the current playlist
  // Called with the dom element and the playlist model
  handleSceneClick(dom, scene) {
    this.activeScene = scene;
  }

  handleNewSceneButtonClick() {
    console.log('New Scene Button Click');
  }

  // Handles a click on the clip selection list for the scene
  handleClipSelect() {
    // don't do anything here
  }

  render() {
    const activeScene = this.activeScene;

    let channelControls;
    if (activeScene) {
      channelControls = (
        <ChannelControls
          scene={ this.activeScene }
          onItemClick={ this.handleClipSelect } />
      );
    } else {
      channelControls = <span>No active scene</span>;
    }

    return (
      <DragDropContext onDragEnd={ this.handleDragEnd }>
        <Container fluid>
          {/* One row that spans the entire content area */ }
          <Row>
            {/* Two columns. Col one: playlists list, scenes list.  Col two: Current playlist state */ }
            <Col sm={ 2 }>
              <ButtonToolbar>
                <Button
                  block
                  variant="primary"
                  onClick={ this.handleNewSceneButtonClick }>+ New Scene
                </Button>
              </ButtonToolbar>
              <ScenesList activeScene={ this.activeScene }
                          onItemClick={ this.handleSceneClick } />
            </Col>
            <Col>
              { channelControls }
            </Col>
          </Row>
        </Container>
      </DragDropContext>
    );
  }
}

ScenesPanel.propTypes = {
};

export default ScenesPanel;
