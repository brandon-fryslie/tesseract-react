import React from 'react';
import { observer } from 'mobx-react';
import Websocket from './websocket/Websocket';
import StateManager from '../util/StateManager';
import UIStore from '../stores/UIStore';

interface WebsocketControllerProps {}

class WebsocketController extends React.Component<WebsocketControllerProps> {
  readonly props!: WebsocketControllerProps;

  // Handles managing state.  instantiated when we get a websocket reference
  stateManager: StateManager | null = null;
  ws: any = null;

  constructor(props: WebsocketControllerProps) {
    super(props);

    // Bind event handlers to the correct value of 'this'
    this.handleWebsocketOpen = this.handleWebsocketOpen.bind(this);
    this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
    this.handleWebsocketClose = this.handleWebsocketClose.bind(this);
    this.handleWebsocketRef = this.handleWebsocketRef.bind(this);
  }

  set isConnected(value: boolean) {
    UIStore.get().stateTree.websocket.isConnected = value;
  }

  handleWebsocketOpen(): void {
    console.log('[WebsocketController] Websocket connection opened');
    this.isConnected = true;

    if (this.stateManager) {
      this.stateManager.loadInitialState();
    }
  }

  handleWebsocketMessage(messageJson: string): void {
    const message = JSON.parse(messageJson);

    if (!message.action || !message.data) {
      throw new Error('Error: JSON object from websocket must have \'action\' and \'data\' fields, and \'action\' must be a string');
    }

    const { action, data } = message;

    if (action === 'logMessage') {
      this.handleLogMessageAction(data);
    } else if (action === 'sendInitialState') {
      if (this.stateManager) {
        this.stateManager.handleSendInitialStateAction(data);
      }
    } else if (action === 'stateUpdate') {
      if (this.stateManager) {
        this.stateManager.handleStateUpdatedAction(data);
      }
    } else {
      throw new Error(`Error: Unimplemented action type: ${ action }`);
    }
  }

  handleWebsocketClose(): void {
    console.log('[WebsocketController] Websocket connection closed');
    this.isConnected = false;
  }

  // Action: string
  // data: object
  sendMessage(action: string, data: any = {}): void {
    console.log(`[WebsocketController] Sending websocket message. action: ${ action }`, data);

    const message = JSON.stringify({ action, data });

    try {
      if (this.ws) {
        this.ws.sendMessage(message);
      }
    } catch (e) {
      console.log('[WebsocketController] Error: Cannot send websocket message');
      console.log(e);
    }
  }

  handleWebsocketRef(ws: any): void {
    this.ws = ws;
    this.stateManager = StateManager.get();
    // Kinda a hack
    this.stateManager.setWebsocketController(this);
  }

  render(): React.ReactNode {
    const serverAddr = UIStore.get().stateTree.settingsPanel.serverAddr;
    const wsUrl = `ws://${ serverAddr }:8883`;

    console.log(`[WebsocketController] Opening websocket connection to: ${ wsUrl }`);

    return (
      <Websocket url={ wsUrl }
                 onOpen={ this.handleWebsocketOpen }
                 onMessage={ this.handleWebsocketMessage }
                 onClose={ this.handleWebsocketClose }
                 ref={ this.handleWebsocketRef }
                 reconnectInterval={ 1000 }
                 debug
                 reconnect />
    );
  }

  handleLogMessageAction(data: any): void {
    console.log(`[WebsocketController] LogMessage: ${ data }`);
  }

}

export default observer(WebsocketController as any);
