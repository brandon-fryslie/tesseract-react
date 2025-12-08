// React Testing Library setup
import '@testing-library/jest-dom';

// Mock fetch for testing
global.fetch = require('jest-fetch-mock');

// Mock ENV_CONFIG which is normally injected by webpack
window.ENV_CONFIG = {
  WEBSOCKET_HOST: 'localhost',
  WEBSOCKET_PORT: '8080',
  defaultServerAddr: 'ws://localhost:8080'
};

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 1;
  }
  send() {}
  close() {}
}
global.WebSocket = MockWebSocket;
