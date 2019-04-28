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

  return (
    <Droppable isDropDisabled={ props.isDropDisabled } droppableId={ props.droppableId }>
      {
        (provided, snapshot) => (
          <ElType className={ props.className }
                  ref={ provided.innerRef }
                  style={ Util.getListStyle(snapshot.isDraggingOver) }
                  { ...provided.droppableProps }>
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
};

export default DroppableWrapper;
