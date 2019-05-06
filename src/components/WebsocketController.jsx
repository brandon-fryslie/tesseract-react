import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import DroppableWrapper from './dnd-wrappers/DroppableWrapper';
import DraggableWrapper from './dnd-wrappers/DraggableWrapper';
import { Accordion } from 'react-bootstrap';
import ClipsList from './ClipsList';
import Websocket from 'react-websocket';

@observer
class WebsocketController extends React.Component {

  // Have we loaded the initial state?
  shouldRequestInitialState = false;

  constructor(...args) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handleWebsocketOpen = this.handleWebsocketOpen.bind(this);
    this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
    this.handleWebsocketClose = this.handleWebsocketClose.bind(this);
    this.handleWebsocketRef = this.handleWebsocketRef.bind(this);
  }

  handleWebsocketOpen() {
    // debugger;
    console.log('got ws open');
    this.props.websocketIndicatorModel.setConnected(true);

    this.loadInitialState();
  }

  handleWebsocketMessage(messageJson) {
    // Ignore these until I can figure out where the hell they are coming from
    // eslint-disable-next-line no-proto
    if (messageJson.__proto__.toString() === '[object Blob]') {
      return;
    }

    const message = JSON.parse(messageJson);

    if (!message.action || !message.data) {
      throw 'Error: JSON object from websocket must have \'action\' and \'data\' fields, and \'action\' must be a string';
    }

    const { action, data } = message;

    if (action === 'logMessage') {
      this.handleLogMessageAction(data);
    } else if (action === 'sendInitialState') {
      this.handleSendInitialStateAction(data);
    } else {
      throw `Error: Unimplemented action type: ${ action }`;
    }
  }

  handleWebsocketClose() {
    console.log('got ws close');
    this.props.websocketIndicatorModel.setConnected(false);

    // this.shouldRequestInitialState = true;
  }

  // Action: string
  // data: object
  sendMessage(action, data = {}) {
    const message = JSON.stringify({ action, data });

    try {
      this.ws.sendMessage(message);
    } catch (e) {
      console.log('Error: Cannot send websocket message');
      console.log(e);
    }
  }

  handleWebsocketRef(ws) {
    this.ws = ws;
  }

  loadInitialState() {
    console.log('Requesting Initital State');
    this.sendMessage('requestInitialState');
  }

  render() {
    const clipStore = this.props.clipStore;

    return (
      <Websocket url="ws://localhost:8883"
                 onOpen={ this.handleWebsocketOpen }
                 onMessage={ this.handleWebsocketMessage }
                 onClose={ this.handleWebsocketClose }
                 ref={ this.handleWebsocketRef }
                 debug
                 reconnect />
    );
  }

  handleLogMessageAction(data) {
    console.log(`WEBSOCKET LOGMESSAGE: ${data}`);
  }

  handleSendInitialStateAction(data) {
    console.log("!!! received initial state!!!");
    console.log(data);

    this.props.sceneStore.refreshFromJS(data.sceneData);
    this.props.playlistStore.refreshFromJS(data.playlistData);
  }
}

WebsocketController.propTypes = {
  clipStore: PropTypes.object.isRequired,
  sceneStore: PropTypes.object.isRequired,
  playlistStore: PropTypes.object.isRequired,
  websocketIndicatorModel: PropTypes.object.isRequired,
};

export default WebsocketController;
