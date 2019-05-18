import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import UIStore from '../../stores/UIStore';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// This will allow us to change the layout and reorganize things more easily
const settingsData = [
  {
    id: 'settingsServerAddress', // The controlId thing is for Accessibility, its super easy to add so we might as well
    labelText: 'Server Address',
    description: 'The IP address of the Tesseract server',
    type: 'text',
    settingsField: 'serverAddr', // The field in the stateTree in UIStore that this field corresponds to
    validationFunction: (value) => {
      const result = !!value.match(/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/);
      return result;
    },
  },
  {
    id: 'settingsShowFullScreenButton', // The controlId thing is for Accessibility, its super easy to add so we might as well
    labelText: 'Show \'Full Screen\' button in header',
    type: 'checkbox',
    settingsField: 'shouldShowFullScreenButton',
  },
];

// This will be a list of all the settings so we don't have to embed all the data directly into the JSX
@observer
class SettingsPanel extends React.Component {

  constructor(...args) {
    super(...args);

    // this.uiStore = UIStore.get();

    // Bind event handlers to the correct value of 'this'
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
  }

  handleSettingsChange(dom, data) {
    let newValue;
    if (data.type === 'checkbox') {
      newValue = dom.target.checked;
    } else {
      newValue = dom.target.value;
    }
    const editState = UIStore.get().getValue('settingsPanel', 'editState');
    editState[data.settingsField] = newValue;
  }

  handleSaveSettings() {
    // get the edit state
    // update the state in the store
    // delete all the edit state
    const editState = UIStore.get().getValue('settingsPanel', 'editState');

    Object.keys(editState).forEach((changedField) => {
      UIStore.get().setValue('settingsPanel', changedField, editState[changedField]);
      delete editState[changedField];
    });
  }

  renderFormControlDescription(data) {
    if (!data.description) {
      return null;
    }
    return (
      <Form.Text className="text-muted">
        { data.description }
      </Form.Text>
    );
  }

  renderFormControl(data) {
    const value = this.getFieldValue(data.settingsField);

    let formControl;
    if (data.type === 'text') {
      formControl = <Form.Control type="text" value={ value } onChange={ dom => this.handleSettingsChange(dom, data) } isInvalid={ !data.validationFunction(value) } />;
    } else if (data.type === 'checkbox') {
      formControl = <Form.Check type="checkbox" value={ value } onChange={ dom => this.handleSettingsChange(dom, data) } />;
    } else {
      throw `Error: invalid form control type: ${ data.type }`;
    }

    return formControl;
  }

  renderControlFeedback(data) {
    return (
      <Form.Control.Feedback type="invalid">
        Enter a valid IP address
      </Form.Control.Feedback>
    );
  }

  // Get the value of a settings field for use in the form (either 'edit' value, or store value
  getFieldValue(fieldName) {
    const editedValue = UIStore.get().getValue('settingsPanel', 'editState')[fieldName];
    if (editedValue != null) {
      return editedValue;
    } else {
      return UIStore.get().getValue('settingsPanel', fieldName);
    }
  }

  renderFormControls(formData) {
    return formData.map((data) => {

      return (
        <Form.Group as={ Row } key={ data.id } controlId={ data.id }>
          <Form.Label column sm={ 2 }>{ data.labelText }</Form.Label>
          <Col>
            { this.renderFormControl(data) }
            { this.renderControlFeedback(data) }
          </Col>
          <Col>
            { this.renderFormControlDescription(data) }
          </Col>
        </Form.Group>
      );
    });
  }

  render() {
    let saveButtonDisabled;
    const editFields = Object.keys(UIStore.get().getValue('settingsPanel', 'editState'));
    if (editFields.length === 0) {
      saveButtonDisabled = true;
    } else {
      saveButtonDisabled = false;
    }

    return (
      <Form>
        { this.renderFormControls(settingsData) }
        <Form.Group as={ Row }>
          <Col sm={ { span: 10, offset: 2 } }>
            <Button variant="primary" disabled={ saveButtonDisabled } onClick={ this.handleSaveSettings }>Save</Button>
          </Col>
        </Form.Group>
      </Form>
    );
  }
}

SettingsPanel.propTypes = {};

export default SettingsPanel;
