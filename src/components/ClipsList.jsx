import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import DroppableWrapper from './dnd-wrappers/DroppableWrapper';
import DraggableWrapper from './dnd-wrappers/DraggableWrapper';
import ClipStore from '../stores/ClipStore';

@observer
class ClipsList extends React.Component {
  // constructor(...args) {
  //   super(...args);
  // }

  renderClipListRow(item, idx) {
    // debugger;
    return (
      <DraggableWrapper index={ idx } key={ item.uuid } draggableId={ item.uuid }>
        <ListGroup.Item action
                        as="li"
                        key={ idx }
                        active={ this.props.activeClip && this.props.activeClip.clipId === item.clipId }
                        onClick={ dom => this.props.onItemClick(dom, item) }>
          { item.displayName }
        </ListGroup.Item>
      </DraggableWrapper>
    );
  }

  render() {
    return (
      <Card>
        <Card.Header>Clips</Card.Header>
        <DroppableWrapper
          isDropDisabled
          droppableId="clipsList"
          list={ this.props.items }>
          <ListGroup as="ul">
            {
              this.props.items.map((item, idx) => this.renderClipListRow(item, idx))
            }
          </ListGroup>
        </DroppableWrapper>
      </Card>
    );
  }
}

ClipsList.propTypes = {
  activeClip: PropTypes.object,
  onItemClick: PropTypes.func,
  draggable: PropTypes.bool,
  items: PropTypes.array,
};

ClipsList.defaultProps = {
  draggable: false,
};

export default ClipsList;
