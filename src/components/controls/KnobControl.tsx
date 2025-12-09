import React from 'react';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import FuturisticKnob from './FuturisticKnob';
import ControlModel from '../../models/ControlModel';

interface KnobControlProps {
  control: ControlModel;
}

class KnobControl extends React.Component<KnobControlProps> {
  readonly props!: KnobControlProps;

  constructor(props: KnobControlProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(newValue: number): void {
    this.props.control.currentValue = newValue;
  }

  render(): React.ReactNode {
    return (
      <Card>
        <Card.Header>{this.props.control.displayName}</Card.Header>
        <Card.Body>
          <FuturisticKnob
            onChange={this.handleChange}
            min={this.props.control.minValue}
            max={this.props.control.maxValue}
            value={Number(this.props.control.currentValue)}
            label={this.props.control.displayName}
          />
        </Card.Body>
      </Card>
    );
  }

  componentWillUnmount(): void {
    // there's some situation (race condition) where we try to update this component
    // after it is already removed from the dom.  ideally we should cleanup references here
    // debugger
  }
}

export default observer(KnobControl as any);
