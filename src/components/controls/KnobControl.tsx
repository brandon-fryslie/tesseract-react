import React from 'react';
import { observer } from 'mobx-react';
import FuturisticKnob from './FuturisticKnob';
import ControlModel from '../../models/ControlModel';

interface KnobControlProps {
  control: ControlModel;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'cyan' | 'purple' | 'emerald';
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
    const { control, size = 'md', variant = 'cyan' } = this.props;

    return (
      <FuturisticKnob
        onChange={this.handleChange}
        min={control.minValue}
        max={control.maxValue}
        value={Number(control.currentValue)}
        label={control.displayName}
        size={size}
        variant={variant}
      />
    );
  }

  componentWillUnmount(): void {
    // there's some situation (race condition) where we try to update this component
    // after it is already removed from the dom.  ideally we should cleanup references here
  }
}

export default observer(KnobControl as any);
