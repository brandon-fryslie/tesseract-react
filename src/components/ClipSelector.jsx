import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import DroppableWrapper from './dnd-wrappers/DroppableWrapper';
import DraggableWrapper from './dnd-wrappers/DraggableWrapper';
import { Accordion } from 'react-bootstrap';
import ClipsList from './ClipsList';
import ClipStore from '../stores/ClipStore';

@observer
class ClipSelector extends React.Component {
  // constructor(...args) {
  //   super(...args);
  // }

  render() {
    return (
      <ClipsList onItemClick={ this.props.onItemClick } />
    );
  }
}

ClipSelector.propTypes = {
  onItemClick: PropTypes.func.isRequired,
};

export default ClipSelector;
