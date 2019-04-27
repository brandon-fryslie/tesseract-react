import React from 'react';
import { observer } from 'mobx-react';
import Table from 'react-bootstrap/Table';
import PropTypes from 'prop-types';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Util from '../util/Util';

// This panel contains a view of a playlist that shows
// - each scene w/ duration
//   - tap / click on item to adjust duration
//   - drag target at the bottom to add scenes / clips to the playlist

@observer
class PlaylistEditor extends React.Component {

  render() {
    const currentPlaylist = this.props.currentPlaylist;
    // const controlPanelStore = this.props.controlPanelStore;
    // const activePlaylist = controlPanelStore.currentPlaylist;

    return (
      <Table striped bordered hover>
        <thead>
        <tr>
          <th>#</th>
          <th>Scene Name</th>
          <th>Duration</th>
        </tr>
        </thead>
        <Droppable droppableId="playlistEditor">
          { (provided, snapshot) => (
            <tbody
              { ...provided.droppableProps }
              ref={ provided.innerRef }
              style={ Util.getListStyle(snapshot.isDraggingOver) }
            >
            {
              currentPlaylist.items.map((item, idx) =>
                <PlaylistEditorRow key={ item.id } idx={ idx } item={ item } />,
              )
            }
            { provided.placeholder }
            </tbody>
          ) }
        </Droppable>
      </Table>
    );
  }
}

PlaylistEditor.propTypes = {
  currentPlaylist: PropTypes.object,
};

export default PlaylistEditor;

const PlaylistEditorRow = props => (
  <Draggable index={ props.idx } key={ props.item.id } draggableId={ props.item.id }>
    { (providedInner, snapshotInner) => (
      <tr ref={ providedInner.innerRef }
          { ...providedInner.draggableProps }
          { ...providedInner.dragHandleProps }>
        <td>{ props.idx + 1 }</td>
        <td>{ props.item.scene.displayName }</td>
        <td>{ props.item.duration }</td>
      </tr>
    ) }
  </Draggable>

);

PlaylistEditorRow.propTypes = {
  idx: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
};
