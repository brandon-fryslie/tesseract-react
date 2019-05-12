import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Knob } from 'react-rotary-knob';

@observer
class KnobControl extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleKnobChange = this.handleKnobChange.bind(this);
  }

  handleKnobChange(newValue) {
    this.props.control.currentValue = newValue;
  }

  render() {
    return (
      <Card>
        <Card.Header>{ this.props.control.displayName }</Card.Header>
        <Card.Body>
          <div>
            <span>{ this.props.control.currentValue }</span>
          </div>
          <Knob unlockDistance={ 40 }
                onChange={ this.handleKnobChange }
                min={ 0 }
                max={ 1 }
                value={ this.props.control.currentValue } />
        </Card.Body>
      </Card>
    );
  }
}

KnobControl.propTypes = {
  control: PropTypes.object.isRequired,
};

export default KnobControl;
