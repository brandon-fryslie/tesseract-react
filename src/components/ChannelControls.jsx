import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Knob } from 'react-rotary-knob';
import KnobControl from './controls/KnobControl';
import CardGroup from 'react-bootstrap/CardGroup';
import ClipsList from './ClipsList';
import ClipStore from '../stores/ClipStore';

@observer
class ChannelControls extends React.Component {
  // constructor(...args) {
  //   super(...args);
  // }

  renderKnob(control, idx) {
    return (
      <KnobControl control={ control } key={ idx } />
    );
  }

  renderClipControl(control, idx) {
    if (control.type === 'knob') {
      return this.renderKnob(control, idx);
    }

    throw `renderClipControl: Not implemented for type ${ control.type }`;
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

    const controls = this.props.controls != null ? this.props.controls : this.props.scene.clipControls;
    if (!controls) debugger;

    return (
      <CardGroup>
        <Card>
          <Card.Header>{ title }</Card.Header>
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
  onItemClick: PropTypes.func.isRequired,
  showClipSelector: PropTypes.bool.isRequired,
};

export default ChannelControls;
