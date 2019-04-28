import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import Util from '../../util/Util';

const DroppableWrapper = (props) => {
  let ElType;
  if (props.table) {
    ElType = 'tbody';
  } else {
    ElType = 'div';
  }

  Util.registerDroppableList(props.droppableId, props.list);

  return (
    <Droppable isDropDisabled={ props.isDropDisabled }
               droppableId={ props.droppableId }
               style={ props.style }>
      {
        (provided, snapshot) => (
          <ElType className={ props.className }
                  ref={ provided.innerRef }
                  { ...provided.droppableProps }
                  style={ Util.getListStyle(snapshot.isDraggingOver) }>
            { props.children }
            { provided.placeholder }
          </ElType>
        )
      }
    </Droppable>
  );
};

DroppableWrapper.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  droppableId: PropTypes.string.isRequired,
  table: PropTypes.bool,
  isDropDisabled: PropTypes.bool,
  style: PropTypes.object,

  // A reference to the list that generates the draggables in this droppable.  Needed to move items from one Droppable to another
  list: PropTypes.array.isRequired,
};

export default DroppableWrapper;
