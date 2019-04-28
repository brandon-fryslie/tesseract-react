import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';

const DraggableWrapper = (props) => {
  let ElType;
  if (props.table) {
    ElType = 'tr';
  } else {
    ElType = 'div';
  }

  return (
    <Draggable draggableId={ props.draggableId } index={ props.index }>
      {
        provided => (
          <ElType className={ props.className }
              ref={ provided.innerRef }
              { ...provided.draggableProps }
              { ...provided.dragHandleProps }>
            { props.children }
          </ElType>
        )
      }
    </Draggable>
  );
};

DraggableWrapper.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  draggableId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  table: PropTypes.bool,
};

export default DraggableWrapper;
