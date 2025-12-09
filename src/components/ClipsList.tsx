import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import DroppableWrapper from './dnd-wrappers/DroppableWrapper';
import DraggableWrapper from './dnd-wrappers/DraggableWrapper';
import ClipModel from '../models/ClipModel';

interface ClipsListProps {
  activeClip?: ClipModel | null;
  onItemClick?: (event: React.MouseEvent, item: ClipModel) => void;
  draggable?: boolean;
  items: ClipModel[];
}

class ClipsList extends React.Component<ClipsListProps> {
  readonly props!: ClipsListProps;

  static defaultProps: Partial<ClipsListProps> = {
    draggable: false,
  };

  constructor(props: ClipsListProps) {
    super(props);
  }

  renderClipListRow(item: ClipModel, idx: number): React.ReactNode {
    return (
      <DraggableWrapper index={ idx } key={ item.uuid } draggableId={ item.uuid }>
        <ListGroup.Item action
                        as="li"
                        key={ idx }
                        active={ this.props.activeClip && this.props.activeClip.clipId === item.clipId }
                        onClick={ (event: React.MouseEvent) => {
                          if (this.props.onItemClick) {
                            this.props.onItemClick(event, item);
                          }
                        } }>
          { item.displayName }
        </ListGroup.Item>
      </DraggableWrapper>
    );
  }

  render(): React.ReactNode {
    return (
      <Card>
        <Card.Header>Clips</Card.Header>
        <DroppableWrapper
          isDropDisabled
          droppableId="clipsList"
          list={ this.props.items }>
          <ListGroup as="ul">
            {
              this.props.items.map((item, idx) => this.renderClipListRow(item, idx))
            }
          </ListGroup>
        </DroppableWrapper>
      </Card>
    );
  }
}

export default observer(ClipsList as any);
