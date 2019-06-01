import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Knob } from 'react-rotary-knob';
import Slider from '@material-ui/lab/Slider';
import Button from 'react-bootstrap/Button';
import MediaStore from '../../stores/MediaStore';
import UIStore from '../../stores/UIStore';

@observer
class SliderControl extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleChange = this.handleChange.bind(this);
    this.handleChooseVideoClick = this.handleChooseVideoClick.bind(this);
  }

  handleChange(event, value) {
    // this.props.control.currentValue = value;
  }

  // this is really specific to videos right now, need to generify to use other media types
  handleChooseVideoClick() {
    UIStore.get().stateTree.filePickerModal.items = MediaStore.get().getMediaList('videos');
    UIStore.get().stateTree.filePickerModal.control = this.props.control;
    UIStore.get().stateTree.filePickerModal.isOpen = true;
  }

  render() {

    return (
      <Card>
        <Card.Header>{ this.props.control.displayName }</Card.Header>
        <Card.Body>
          <Button variant="primary" onClick={ this.handleChooseVideoClick }>Choose Video</Button>
        </Card.Body>
      </Card>
    );
  }
}

SliderControl.propTypes = {
  control: PropTypes.object.isRequired,
  mediaType: PropTypes.string.isRequired,
};

export default SliderControl;
