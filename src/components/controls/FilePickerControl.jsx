import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Knob } from 'react-rotary-knob';
import Slider from '@material-ui/lab/Slider';
import Button from 'react-bootstrap/Button';

@observer
class SliderControl extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    // this.props.control.currentValue = value;
  }

  render() {
    return (
      <Card>
        <Card.Header>{ this.props.control.displayName }</Card.Header>
        <Card.Body>
          <Button variant="primary">Choose Video</Button>
        </Card.Body>
      </Card>
    );
  }
}

SliderControl.propTypes = {
  control: PropTypes.object.isRequired,
};

export default SliderControl;
