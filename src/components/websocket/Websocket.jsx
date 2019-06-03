import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

@observer
class Websocket extends React.Component {

  websocket;
  attempts = 1;

  constructor(props) {
    super(props);
    this.websocket = this.createWebsocket();
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

  createWebsocket() {
    return new WebSocket(this.props.url, this.props.protocol);
  }

  setupWebsocket() {
    this.websocket = this.createWebsocket();
    const websocket = this.websocket;

    websocket.onopen = () => {
      // this.logging('[Websocket] Websocket connected');
      if (typeof this.props.onOpen === 'function') this.props.onOpen();
    };

    websocket.onerror = (evt) => {
      console.log("!!! Websocket: onError triggered", evt);
      if (this.props.onError) {
        this.props.onError(evt.data);
      }
    };

    websocket.onmessage = (evt) => {
      this.props.onMessage(evt.data);
    };

    this.shouldReconnect = this.props.reconnect;
    websocket.onclose = () => {
      this.logging('Websocket disconnected');
      if (typeof this.props.onClose === 'function') this.props.onClose();
      if (this.shouldReconnect) {
        const time = this.generateInterval(this.attempts);
        this.timeoutID = setTimeout(() => {
          this.attempts++;
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


  componentDidUpdate(prevProps) {
    // in the future we can check more props, for now we just need to try reconnecting if the URL changed
    if (prevProps.url === this.props.url) {
      return;
    }

    // close existing websocket
    clearTimeout(this.timeoutID);
    this.websocket.close();
    this.websocket = null;

    // setup new one
    this.setupWebsocket();
  }


  sendMessage(message) {
    this.websocket.send(message);
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
