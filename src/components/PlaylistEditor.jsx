import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import PlaylistEditorGrid from './data-grids/PlaylistEditorGrid';

// This panel contains a view of a playlist that shows
// - each scene w/ duration
//   - tap / click on item to adjust duration
//   - drag target at the bottom to add scenes / clips to the playlist

@observer
class PlaylistEditor extends React.Component {

  render() {
    return (
      <PlaylistEditorGrid rows={ this.props.currentPlaylist.items } />
    );
  }
}

PlaylistEditor.propTypes = {
  currentPlaylist: PropTypes.object,
};

export default PlaylistEditor;

// const PlaylistEditorRow = props => (
//   <DraggableWrapper table index={ props.idx } key={ props.item.id } draggableId={ props.item.id }>
//     <td>{ props.idx + 1 }</td>
//     <td>{ props.item.scene.displayName }</td>
//     <td>{ props.item.duration }</td>
//   </DraggableWrapper>
// );
//
// PlaylistEditorRow.propTypes = {
//   idx: PropTypes.number.isRequired,
//   item: PropTypes.object.isRequired,
// };
