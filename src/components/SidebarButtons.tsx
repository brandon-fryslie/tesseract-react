import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import UIStore from '../stores/UIStore';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';

interface SidebarButtonsProps {}

class SidebarButtons extends Component<SidebarButtonsProps> {
  readonly props!: SidebarButtonsProps;

  constructor(...args: any[]) {
    super(...args);
    makeObservable(this);
  }

  renderConnectedIndicator(isConnected: boolean): React.ReactNode {
    // adding 'disabled' to the button reduced the opacity, but we don't want that
    const buttonStyle = { opacity: 1.0 };

    if (isConnected) {
      return <Button variant="outline-success" style={buttonStyle} disabled>Connected!</Button>;
    } else {
      // TODO: make this button try to reconnect
      return <Button variant="outline-danger" style={buttonStyle} disabled>Not connected</Button>;
    }
  }

  @computed get isConnected(): boolean {
    return UIStore.get().stateTree.websocket.isConnected;
  }

  render(): React.ReactNode {
    return (
      <ButtonGroup vertical>
        {this.renderConnectedIndicator(this.isConnected)}
      </ButtonGroup>
    );
  }
}

export default observer(SidebarButtons as any);
