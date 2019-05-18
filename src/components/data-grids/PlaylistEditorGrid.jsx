/* eslint-disable react/prop-types */
// Data Grid for editing a playlist

import * as React from 'react';
import PropTypes from 'prop-types';
import { autorun, action, observable, observe, reaction, computed } from 'mobx';
import ReactDataGrid from 'react-data-grid';
import { observer } from 'mobx-react';
import DraggableWrapper from '../dnd-wrappers/DraggableWrapper';
import DroppableWrapper from '../dnd-wrappers/DroppableWrapper';

const columns = [
  { key: 'index', name: 'Order', width: 75 },
  { key: 'displayName', name: 'Scene', width: 525 },
  { key: 'duration', name: 'Duration (seconds)', width: 200, editable: true },
];

// Do a bit of data manipulation and add a DraggableWrapper before using the default renderer
const customRowRenderer = ({ renderBaseRow, ...canvasProps }) => {
  // Extract the correct data for the row
  // eslint-disable-next-line no-param-reassign
  canvasProps.row = {
    id: canvasProps.row.id,
    displayName: canvasProps.row.displayName,
    index: canvasProps.idx + 1,
    duration: canvasProps.row.duration,
  };

  return (
    <DraggableWrapper index={ canvasProps.idx } key={ canvasProps.row.id } draggableId={ canvasProps.row.id }>
      { renderBaseRow({ ...canvasProps }) }
    </DraggableWrapper>
  );
};

@observer
class PlaylistEditorGrid extends React.Component {
  constructor(...args) {
    super(...args);

    const props = args[0];

    // Bind event handlers to the correct value of 'this'
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
  }

  // @observable rows;

  componentDidMount() {
    // Hack to force table to resize to the proper width
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  // 'Computed' functions are tracked by mobx, and any Component whos render method uses the computed value will be rerendered when the dependencies change
  // Here we use it to force a rerender when any of the durations change
  @computed get allDurations() {
    return this.props.playlist.items.map(item => item.duration);
  }

  @action handleGridRowsUpdated({ fromRowData, updated }) {
    // Update all changed values on the Model
    Object.entries(updated).forEach(([key, value]) => {
      const newValue = parseFloat(value);
      if (fromRowData[key] !== newValue) {
        // eslint-disable-next-line no-param-reassign
        fromRowData[key] = newValue;
      }
    });
  }

  render() {
    // This is a hack to get the component to automatically rerender when any duration changes in the playlist items
    // Still learning the intricacies of mobx...obviously.  this value isn't used for anything
    const someVar = this.allDurations;

    return (

      <DroppableWrapper droppableId="playlistEditorGridContainer"
                        className="playlistEditorGridContainer"
                        list={ this.props.playlist.items }
                        style={ { width: '815px' } }>
        <div className="playlistEditorGridContainer">
          <ReactDataGrid
            columns={ columns }
            rowGetter={ i => this.props.playlist.items[i] }
            rowsCount={ this.props.playlist.items.length }
            onGridRowsUpdated={ this.handleGridRowsUpdated }
            rowRenderer={ customRowRenderer }
            enableCellSelect />
        </div>
      </DroppableWrapper>
    );
  }
}

PlaylistEditorGrid.propTypes = {
  playlist: PropTypes.object.isRequired,
};

export default PlaylistEditorGrid;

