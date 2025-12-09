import React from 'react';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import KnobControl from './controls/KnobControl';
import FilePickerControl from './controls/FilePickerControl';
import CardGroup from 'react-bootstrap/CardGroup';
import ClipsList from './ClipsList';
import ClipStore from '../stores/ClipStore';
import SliderControl from './controls/SliderControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UIStore from '../stores/UIStore';
import DurationRemaining from './DurationRemaining';
import SceneModel from '../models/SceneModel';
import ControlModel from '../models/ControlModel';
import ClipModel from '../models/ClipModel';

interface ChannelControlsProps {
  // The reason we pass in both Scene and Controls is because in 'live' mode (on the ControlPanel)
  // the controls we are modifying won't be directly tied to the Scene
  // If we omit controls, it will update the Scene's controls
  scene: SceneModel;
  controls?: ControlModel[];
  onItemClick?: (event: React.MouseEvent, clip: ClipModel) => void;
  showClipSelector?: boolean;
}

class ChannelControls extends React.Component<ChannelControlsProps> {
  readonly props!: ChannelControlsProps;

  renderClipControl(control: ControlModel, idx: number): React.ReactNode {
    if (control.type === 'knob') {
      return <KnobControl control={control} key={idx} />;
    } else if (control.type === 'slider') {
      return <SliderControl control={control} key={idx} />;
    } else if ((control.type as any) === 'videoFile') {
      return <FilePickerControl mediaType="videos" control={control} key={idx} />;
    }

    throw new Error(`renderClipControl: Not implemented for type ${control.type}`);
  }

  renderCurrentSceneDurationRemaining(remainingDuration: number): React.ReactNode {
    return <DurationRemaining initialTime={remainingDuration} />;
  }

  render(): React.ReactNode {
    const title = `Scene: '${this.props.scene.displayName}' Controls`;

    let clipSelector: React.ReactNode = null;
    if (this.props.showClipSelector && this.props.onItemClick) {
      clipSelector = (
        <ClipsList
          items={ClipStore.get().getItems()}
          activeClip={this.props.scene.clip}
          onItemClick={this.props.onItemClick}
        />
      );
    }

    // If we pass in controls, use those. If we don't, use the Scene's controls
    const controls = this.props.controls != null ? this.props.controls : this.props.scene.clipControls;
    if (!controls) {
      // eslint-disable-next-line no-debugger
      debugger;
    }

    return (
      <CardGroup>
        <Card>
          <Card.Header>
            <Container>
              <Row>
                <Col>{title}</Col>
                <Col>
                  {this.renderCurrentSceneDurationRemaining(
                    UIStore.get().stateTree.controlPanel.currentSceneDurationRemaining
                  )}
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <CardGroup>
            {clipSelector}
            {controls.map((control, idx) => {
              return this.renderClipControl(control, idx);
            })}
          </CardGroup>
        </Card>
      </CardGroup>
    );
  }
}

export default observer(ChannelControls as any);
