import React from 'react';
import { observer } from 'mobx-react';

interface WebsocketProps {
  url: string;
  onMessage: (data: string) => void;
  onOpen: () => void;
  onClose: () => void;
  onError?: (data: any) => void;
  debug?: boolean;
  reconnect?: boolean;
  protocol?: string;
  reconnectInterval?: number;
}

class Websocket extends React.Component<WebsocketProps> {
  readonly props!: WebsocketProps;

  static defaultProps = {
    debug: false,
    reconnect: true,
  };

  websocket: WebSocket | null = null;
  attempts = 1;
  shouldReconnect = false;
  timeoutID: NodeJS.Timeout | null = null;

  constructor(props: WebsocketProps) {
    super(props);
    this.websocket = this.createWebsocket();
    this.sendMessage = this.sendMessage.bind(this);
    this.setupWebsocket = this.setupWebsocket.bind(this);
  }

  logging(logline: string): void {
    if (this.props.debug === true) {
      console.log(logline);
    }
  }

  generateInterval(k: number): number {
    if (this.props.reconnectInterval && this.props.reconnectInterval > 0) {
      return this.props.reconnectInterval;
    }
    return 1000;
  }

  createWebsocket(): WebSocket {
    return new WebSocket(this.props.url, this.props.protocol);
  }

  setupWebsocket(): void {
    this.websocket = this.createWebsocket();
    const websocket = this.websocket;

    websocket.onopen = () => {
      // this.logging('[Websocket] Websocket connected');
      if (typeof this.props.onOpen === 'function') this.props.onOpen();
    };

    websocket.onerror = (evt: Event) => {
      console.log("!!! Websocket: onError triggered", evt);
      if (this.props.onError) {
        this.props.onError((evt as any).data);
      }
    };

    websocket.onmessage = (evt: MessageEvent) => {
      this.props.onMessage(evt.data);
    };

    this.shouldReconnect = this.props.reconnect || false;
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

  componentDidMount(): void {
    this.setupWebsocket();
  }

  componentWillUnmount(): void {
    this.shouldReconnect = false;
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    if (this.websocket) {
      this.websocket.close();
    }
  }


  componentDidUpdate(prevProps: WebsocketProps): void {
    // in the future we can check more props, for now we just need to try reconnecting if the URL changed
    if (prevProps.url === this.props.url) {
      return;
    }

    // close existing websocket
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    // setup new one
    this.setupWebsocket();
  }


  sendMessage(message: string): void {
    if (this.websocket) {
      this.websocket.send(message);
    }
  }

  render(): React.ReactNode {
    return <div />;
  }
}

export default observer(Websocket as any);
