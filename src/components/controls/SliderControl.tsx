import React from 'react';
import { observer } from 'mobx-react';
import Slider from '@mui/material/Slider';
import ControlModel from '../../models/ControlModel';
import './SliderControl.scss';

interface SliderControlProps {
  control: ControlModel;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'cyan' | 'purple' | 'emerald';
  disabled?: boolean;
}

interface SliderControlState {
  isDragging: boolean;
}

class SliderControl extends React.Component<SliderControlProps, SliderControlState> {
  readonly props!: SliderControlProps;

  constructor(props: SliderControlProps) {
    super(props);
    this.state = { isDragging: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCommitted = this.handleChangeCommitted.bind(this);
  }

  handleChange(event: Event, value: number | number[]): void {
    const numValue = Array.isArray(value) ? value[0] : value;
    this.props.control.currentValue = numValue;
    if (!this.state.isDragging) {
      this.setState({ isDragging: true });
    }
  }

  handleChangeCommitted(): void {
    this.setState({ isDragging: false });
  }

  formatValue(value: number): string {
    if (Number.isNaN(value)) return '0';

    if (value % 1 !== 0) {
      const valStr = value.toString();
      const decimalPart = valStr.split('.')[1];

      if (decimalPart && decimalPart.length >= 3) {
        return value.toFixed(3);
      }

      return value.toFixed(2);
    }

    return value.toString();
  }

  render(): React.ReactNode {
    const { control, orientation = 'vertical', variant = 'cyan', disabled = false } = this.props;
    const { isDragging } = this.state;

    const currentValue = Number(control.currentValue);

    const containerClasses = [
      'futuristic-slider-container',
      variant !== 'cyan' && `futuristic-slider-container--${variant}`,
      isDragging && 'futuristic-slider-container--active',
      disabled && 'futuristic-slider-container--disabled',
    ].filter(Boolean).join(' ');

    const wrapperClasses = [
      'futuristic-slider-wrapper',
      `futuristic-slider-wrapper--${orientation}`,
    ].join(' ');

    return (
      <div className={containerClasses}>
        <div className="futuristic-slider-label">
          {control.displayName}
        </div>

        <div className={wrapperClasses}>
          <Slider
            orientation={orientation}
            min={control.minValue}
            max={control.maxValue}
            step={(control.maxValue - control.minValue) / 100}
            onChange={this.handleChange}
            onChangeCommitted={this.handleChangeCommitted}
            value={currentValue}
            disabled={disabled}
            aria-label={control.displayName}
          />
        </div>

        <div className="futuristic-slider-value">
          {this.formatValue(currentValue)}
        </div>
      </div>
    );
  }
}

export default observer(SliderControl as any);
