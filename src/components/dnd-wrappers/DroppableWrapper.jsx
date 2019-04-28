import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import Util from '../../util/Util';

const DroppableWrapper = (props) => {
  if (props.table) {
    return (
      <Droppable droppableId={ props.droppableId }>
        {
          (provided, snapshot) => (
            <tbody className={ props.className }
                   ref={ provided.innerRef }
                   style={ Util.getListStyle(snapshot.isDraggingOver) }
                   {...provided.droppableProps}>
            { props.children }
            { provided.placeholder }
            </tbody>
          )
        }
      </Droppable>
    );
  }

  return (
    <Droppable droppableId={ props.droppableId }>
      {
        (provided, snapshot) => (
          <div className={ props.className }
               ref={ provided.innerRef }
               style={ Util.getListStyle(snapshot.isDraggingOver) }
               {...provided.droppableProps}>
            { props.children }
            { provided.placeholder }
          </div>
        )
      }
    </Droppable>
  );
};

DroppableWrapper.propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  droppableId: PropTypes.string.isRequired,
  table: PropTypes.bool,
};

export default DroppableWrapper;
