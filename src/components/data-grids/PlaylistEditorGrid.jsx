/* eslint-disable react/prop-types */
// Data Grid for editing a playlist

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, observe } from 'mobx';
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

    this.rows = props.rows;

    // Bind event handlers to the correct value of 'this'
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
  }

  @observable rows;

  componentDidMount() {
    // Hack to force table to resize to the proper width
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  componentWillReceiveProps(props) {
    this.rows = props.rows;
  }

  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    const rows = this.rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      rows[i] = { ...rows[i], ...updated };
    }
    this.rows = rows;
  }

  render() {
    return (
      <DroppableWrapper droppableId="playlistEditorGridContainer"
                        className="playlistEditorGridContainer"
                        list={ this.rows }
                        style={ { width: '815px' } }>
        <div className="playlistEditorGridContainer">
          <ReactDataGrid
            columns={ columns }
            rowGetter={ i => this.rows[i] }
            rowsCount={ this.rows.length }
            onGridRowsUpdated={ this.handleGridRowsUpdated }
            rowRenderer={ customRowRenderer }
            enableCellSelect />
        </div>
      </DroppableWrapper>
    );
  }
}

PlaylistEditorGrid.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default PlaylistEditorGrid;

