import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react/index';
import PropTypes from 'prop-types';
import DroppableWrapper from './dnd-wrappers/DroppableWrapper';
import DraggableWrapper from './dnd-wrappers/DraggableWrapper';

@observer
class ScenesList extends React.Component {
  render() {
    const sceneStore = this.props.sceneStore;

    return (
      <Card style={ { width: '18rem' } }>
        <Card.Header>Scenes</Card.Header>
        <Card.Body>
          <DroppableWrapper isDropDisabled droppableId="playlistPanelScenesList">
            <ListGroup as="ul">
              {
                sceneStore.items.map((item, idx) =>
                  <SceneListRow key={ item.id } idx={ idx } item={ item } />,
                )
              }
            </ListGroup>
          </DroppableWrapper>
        </Card.Body>
      </Card>
    );
  }
}

ScenesList.propTypes = {
  sceneStore: PropTypes.object.isRequired,
};

export default ScenesList;

const SceneListRow = props => (
  <DraggableWrapper index={ props.idx } key={ props.item.id } draggableId={ props.item.id }>
    <ListGroup.Item action
                    as="li"
                    key={ props.idx }>
      { props.item.displayName }
    </ListGroup.Item>
  </DraggableWrapper>
);

SceneListRow.propTypes = {
  idx: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
};

