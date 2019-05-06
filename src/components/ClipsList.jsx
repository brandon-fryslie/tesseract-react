import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import DroppableWrapper from './dnd-wrappers/DroppableWrapper';
import DraggableWrapper from './dnd-wrappers/DraggableWrapper';

@observer
class ClipsList extends React.Component {
  // constructor(...args) {
  //   super(...args);
  // }

  render() {
    const clipStore = this.props.clipStore;

    return (
      <Card className="mt-3 mb-3">
        <Card.Header>Clips</Card.Header>
        <Card.Body>
          <DroppableWrapper isDropDisabled
                            droppableId="clipsList"
                            list={ clipStore.items }>
            <ListGroup as="ul">
              {
                clipStore.items.map((item, idx) => (
                    <ClipListRow key={ item.id }
                                  idx={ idx }
                                  item={ item }
                                  onItemClick={ this.props.onItemClick }
                                  active={ this.props.activeScene && this.props.activeScene.id === item.id } />
                  ),
                )
              }
            </ListGroup>
          </DroppableWrapper>
        </Card.Body>
      </Card>
    );
  }
}

ClipsList.propTypes = {
  clipStore: PropTypes.object.isRequired,
  activeScene: PropTypes.object,
  onItemClick: PropTypes.func,
};

export default ClipsList;

const ClipListRow = props => (
  <DraggableWrapper index={ props.idx } key={ props.item.id } draggableId={ props.item.uuid }>
    <ListGroup.Item action
                    as="li"
                    key={ props.idx }
                    active={ props.active }
                    onClick={ dom => props.onItemClick(dom, props.item) }>
      { props.item.displayName }
    </ListGroup.Item>
  </DraggableWrapper>
);

ClipListRow.propTypes = {
  idx: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  active: PropTypes.bool,
  onItemClick: PropTypes.func,
};

