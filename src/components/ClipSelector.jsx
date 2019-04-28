import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import DroppableWrapper from './dnd-wrappers/DroppableWrapper';
import DraggableWrapper from './dnd-wrappers/DraggableWrapper';
import { Accordion } from 'react-bootstrap';
import ClipsList from './ClipsList';

@observer
class ClipSelector extends React.Component {
  // constructor(...args) {
  //   super(...args);
  // }

  render() {
    const clipStore = this.props.clipStore;

    return (
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Select Clip
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <ClipsList clipStore={this.props.clipStore} />
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

ClipSelector.propTypes = {
  clipStore: PropTypes.object.isRequired,
};

export default ClipSelector;
