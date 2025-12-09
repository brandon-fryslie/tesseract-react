// React Testing Library setup
import '@testing-library/jest-dom';

// Mock fetch for testing
(global as any).fetch = require('jest-fetch-mock');

// Mock ENV_CONFIG which is normally injected by webpack
(window as any).ENV_CONFIG = {
  WEBSOCKET_HOST: 'localhost',
  WEBSOCKET_PORT: '8080',
  defaultServerAddr: 'ws://localhost:8080'
};

// Mock WebSocket
class MockWebSocket {
  url: string;
  readyState: number;

  constructor(url: string) {
    this.url = url;
    this.readyState = 1;
  }
  send(): void {}
  close(): void {}
}

(global as any).WebSocket = MockWebSocket;
