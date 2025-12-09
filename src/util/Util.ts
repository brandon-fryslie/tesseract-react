import React from 'react';

const grid = 1;

// Registry for droppable lists, keyed by droppable ID
const droppableListRegistry: Record<string, any[]> = {};

// Type for time object returned by msToTime
export interface TimeObject {
  h: number;
  m: number;
  s: number;
}

// Type for draggable style object (from react-beautiful-dnd)
export interface DraggableStyle {
  [key: string]: any;
}

class Util {
  // a little function to help us with reordering the result
  static reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  static getListStyle(isDraggingOver: boolean): React.CSSProperties {
    return {
      background: isDraggingOver ? 'lightblue' : 'lightgrey',
      padding: grid,
    };
  }

  static getItemStyle(isDragging: boolean, draggableStyle: DraggableStyle): React.CSSProperties {
    return {
      // some basic styles to make the items look a bit nicer
      // userSelect: 'none',
      // padding: grid * 2,
      // margin: `0 0 ${ grid }px 0`,

      // change background colour if dragging
      // background: isDragging ? 'lightgreen' : 'grey',

      // styles we need to apply on draggables
      ...draggableStyle,
    };
  }

  // Need to somehow return the list that generates a particular Droppable ID
  static getListForDroppable(droppableId: string): any[] | undefined {
    return droppableListRegistry[droppableId];
  }

  // Save a reference to a droppable's list
  static registerDroppableList(droppableId: string, list: any[]): void {
    droppableListRegistry[droppableId] = list;
  }

  static msToTime(ms: number): TimeObject {
    const secs = ms * 1000;
    const hours = Math.floor(secs / (60 * 60));

    const divisorForMin = secs % (60 * 60);
    const minutes = Math.floor(divisorForMin / 60);

    const divisorForSec = divisorForMin % 60;
    const seconds = Math.ceil(divisorForSec);

    const obj: TimeObject = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }
}

export default Util;
