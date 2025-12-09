import React from 'react';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import Button from 'react-bootstrap/Button';
import MediaStore from '../../stores/MediaStore';
import UIStore from '../../stores/UIStore';
import ControlModel from '../../models/ControlModel';

interface FilePickerControlProps {
  control: ControlModel;
  mediaType: string;
}

class FilePickerControl extends React.Component<FilePickerControlProps> {
  readonly props!: FilePickerControlProps;

  constructor(props: FilePickerControlProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChooseVideoClick = this.handleChooseVideoClick.bind(this);
  }

  handleChange(event: Event, value: number | number[]): void {
    // this.props.control.currentValue = value;
  }

  // this is really specific to videos right now, need to generify to use other media types
  handleChooseVideoClick(): void {
    UIStore.get().stateTree.filePickerModal.items = MediaStore.get().getMediaList('videos');
    UIStore.get().stateTree.filePickerModal.control = this.props.control;
    UIStore.get().stateTree.filePickerModal.isOpen = true;
  }

  render(): React.ReactNode {
    return (
      <Card>
        <Card.Header>{this.props.control.displayName}</Card.Header>
        <Card.Body>
          <Button variant="primary" onClick={this.handleChooseVideoClick}>
            Choose Video
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

export default observer(FilePickerControl as any);
