import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react/index';
import PropTypes from 'prop-types';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Table from 'react-bootstrap/Table';
import Util from '../util/Util';

@observer
class ScenesList extends React.Component {
  render() {
    const sceneStore = this.props.sceneStore;

    return (
      <Card style={ { width: '18rem' } }>
        <Card.Header>Scenes</Card.Header>

        <Droppable droppableId="playlistPanelScenesList">
          { (provided, snapshot) => (
            <ListGroup as="ul">
              <div
                { ...provided.droppableProps }
                ref={ provided.innerRef }
                style={ Util.getListStyle(snapshot.isDraggingOver) }>
                {
                  sceneStore.items.map((item, idx) =>
                    <SceneListRow key={ item.id } idx={ idx } item={ item } />,
                  )
                }
              </div>
              { provided.placeholder }
            </ListGroup>
          ) }
        </Droppable>
      </Card>
    );
  }
}

ScenesList.propTypes = {
  sceneStore: PropTypes.object.isRequired,
};

export default ScenesList;

const SceneListRow = props => (
  <Draggable index={ props.idx } key={ props.item.id } draggableId={ props.item.id }>
    { (providedInner, snapshotInner) => (
      <ListGroup.Item
        action
        as="li"
        key={ props.idx }>
        <div
          ref={ providedInner.innerRef }
          { ...providedInner.draggableProps }
          { ...providedInner.dragHandleProps }>

          { props.item.displayName }
        </div>
      </ListGroup.Item>
    ) }
  </Draggable>

);

SceneListRow.propTypes = {
  idx: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
};

