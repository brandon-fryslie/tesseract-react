import React from 'react';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import KnobControl from './controls/KnobControl';
import FilePickerControl from './controls/FilePickerControl';
import CardGroup from 'react-bootstrap/CardGroup';
import ClipsList from './ClipsList';
import ClipStore from '../stores/ClipStore';
import SliderControl from './controls/SliderControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UIStore from '../stores/UIStore';
import DurationRemaining from './DurationRemaining';

@observer
class ChannelControls extends React.Component {
  // constructor(...args) {
  //   super(...args);
  // }


  renderClipControl(control, idx) {
    if (control.type === 'knob') {
      return <KnobControl control={ control } key={ idx } />;
    } else if (control.type === 'slider') {
      return <SliderControl control={ control } key={ idx } />;
    } else if (control.type === 'videoFile') {
      return <FilePickerControl control={ control } key={ idx } />;
    }

    throw `renderClipControl: Not implemented for type ${ control.type }`;
  }

  renderCurrentSceneDurationRemaining(remainingDuration) {
    return <DurationRemaining initialTime={remainingDuration} />;
  }

  render() {
    const title = `Scene: '${ this.props.scene.displayName }' Controls`;

    let clipSelector = null;
    if (this.props.showClipSelector) {
      clipSelector = (
        <ClipsList
          items={ ClipStore.get().getItems() }
          activeClip={ this.props.scene.clip }
          onItemClick={ this.props.onItemClick } />
      );
    }

    // If we pass in controls, use those.  If we don't, use the Scene's controls
    const controls = this.props.controls != null ? this.props.controls : this.props.scene.clipControls;
    if (!controls) debugger;

    return (
      <CardGroup>
        <Card>
          <Card.Header>
            <Container>
              <Row>
                <Col>
                  { title }
                </Col>
                <Col>
                  { this.renderCurrentSceneDurationRemaining(UIStore.get().stateTree.controlPanel.currentSceneDurationRemaining) }
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <CardGroup>
            { clipSelector }
            {
              controls.map((control, idx) => {
                return this.renderClipControl(control, idx);
              })
            }
          </CardGroup>
        </Card>
      </CardGroup>
    );
  }
}

ChannelControls.propTypes = {
  // The reason we pass in both Scene and Controls is because in 'live' mode (on the ControlPanel)
  // the controls we are modifying won't be directly tied to the Scene
  // If we omit controls, it will update the Scene's controls
  scene: PropTypes.object.isRequired,
  controls: PropTypes.array,
  onItemClick: PropTypes.func,
  showClipSelector: PropTypes.bool,
};

export default ChannelControls;
