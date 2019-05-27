import React from 'react';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Knob } from 'react-rotary-knob';

@observer
class KnobControl extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(newValue) {
    this.props.control.currentValue = newValue;
  }

  render() {
    const roundedNumber = Math.round(this.props.control.currentValue * 1000) / 1000;

    return (
      <Card>
        <Card.Header>{ this.props.control.displayName }</Card.Header>
        <Card.Body>
          <div>
            <span>{ roundedNumber }</span>
          </div>
          <Knob unlockDistance={ 40 }
                onChange={ this.handleChange }
                min={ this.props.control.minValue }
                max={ this.props.control.maxValue }
                value={ this.props.control.currentValue } />
        </Card.Body>
      </Card>
    );
  }

  componentWillUnmount() {
    // there's some situation (race condition) where we try to update this component
    // after it is already removed from the dom.  ideally we should cleanup references here
    // debugger
  }
}

KnobControl.propTypes = {
  control: PropTypes.object.isRequired,
};

export default KnobControl;
