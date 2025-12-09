import React, { useRef, useCallback } from 'react';
import { KnobHeadless } from 'react-knob-headless';

interface FuturisticKnobProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  label?: string;
  step?: number;
  dragSensitivity?: number;
}

const FuturisticKnob: React.FC<FuturisticKnobProps> = ({
  value = 0,
  min = 0,
  max = 100,
  onChange,
  label,
  step = 1,
  dragSensitivity = 0.006,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);

  // Normalize value to ensure it's within bounds
  const normalizedValue = Math.max(min, Math.min(max, Number.isNaN(value) ? min : value));

  // Calculate the angle for the knob (270 degrees of rotation)
  const valueRatio = max !== min ? (normalizedValue - min) / (max - min) : 0;
  const angle = -135 + valueRatio * 270;

  // Handle value changes from the knob
  const handleValueChange = useCallback(
    (newValue: number) => {
      if (onChange) {
        // Clamp the value to min/max
        const clampedValue = Math.max(min, Math.min(max, newValue));
        onChange(clampedValue);
      }
    },
    [onChange, min, max]
  );

  // Handle keyboard interactions
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!onChange) return;

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
        default:
          break;
      }

      if (handled) {
        e.preventDefault();
        handleValueChange(newValue);
      }
    },
    [normalizedValue, min, max, step, handleValueChange, onChange]
  );

  // Round function for the knob - don't round, just clamp
  const roundValue = useCallback((val: number): number => {
    // Don't actually round - just clamp to bounds
    // This preserves decimal precision
    return Math.max(min, Math.min(max, val));
  }, [min, max]);

  // Display function for the knob
  const displayValue = useCallback((val: number): string => {
    if (Number.isNaN(val)) return '0';

    // For decimals, determine appropriate precision
    if (val % 1 !== 0) {
      // Convert to string to check precision
      const valStr = val.toString();
      const decimalPart = valStr.split('.')[1];

      // If we have 3 or more decimal places in the original value, show 3
      // This preserves values like 0.567 as "0.567" instead of rounding to "0.57"
      if (decimalPart && decimalPart.length >= 3) {
        return val.toFixed(3);
      }

      // Otherwise show 2 decimal places
      return val.toFixed(2);
    }

    return val.toString();
  }, []);

  return (
    <div
      className="futuristic-knob-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: "'Courier New', monospace",
      }}
    >
      {label && (
        <div
          className="futuristic-knob-label"
          style={{
            color: '#00ffff',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
          }}
        >
          {label}
        </div>
      )}

      <div
        className="futuristic-knob-wrapper"
        style={{
          position: 'relative',
          width: '120px',
          height: '120px',
        }}
      >
        <KnobHeadless
          valueRaw={normalizedValue}
          valueMin={min}
          valueMax={max}
          dragSensitivity={dragSensitivity}
          valueRawRoundFn={roundValue}
          valueRawDisplayFn={displayValue}
          onValueRawChange={handleValueChange}
          aria-label={label || undefined}
          includeIntoTabOrder
          ref={knobRef}
          onKeyDown={handleKeyDown}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {/* Outer ring */}
            <svg
              width="120"
              height="120"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {/* Background arc */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#0a0a0f"
                strokeWidth="4"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(0, 255, 255, 0.2)"
                strokeWidth="4"
                strokeDasharray="235.6 235.6"
                strokeDashoffset="58.9"
                strokeLinecap="round"
                transform="rotate(-135 60 60)"
              />

              {/* Value arc */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#00ffff"
                strokeWidth="4"
                strokeDasharray={`${235.6 * valueRatio} 235.6`}
                strokeDashoffset="58.9"
                strokeLinecap="round"
                transform="rotate(-135 60 60)"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))',
                  transition: 'stroke-dasharray 0.1s ease-out',
                }}
              />

              {/* Inner circle */}
              <circle
                cx="60"
                cy="60"
                r="40"
                fill="#0a0a0f"
                stroke="rgba(0, 255, 255, 0.3)"
                strokeWidth="2"
              />
            </svg>

            {/* Knob indicator */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '80px',
                height: '80px',
                marginLeft: '-40px',
                marginTop: '-40px',
                transform: `rotate(${angle}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '50%',
                  width: '4px',
                  height: '16px',
                  marginLeft: '-2px',
                  backgroundColor: '#00ffff',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                }}
              />
            </div>
          </div>
        </KnobHeadless>
      </div>

      {/* Value display */}
      <div
        className="futuristic-knob-value"
        style={{
          marginTop: '15px',
          color: '#00ffff',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
          fontFamily: "'Courier New', monospace",
          letterSpacing: '1px',
        }}
      >
        {displayValue(normalizedValue)}
      </div>
    </div>
  );
};

export default FuturisticKnob;
