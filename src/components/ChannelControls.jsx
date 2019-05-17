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
    const title = `Scene: '${ this.props.scene.displayName }' Controls`;

    let clipSelector = null;
    if (this.props.showClipSelector) {
      clipSelector = <ClipSelector onItemClick={ this.props.onItemClick } />;
    }

    return (
      <CardGroup>
        <Card>
          <Card.Header>{ title }</Card.Header>
            <CardGroup>
              { clipSelector }
              {
                this.props.controls.map((control, idx) => {
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
  scene: PropTypes.object.isRequired,
  controls: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired,
  showClipSelector: PropTypes.bool.isRequired,
};

export default ChannelControls;
