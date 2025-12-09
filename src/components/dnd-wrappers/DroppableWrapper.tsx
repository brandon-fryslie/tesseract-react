import * as React from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import Util from '../../util/Util';

interface DroppableWrapperProps {
  children: React.ReactNode;
  className?: string;
  droppableId: string;
  table?: boolean;
  isDropDisabled?: boolean;
  style?: React.CSSProperties;
  // A reference to the list that generates the draggables in this droppable.
  // Needed to move items from one Droppable to another
  list: any[];
}

const DroppableWrapper: React.FC<DroppableWrapperProps> = (props) => {
  const ElType = props.table ? 'tbody' : 'div';

  Util.registerDroppableList(props.droppableId, props.list);

  return (
    <Droppable
      isDropDisabled={props.isDropDisabled}
      droppableId={props.droppableId}
    >
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <ElType
          className={props.className}
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={Util.getListStyle(snapshot.isDraggingOver)}
        >
          {props.children}
          {provided.placeholder}
        </ElType>
      )}
    </Droppable>
  );
};

export default DroppableWrapper;
