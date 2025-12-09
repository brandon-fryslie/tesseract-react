import React from 'react';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import Slider from '@mui/material/Slider';
import ControlModel from '../../models/ControlModel';

interface SliderControlProps {
  control: ControlModel;
}

class SliderControl extends React.Component<SliderControlProps> {
  readonly props!: SliderControlProps;

  constructor(props: SliderControlProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: Event, value: number | number[]): void {
    // MUI Slider can return number or number[] depending on configuration
    // For single slider (our case), it's always a number
    const numValue = Array.isArray(value) ? value[0] : value;
    this.props.control.currentValue = numValue;
  }

  render(): React.ReactNode {
    const roundedNumber = Math.round(Number(this.props.control.currentValue) * 1000) / 1000;

    return (
      <Card>
        <Card.Header>{this.props.control.displayName}</Card.Header>
        <Card.Body>
          <div>
            <span>{roundedNumber}</span>
          </div>
          <Slider
            min={this.props.control.minValue}
            max={this.props.control.maxValue}
            onChange={this.handleChange}
            value={Number(this.props.control.currentValue)}
          />
        </Card.Body>
      </Card>
    );
  }
}

export default observer(SliderControl as any);
