import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';

// Displays remaining time in seconds

@observer
class DurationRemaining extends React.Component {
  // the time remaining on the clock in ms
  @observable timeRemaining;

  // A reference to the 'setInterval' result
  @observable timer;

  constructor(...args) {
    super(...args);

    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    this.startTimer(this.props.initialTime);
  }

  componentDidUpdate(prevProps) {
    // console.log("ComponentDidUpdate");
    // this.startTimer(this.props.initialTime);
  }

  // This will break in React 17 :( shouldn't be too hard to rework this though
  // we want to reset the timer any time we receive new props
  componentWillReceiveProps(nextProps, prevState) {
    this.startTimer(nextProps.initialTime);
  }

  startTimer(timeRemaining) {
    // console.log(`[DurationRemaining] Starting timer with timeRemaining set to ${timeRemaining}`);
    // handle infinity case
    if (timeRemaining === -1) {
      this.timeRemaining = timeRemaining;
      clearInterval(this.timer);
      return;
    }

    // set our current time remaining
    this.timeRemaining = timeRemaining;

    // clear any existing timers
    clearInterval(this.timer);

    // update the timer every 100ms by default
    const defaultTimeoutInterval = 100;

    // if we have less than 100ms left until we're out of time, only set the interval for that amount of time
    const timeoutInterval = this.timeRemaining < defaultTimeoutInterval ? this.timeRemaining : defaultTimeoutInterval;

    // save reference to timer so we can cancel later
    this.timer = setInterval(this.countDown, timeoutInterval);
  }

  countDown() {
    // Check if we're at zero.
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      clearInterval(this.timer);
    } else {
      this.timeRemaining -= 100;
    }
  }

  render() {
    let timeRemaining;
    if (this.timeRemaining === -1) {
      timeRemaining = 'Infinity';
    } else {
      // const timeObj = Util.msToTime(); // this fn can render the time in a prettier format
      timeRemaining = `${ (this.timeRemaining / 1000).toFixed(2) }`;
    }



    return (
      <span>Time remaining in current scene: { timeRemaining }</span>
    );
  }
}

DurationRemaining.propTypes = {
  initialTime: PropTypes.number.isRequired, // The time that is initially on the clock
};

export default DurationRemaining;
