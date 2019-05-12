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
        <ChannelControls
          clip={ this.props.scene.clip }
          onItemClick={ this.props.onItemClick } />
      </CardGroup>
    );
  }
}

ChannelControlsContainer.propTypes = {
  scene: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default ChannelControlsContainer;
