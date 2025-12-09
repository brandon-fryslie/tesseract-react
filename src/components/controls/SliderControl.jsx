import React from 'react';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';

@observer
class SliderControl extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.props.control.currentValue = value;
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
          <Slider
            min={ this.props.control.minValue }
            max={ this.props.control.maxValue }
            onChange={ this.handleChange }
            value={ this.props.control.currentValue } />
        </Card.Body>
      </Card>
    );
  }
}

SliderControl.propTypes = {
  control: PropTypes.object.isRequired,
};

export default SliderControl;
