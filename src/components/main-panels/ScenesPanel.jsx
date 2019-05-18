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
import SceneStore from '../../stores/SceneStore';
import ChannelControls from '../ChannelControls';
import UIStore from '../../stores/UIStore';

@observer
class ScenesPanel extends React.Component {
  @observable activeScene;

  constructor(...args) {
    super(...args);

    // const props = args[0];

    // we don't have any scenes loaded when this runs initially
    if (SceneStore.get().items.length > 0) {
      this.activeScene = SceneStore.get().items[0];
    }

    // Bind event handlers to the correct value of 'this'
    this.handleSceneClick = this.handleSceneClick.bind(this);
    this.handleClipSelect = this.handleClipSelect.bind(this);
    this.handleNewSceneButtonClick = this.handleNewSceneButtonClick.bind(this);
  }

  setActiveScene(scene) {
    UIStore.get().setValue('scenesPanel', 'activeScene', scene);
  }

  getActiveScene() {
    return UIStore.get().getValue('scenesPanel', 'activeScene');
  }

  // Trigger this function when we click a playlist in the ScenesList
  // This will set the active scene
  // Called with the dom element and the playlist model
  handleSceneClick(dom, scene) {
    this.setActiveScene(scene);
  }

  handleNewSceneButtonClick() {
    console.log('New Scene Button Click');
  }

  // Handles a click on the clip selection list for the scene
  handleClipSelect(dom, clip) {
    const activeScene = this.getActiveScene();

    activeScene.setClip(clip);

  }

  render() {
    // UIStore.get().getValue('scenesPanel', 'activeScene');
    UIStore.get().getValue('scenesPanel', 'activeScene');

    const activeScene = this.getActiveScene();

    let channelControls;
    if (activeScene) {
      channelControls = (
        <ChannelControls
          showClipSelector
          scene={ activeScene }
          onItemClick={ this.handleClipSelect } />
      );
    } else {
      channelControls = <span>No active scene</span>;
    }

    const scenes = SceneStore.get().getItems();

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
              <ScenesList
                scenes={ scenes }
                activeScene={ activeScene }
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

ScenesPanel.propTypes = {};

export default ScenesPanel;
