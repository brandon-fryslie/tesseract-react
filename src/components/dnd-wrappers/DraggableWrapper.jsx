import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';

const DraggableWrapper = (props) => {
  if (props.table) {
    return (
      <Draggable draggableId={ props.draggableId } index={ props.index }>
        {
          provided => (
            <tr className={ props.className }
                ref={ provided.innerRef }
                { ...provided.draggableProps }
                { ...provided.dragHandleProps }>
              { props.children }
            </tr>
          )
        }
      </Draggable>
    );
  }

  return (
    <Draggable draggableId={ props.draggableId } index={ props.index }>
      {
        provided => (
          <div className={ props.className }
               ref={ provided.innerRef }
               { ...provided.draggableProps }
               { ...provided.dragHandleProps }>
            { props.children }
          </div>
        )
      }
    </Draggable>
  );
};

DraggableWrapper.propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  draggableId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  table: PropTypes.bool,
};

export default DraggableWrapper;
