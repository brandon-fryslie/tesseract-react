import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import MainContent from './components/main-content';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <MainContent  />;
  }
}

export default hot(App);
