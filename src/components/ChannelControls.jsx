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
      return this.renderKnob(control, idx);
    }

    throw `renderClipControl: Not implemented for type ${ control.type }`;
  }

  render() {
    const clipControls = this.props.clip.controls;

    return (
      <Card>
        <Card.Header>{ this.props.title }</Card.Header>
        <Card.Body>
          <ClipSelector clipStore={this.props.clipStore} />
          { clipControls.map((control, idx) => {
            return this.renderClipControl(control, idx);
          }) }
        </Card.Body>
      </Card>
    );
  }
}

ChannelControls.propTypes = {
  clip: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  clipStore: PropTypes.object.isRequired,
};

export default ChannelControls;
