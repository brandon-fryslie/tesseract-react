import React from 'react';
import PropTypes from 'prop-types';

class Websocket extends React.Component {

  constructor(props) {
    super(props);
    // debugger
    this.state = {
      ws: new WebSocket(this.props.url, this.props.protocol),
      attempts: 1,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.setupWebsocket = this.setupWebsocket.bind(this);
  }

  logging(logline) {
    if (this.props.debug === true) {
      console.log(logline);
    }
  }

  generateInterval(k) {
    if (this.props.reconnectInterval > 0) {
      return this.props.reconnectInterval;
    }
    return 1000;
  }

  setupWebsocket() {
    const websocket = this.state.ws;

    websocket.onopen = () => {
      this.logging('Websocket connected');
      if (typeof this.props.onOpen === 'function') this.props.onOpen();
    };

    websocket.onerror = (evt) => {
      console.log("!!! Websocket: onError triggered", evt);
      this.props.onError(evt.data);
    };

    websocket.onmessage = (evt) => {
      this.props.onMessage(evt.data);
    };

    this.shouldReconnect = this.props.reconnect;
    websocket.onclose = () => {
      this.logging('Websocket disconnected');
      if (typeof this.props.onClose === 'function') this.props.onClose();
      if (this.shouldReconnect) {
        const time = this.generateInterval(this.state.attempts);
        this.timeoutID = setTimeout(() => {
          this.setState(prevState => ({ attempts: prevState.attempts + 1 }));
          this.setState({ ws: new WebSocket(this.props.url, this.props.protocol) });
          this.setupWebsocket();
        }, time);
      }
    };
  }

  componentDidMount() {
    this.setupWebsocket();
  }

  componentWillUnmount() {
    this.shouldReconnect = false;
    clearTimeout(this.timeoutID);
    this.state.ws.close();
  }


  componentDidUpdate() {
    // debugger;

    // close existing websocket
    clearTimeout(this.timeoutID);
    this.state.ws.close();

    // setup new one
    this.setupWebsocket();
  }


  sendMessage(message) {
    const websocket = this.state.ws;
    websocket.send(message);
  }

  render() {
    return <div />;
  }
}

Websocket.defaultProps = {
  debug: false,
  reconnect: true,
};

Websocket.propTypes = {
  url: PropTypes.string.isRequired,
  onMessage: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onError: PropTypes.func,
  debug: PropTypes.bool,
  reconnect: PropTypes.bool,
  protocol: PropTypes.string,
  reconnectInterval: PropTypes.number,
};

export default Websocket;
