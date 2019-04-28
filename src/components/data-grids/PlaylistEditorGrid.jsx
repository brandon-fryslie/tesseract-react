/* eslint-disable react/prop-types */
// Data Grid for editing a playlist

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, observe } from 'mobx';
import ReactDataGrid from 'react-data-grid';
import { observer } from 'mobx-react';

const columns = [
  { key: 'index', name: 'Order', width: 75 },
  { key: 'displayName', name: 'Scene', width: 525 },
  { key: 'duration', name: 'Duration (seconds)', width: 200, editable: true },
];

const customRowRenderer = ({ renderBaseRow, ...canvasProps }) => {
  // Here the height of the base row is overridden by a value of 100
  // debugger

  // Extract the correct data for the row
  // eslint-disable-next-line no-param-reassign
  canvasProps.row = {
    displayName: canvasProps.row.displayName,
    index: canvasProps.idx + 1,
    duration: canvasProps.row.duration,
  };

  return renderBaseRow({ ...canvasProps });
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
      <div className="playlistEditorGridContainer">
        {/*<div className="absoluteWrapper">*/ }
        <ReactDataGrid
          // minHeight={ 800 }
          columns={ columns }
          rowGetter={ i => this.rows[i] }
          rowsCount={ this.rows.length }
          onGridRowsUpdated={ this.handleGridRowsUpdated }
          rowRenderer={ customRowRenderer }
          enableCellSelect />
        {/*</div>*/ }
      </div>
    );
  }
}

PlaylistEditorGrid.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default PlaylistEditorGrid;

