import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, makeObservable } from 'mobx';
import UIStore from '../../stores/UIStore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ListGroup from 'react-bootstrap/ListGroup';
import ControlModel from '../../models/ControlModel';

class FilePickerModal extends React.Component {
  readonly props!: Record<string, never>;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);

    // Bind event handlers to the correct value of 'this'
    this.handleFileClick = this.handleFileClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  @action handleDialogClose(): void {
    this.clearDialogValues();
  }

  @action handleFileClick(_event: React.MouseEvent, item: string): void {
    if (this.control) {
      this.control.currentValue = item;
    }
    this.closeDialog();
  }

  @action clearDialogValues(): void {
    UIStore.get().stateTree.filePickerModal.control = null;
  }

  @action closeDialog(): void {
    UIStore.get().stateTree.filePickerModal.isOpen = false;
  }

  @computed get items(): string[] {
    if (UIStore.get().stateTree.filePickerModal.items != null) {
      return UIStore.get().stateTree.filePickerModal.items;
    } else {
      return [];
    }
  }

  @computed get control(): ControlModel | null {
    return UIStore.get().stateTree.filePickerModal.control;
  }

  @computed get isOpen(): boolean {
    return UIStore.get().stateTree.filePickerModal.isOpen;
  }

  renderFileList(): React.ReactNode {
    return this.items.map((item, idx) => {
      return (
        <ListGroup.Item
          action
          as="li"
          key={idx}
          active={this.control?.currentValue === item}
          onClick={(event) => this.handleFileClick(event, item)}
        >
          {item}
        </ListGroup.Item>
      );
    });
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.isOpen}
        onClose={this.handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Choose File</DialogTitle>
        <DialogContent>
          <ListGroup as="ul">{this.renderFileList()}</ListGroup>
        </DialogContent>
      </Dialog>
    );
  }
}

export default observer(FilePickerModal as any);
