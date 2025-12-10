import React, { useRef, useCallback, useState } from 'react';
import { KnobHeadless } from 'react-knob-headless';
import './FuturisticKnob.scss';

interface FuturisticKnobProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  label?: string;
  step?: number;
  dragSensitivity?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'cyan' | 'purple' | 'emerald';
  disabled?: boolean;
}

const FuturisticKnob: React.FC<FuturisticKnobProps> = ({
  value = 0,
  min = 0,
  max = 100,
  onChange,
  label,
  step = 1,
  dragSensitivity = 0.006,
  size = 'md',
  variant = 'cyan',
  disabled = false,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Normalize value to ensure it's within bounds
  const normalizedValue = Math.max(min, Math.min(max, Number.isNaN(value) ? min : value));

  // Calculate the angle for the knob (270 degrees of rotation)
  const valueRatio = max !== min ? (normalizedValue - min) / (max - min) : 0;
  const angle = -135 + valueRatio * 270;

  // SVG dimensions based on size
  const svgSize = size === 'sm' ? 80 : size === 'lg' ? 160 : 120;
  const center = svgSize / 2;
  const outerRadius = svgSize * 0.417; // ~50 for 120px
  const innerRadius = svgSize * 0.333; // ~40 for 120px
  const circumference = 2 * Math.PI * outerRadius;
  const arcLength = circumference * 0.75; // 270 degrees
  const dashOffset = circumference * 0.25; // Start position

  // Handle value changes from the knob
  const handleValueChange = useCallback(
    (newValue: number) => {
      if (onChange && !disabled) {
        const clampedValue = Math.max(min, Math.min(max, newValue));
        onChange(clampedValue);
      }
    },
    [onChange, min, max, disabled]
  );

  // Handle keyboard interactions
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!onChange || disabled) return;

      let handled = false;
      let newValue = normalizedValue;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          newValue = Math.min(max, normalizedValue + step);
          handled = true;
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          newValue = Math.max(min, normalizedValue - step);
          handled = true;
          break;
        case 'Home':
          newValue = min;
          handled = true;
          break;
        case 'End':
          newValue = max;
          handled = true;
          break;
        default:
          break;
      }

      if (handled) {
        e.preventDefault();
        handleValueChange(newValue);
      }
    },
    [normalizedValue, min, max, step, handleValueChange, onChange, disabled]
  );

  // Round function for the knob - don't round, just clamp
  const roundValue = useCallback((val: number): number => {
    return Math.max(min, Math.min(max, val));
  }, [min, max]);

  // Display function for the knob
  const displayValue = useCallback((val: number): string => {
    if (Number.isNaN(val)) return '0';

    if (val % 1 !== 0) {
      const valStr = val.toString();
      const decimalPart = valStr.split('.')[1];

      if (decimalPart && decimalPart.length >= 3) {
        return val.toFixed(3);
      }

      return val.toFixed(2);
    }

    return val.toString();
  }, []);

  // Build class names
  const containerClasses = [
    'futuristic-knob-container',
    size !== 'md' && `futuristic-knob-container--${size}`,
    variant !== 'cyan' && `futuristic-knob-container--${variant}`,
    isDragging && 'futuristic-knob-container--active',
    disabled && 'futuristic-knob-container--disabled',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <div className="futuristic-knob-label">
          {label}
        </div>
      )}

      <div className="futuristic-knob-wrapper">
        <KnobHeadless
          valueRaw={normalizedValue}
          valueMin={min}
          valueMax={max}
          dragSensitivity={dragSensitivity}
          valueRawRoundFn={roundValue}
          valueRawDisplayFn={displayValue}
          onValueRawChange={handleValueChange}
          aria-label={label || 'Knob control'}
          includeIntoTabOrder={!disabled}
          ref={knobRef}
          onKeyDown={handleKeyDown}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onPointerCancel={() => setIsDragging(false)}
        >
          <div className="futuristic-knob-content">
            {/* SVG rings */}
            <svg
              className="futuristic-knob-svg"
              width={svgSize}
              height={svgSize}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              {/* Background circle */}
              <circle
                className="futuristic-knob-bg-circle"
                cx={center}
                cy={center}
                r={outerRadius}
              />

              {/* Track arc (background) */}
              <circle
                className="futuristic-knob-track"
                cx={center}
                cy={center}
                r={outerRadius}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={dashOffset}
                transform={`rotate(-135 ${center} ${center})`}
              />

              {/* Progress arc */}
              <circle
                className="futuristic-knob-progress"
                cx={center}
                cy={center}
                r={outerRadius}
                strokeDasharray={`${arcLength * valueRatio} ${circumference}`}
                strokeDashoffset={dashOffset}
                transform={`rotate(-135 ${center} ${center})`}
              />

              {/* Inner filled circle */}
              <circle
                className="futuristic-knob-inner-circle"
                cx={center}
                cy={center}
                r={innerRadius}
              />
            </svg>

            {/* Rotating indicator */}
            <div
              className="futuristic-knob-indicator"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="futuristic-knob-indicator-line" />
            </div>
          </div>
        </KnobHeadless>
      </div>

      {/* Value display */}
      <div className="futuristic-knob-value">
        {displayValue(normalizedValue)}
      </div>
    </div>
  );
};

export default FuturisticKnob;
