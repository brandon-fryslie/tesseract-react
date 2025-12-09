/* eslint-disable react/prop-types */
// Data Grid for editing a playlist

import * as React from 'react';
import { action, computed, makeObservable } from 'mobx';
import ReactDataGrid from 'react-data-grid';
import { observer } from 'mobx-react';
import DraggableWrapper from '../dnd-wrappers/DraggableWrapper';
import DroppableWrapper from '../dnd-wrappers/DroppableWrapper';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import PlaylistItemModel from '../../models/PlaylistItemModel';
import PlaylistModel from '../../models/PlaylistModel';

const DeleteIconFormatter = () => {
  return <DeleteIcon />;
};

interface RowData {
  id: string;
  rowId?: string;
  displayName: string;
  index?: number;
  duration: number;
}

interface Column {
  key: string;
  name: string;
  width: number;
  editable?: boolean;
  formatter?: React.ComponentType<any>;
  events?: {
    onClick?: (event: React.MouseEvent, rowData: any) => void;
  };
}

const columns: Column[] = [
  { key: 'index', name: 'Order', width: 75 },
  { key: 'displayName', name: 'Scene', width: 450 },
  { key: 'duration', name: 'Duration (seconds)', width: 200, editable: true },
  {
    key: 'delete',
    name: 'Delete',
    width: 75,
    formatter: DeleteIconFormatter,
    events: {
      onClick: (event: React.MouseEvent, rowData: any) => {
        const playlist = PlaylistItemModel.findContainingPlaylist(rowData.rowId);
        // remove item from playlist
        playlist.removeItem(rowData.rowId);
      },
    },
  },

];

// Do a bit of data manipulation and add a DraggableWrapper before using the default renderer
// eslint-disable-next-line react/prop-types
// ^^ I have no idea why this is triggered here.  this must technically be a 'function' component, so
// it thinks it needs proptypes?  anyway, move these functions into the class for consistency with the
// rest of the components
const customRowRenderer = ({ renderBaseRow, ...canvasProps }: any) => {
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

interface PlaylistEditorGridProps {
  playlist: PlaylistModel;
}

class PlaylistEditorGrid extends React.Component<PlaylistEditorGridProps> {
  readonly props!: PlaylistEditorGridProps;

  constructor(props: PlaylistEditorGridProps) {
    super(props);
    makeObservable(this);

    // Bind event handlers to the correct value of 'this'
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
  }

  // @observable rows;

  componentDidMount(): void {
    // Hack to force table to resize to the proper width
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  // 'Computed' functions are tracked by mobx, and any Component whos render method uses the computed value will be rerendered when the dependencies change
  // Here we use it to force a rerender when any of the durations change
  @computed get allDurations(): (number | string)[] {
    return this.props.playlist.items.map(item => item.duration);
  }

  @action handleGridRowsUpdated({ fromRowData, updated }: { fromRowData: any; updated: any }): void {
    // Update all changed values on the Model
    Object.entries(updated).forEach(([key, value]) => {
      const newValue = parseFloat(value as string);
      if (fromRowData[key] !== newValue) {
        // eslint-disable-next-line no-param-reassign
        fromRowData[key] = newValue;
      }
    });
  }

  render(): React.ReactNode {
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
            minHeight={ this.props.playlist.items.length * 35 + 50 } /* todo: need to set a max height to avoid scrolling on ipad */
            columns={ columns }
            rowGetter={ (i: number) => this.props.playlist.items[i] }
            rowsCount={ this.props.playlist.items.length }
            onGridRowsUpdated={ this.handleGridRowsUpdated }
            rowRenderer={ customRowRenderer }
            enableCellSelect />
        </div>
      </DroppableWrapper>
    );
  }
}

export default observer(PlaylistEditorGrid as any);
