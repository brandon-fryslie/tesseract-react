import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Knob } from 'react-rotary-knob';
import KnobControl from './controls/KnobControl';
import CardGroup from 'react-bootstrap/CardGroup';
import ClipSelector from './ClipSelector';

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
      this.props.scene.clipValues;
      return this.renderKnob(currentValue, control, idx);
    }

    throw `renderClipControl: Not implemented for type ${ control.type }`;
  }

  render() {
    const title = `Scene: '${ this.props.scene.displayName }' Controls`;
    const clipControls = this.props.scene.clip.controls;

    return (
      <CardGroup>
        <Card>
          <Card.Header>{ title }</Card.Header>
          <Card.Body>
            <CardGroup>
              <ClipSelector onItemClick={ this.props.onItemClick } />
              {
                clipControls.map((control, idx) => {
                  return this.renderClipControl(control, idx);
                })
              }
            </CardGroup>
          </Card.Body>
        </Card>
      </CardGroup>
    );
  }
}

ChannelControls.propTypes = {
  scene: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default ChannelControls;
