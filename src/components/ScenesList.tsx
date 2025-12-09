import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import DroppableWrapper from './dnd-wrappers/DroppableWrapper';
import DraggableWrapper from './dnd-wrappers/DraggableWrapper';
import SceneModel from '../models/SceneModel';

interface ScenesListProps {
  activeScene?: SceneModel | null;
  onItemClick?: (event: React.MouseEvent, scene: SceneModel) => void;
  scenes: SceneModel[];
}

interface SceneListRowProps {
  idx: number;
  item: SceneModel;
  active?: boolean;
  onItemClick?: (event: React.MouseEvent, scene: SceneModel) => void;
}

class ScenesList extends React.Component<ScenesListProps> {
  readonly props!: ScenesListProps;

  constructor(props: ScenesListProps) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(event: React.MouseEvent, scene: SceneModel): void {
    if (this.props.onItemClick) {
      this.props.onItemClick(event, scene);
    }
  }

  render(): React.ReactNode {
    return (
      <Card className="mt-3 mb-3">
        <Card.Header>Scenes</Card.Header>
        <DroppableWrapper isDropDisabled
                          droppableId="playlistPanelScenesList"
                          list={ this.props.scenes }>
          <ListGroup as="ul">
            {
              this.props.scenes.map((item, idx) => {
                  return (
                    <SceneListRow
                      key={ item.uuid }
                      idx={ idx }
                      item={ item }
                      onItemClick={ this.handleItemClick }
                      active={ Boolean(this.props.activeScene && this.props.activeScene.id === item.id) } />
                  );
                },
              )
            }
          </ListGroup>
        </DroppableWrapper>
      </Card>
    );
  }
}

const SceneListRow: React.FC<SceneListRowProps> = (props) => (
  <DraggableWrapper index={ props.idx } key={ props.item.id } draggableId={ props.item.uuid }>
    <ListGroup.Item action
                    as="li"
                    key={ props.idx }
                    active={ props.active }
                    onClick={ (event: React.MouseEvent) => {
                      if (props.onItemClick) {
                        props.onItemClick(event, props.item);
                      }
                    } }>
      { props.item.displayName }
    </ListGroup.Item>
  </DraggableWrapper>
);

export default observer(ScenesList as any);
