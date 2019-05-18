import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './PageHeader.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { computed, observable, observe } from 'mobx';
import UITweaks from '../../UITweaks';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import UIStore from '../../stores/UIStore';
import { observer } from 'mobx-react';

@observer
class PageHeader extends Component {
  renderConnectedIndicator(isConnected) {
    const connectedStyle = { color: 'green' };
    const disconnectedStyle = { color: 'red' };

    if (isConnected) {
      return <span style={ connectedStyle }>Connected!</span>;
    } else {
      return <span style={ disconnectedStyle }>Not connected</span>;
    }
  }

  renderHeaderButtons() {
    return (
      <ButtonToolbar aria-label="Toolbar with button groups">
        <ButtonGroup className="mr-2" aria-label="First group">
          { this.renderFullScreenButton() }
        </ButtonGroup>
      </ButtonToolbar>
    );
  }

  renderFullScreenButton() {
    const shouldShowFullScreenButton = UIStore.get().getValue('settingsPanel', 'shouldShowFullScreenButton');
    if (shouldShowFullScreenButton) {
      return <Button variant="primary" onClick={ this.handleFullScreenButtonClick } block>Fullscreen</Button>;
    }
    return null;
  }

  handleFullScreenButtonClick() {
    UITweaks.toggleFullScreen();
  }

  render() {
    return (
      <div className={ style.PageHeader }>
        <Container fluid>
          <Row>
            <Col xs={ 2 }><h2>draco ui</h2></Col>
            <Col />
            <Col xs={ 2 }>{ this.renderHeaderButtons() }</Col>
            <Col xs={ 2 }><span>{ this.renderConnectedIndicator(this.props.isConnected) }</span></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PageHeader.propTypes = {
  isConnected: PropTypes.bool.isRequired,
};

export default PageHeader;
