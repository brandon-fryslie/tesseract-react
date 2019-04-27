class Util {
  // a little function to help us with reordering the result
// TODO: move this to a helper class
  static reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  static getListStyle(isDraggingOver) {
    return {
      background: isDraggingOver ? 'lightblue' : 'lightgrey',
      padding: 8,
      width: 250,
    };
  }

}

export default Util;
