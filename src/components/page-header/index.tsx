import React, { Component } from 'react';
import style from './PageHeader.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UITweaks from '../../UITweaks';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import UIStore from '../../stores/UIStore';
import { observer } from 'mobx-react';

// TODO: move this functionality elsewhere.  it is no longer used
// mainly just need to move the 'full screen' button

interface PageHeaderProps {}

class PageHeader extends Component<PageHeaderProps> {
  readonly props!: PageHeaderProps;

  renderHeaderButtons(): React.ReactNode {
    return (
      <ButtonToolbar aria-label="Toolbar with button groups">
        <ButtonGroup className="mr-2" aria-label="First group">
          { this.renderFullScreenButton() }
        </ButtonGroup>
      </ButtonToolbar>
    );
  }

  renderFullScreenButton(): React.ReactNode {
    const shouldShowFullScreenButton = UIStore.get().getValue('settingsPanel', 'shouldShowFullScreenButton');
    if (shouldShowFullScreenButton) {
      return (
        <div className="d-grid">
          <Button variant="primary" onClick={ this.handleFullScreenButtonClick }>Fullscreen</Button>
        </div>
      );
    }
    return null;
  }

  handleFullScreenButtonClick(): void {
    UITweaks.toggleFullScreen();
  }

  render(): React.ReactNode {
    return (
      <div className={ style.PageHeader }>
        <Container fluid>
          <Row>
            <Col xs={ 2 }>{ this.renderHeaderButtons() }</Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default observer(PageHeader as any);
