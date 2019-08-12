import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable, reaction } from 'mobx';
import UIStore from '../../stores/UIStore';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import ListGroup from 'react-bootstrap/ListGroup';

@observer
class FilePickerModal extends React.Component {

  constructor(...args) {
    super(...args);

    // Bind event handlers to the correct value of 'this'
    this.handleFileClick = this.handleFileClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  @action handleDialogClose() {
    this.clearDialogValues();
  }

  @action handleFileClick(event, item) {
    this.control.currentValue = item;
    this.closeDialog();
  }

  @action clearDialogValues() {
    UIStore.get().stateTree.filePickerModal.control = null;
  }

  @action closeDialog() {
    UIStore.get().stateTree.filePickerModal.isOpen = false;
  }

  @computed get items() {
    if (UIStore.get().stateTree.filePickerModal.items != null) {
      return UIStore.get().stateTree.filePickerModal.items;
    } else {
      return [];
    }
  }

  @computed get control() {
    return UIStore.get().stateTree.filePickerModal.control;
  }

  @computed get isOpen() {
    return UIStore.get().stateTree.filePickerModal.isOpen;
  }

  renderFileList() {
    return this.items.map((item, idx) => {
      // debugger;
      return (
        <ListGroup.Item
          action
          as="li"
          key={ idx }
          active={ this.control.currentValue === item }
          onClick={ dom => this.handleFileClick(dom, item) }>
          { item }
        </ListGroup.Item>
      );
    });
  }

  render() {
    return (
      <Dialog open={ this.isOpen } onEnter={ this.handleDialogOpen } onBackdropClick={this.closeDialog} onClose={ this.handleDialogClose } onExited={ this.handleDialogExited } aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Choose File</DialogTitle>
        <DialogContent>
          <ListGroup as="ul">
            { this.renderFileList() }
          </ListGroup>
        </DialogContent>
      </Dialog>
    );
  }
}

FilePickerModal.propTypes = {};

export default FilePickerModal;
