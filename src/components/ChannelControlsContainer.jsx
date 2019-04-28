import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import ChannelControls from './ChannelControls';
import CardDeck from 'react-bootstrap/CardDeck';
import CardGroup from 'react-bootstrap/CardGroup';

@observer
class ChannelControlsContainer extends React.Component {
  render() {
    return (
      <CardGroup>
        <ChannelControls title="Channel 1" clip={ this.props.scene.channel1Clip } clipStore={this.props.clipStore} />
        <ChannelControls title="Channel 2" clip={ this.props.scene.channel2Clip } clipStore={this.props.clipStore} />
      </CardGroup>
    );
  }
}

ChannelControlsContainer.propTypes = {
  scene: PropTypes.object.isRequired,
  clipStore: PropTypes.object.isRequired,
};

export default ChannelControlsContainer;
