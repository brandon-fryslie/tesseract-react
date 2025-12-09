import * as React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import Util from '../../util/Util';

interface DraggableWrapperProps {
  children: React.ReactNode;
  className?: string;
  draggableId: string;
  index: number;
  table?: boolean;
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = (props) => {
  const ElType = props.table ? 'tr' : 'div';

  return (
    <Draggable draggableId={props.draggableId} index={props.index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <ElType
          className={props.className}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={Util.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
          {props.children}
        </ElType>
      )}
    </Draggable>
  );
};

export default DraggableWrapper;
