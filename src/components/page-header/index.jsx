import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './PageHeader.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { observe } from 'mobx';

function getConnectedIndicator(isConnected) {
  const connectedStyle = { color: 'green' };
  const disconnectedStyle = { color: 'red' };

  if (isConnected) {
    return <span style={connectedStyle}>Connected!</span>;
  } else {
    return <span style={disconnectedStyle}>Not connected</span>;
  }
}

class PageHeader extends Component {
  render() {
    return (
      <div className={ style.PageHeader }>
        <Container fluid>
          <Row>
            <Col xs={ 2 }><h2 className="ml-4 mb-2">draco ui</h2></Col>
            <Col xs={ 8 }></Col>
            <Col xs={ 2 }><span className="pb-2 mt-4 mb-2 float-right">{ getConnectedIndicator(this.props.isConnected) }</span></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PageHeader.propTypes = {
  isConnected: PropTypes.bool.isRequired
};

export default PageHeader;
