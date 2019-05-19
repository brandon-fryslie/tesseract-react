const grid = 1;

const droppableListRegistry = {};

class Util {
  // a little function to help us with reordering the result
  static reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  static getListStyle(isDraggingOver) {
    return {
      background: isDraggingOver ? 'lightblue' : 'lightgrey',
      padding: grid,
    };
  }

  static getItemStyle(isDragging, draggableStyle) {
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
  static getListForDroppable(droppableId) {
    return droppableListRegistry[droppableId];
  }

  // Save a reference to a droppable's list
  static registerDroppableList(droppableId, list) {
    droppableListRegistry[droppableId] = list;
  }

  static msToTime(ms) {
    const secs = ms * 1000;
    const hours = Math.floor(secs / (60 * 60));

    const divisorForMin = secs % (60 * 60);
    const minutes = Math.floor(divisorForMin / 60);

    const divisorForSec = divisorForMin % 60;
    const seconds = Math.ceil(divisorForSec);

    const obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }
}

export default Util;
