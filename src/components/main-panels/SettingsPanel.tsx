import React from 'react';
import { observer } from 'mobx-react';
import UIStore from '../../stores/UIStore';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface SettingsDataItem {
  id: string;
  labelText: string;
  description?: string;
  type: 'text' | 'checkbox';
  settingsField: string;
  validationFunction?: (value: any) => boolean;
}

// This will allow us to change the layout and reorganize things more easily
const settingsData: SettingsDataItem[] = [
  {
    id: 'settingsServerAddress', // The controlId thing is for Accessibility, its super easy to add so we might as well
    labelText: 'Server Address',
    description: 'The IP address of the Tesseract server',
    type: 'text',
    settingsField: 'serverAddr', // The field in the stateTree in UIStore that this field corresponds to
    validationFunction: (value: any) => {
      // const result = !!value.match(/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/);
      // return result;
      return true; // this is wrong, we allow hostnames.  instead, validate that we can connect to the host via websocket
    },
  },
  {
    id: 'settingsShowFullScreenButton', // The controlId thing is for Accessibility, its super easy to add so we might as well
    labelText: 'Show \'Full Screen\' button in header',
    type: 'checkbox',
    settingsField: 'shouldShowFullScreenButton',
  },
];

interface SettingsPanelProps {}

// This will be a list of all the settings so we don't have to embed all the data directly into the JSX
class SettingsPanel extends React.Component<SettingsPanelProps> {
  readonly props!: SettingsPanelProps;

  constructor(props: SettingsPanelProps) {
    super(props);

    // this.uiStore = UIStore.get();

    // Bind event handlers to the correct value of 'this'
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
  }

  handleSettingsChange(dom: React.ChangeEvent<HTMLInputElement>, data: SettingsDataItem): void {
    let newValue: any;
    if (data.type === 'checkbox') {
      newValue = dom.target.checked;
    } else {
      newValue = dom.target.value;
    }
    const editState = UIStore.get().getValue('settingsPanel', 'editState');
    editState[data.settingsField] = newValue;
  }

  handleSaveSettings(): void {
    // get the edit state
    // update the state in the store
    // delete all the edit state
    const editState = UIStore.get().getValue('settingsPanel', 'editState');

    Object.keys(editState).forEach((changedField) => {
      UIStore.get().setValue('settingsPanel', changedField, editState[changedField]);

      // TODO: abstract this out a bit and autosave changes to localStorage whenever we change anything that should be persisted
      UIStore.get().saveLocalStorage();
      delete editState[changedField];
    });
  }

  renderFormControlDescription(data: SettingsDataItem): React.ReactNode {
    if (!data.description) {
      return null;
    }
    return (
      <Form.Text className="text-muted">
        { data.description }
      </Form.Text>
    );
  }

  renderFormControl(data: SettingsDataItem): React.ReactNode {
    const value = this.getFieldValue(data.settingsField);

    let formControl: React.ReactNode;
    if (data.type === 'text') {
      formControl = <Form.Control type="text" value={ value } onChange={ (dom: React.ChangeEvent<HTMLInputElement>) => this.handleSettingsChange(dom, data) } isInvalid={ data.validationFunction ? !data.validationFunction(value) : false } />;
    } else if (data.type === 'checkbox') {
      formControl = <Form.Check type="checkbox" checked={ value } onChange={ (dom: React.ChangeEvent<HTMLInputElement>) => this.handleSettingsChange(dom, data) } />;
    } else {
      throw new Error(`Error: invalid form control type: ${ data.type }`);
    }

    return formControl;
  }

  renderControlFeedback(data: SettingsDataItem): React.ReactNode {
    return (
      <Form.Control.Feedback type="invalid">
        Enter a valid IP address
      </Form.Control.Feedback>
    );
  }

  // Get the value of a settings field for use in the form (either 'edit' value, or store value
  getFieldValue(fieldName: string): any {
    const editedValue = UIStore.get().getValue('settingsPanel', 'editState')[fieldName];
    if (editedValue != null) {
      return editedValue;
    } else {
      return UIStore.get().getValue('settingsPanel', fieldName);
    }
  }

  renderFormControls(formData: SettingsDataItem[]): React.ReactNode {
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

  // Prevents pressing enter on the settings page from 'submitting' the form and reloading the page
  handleFormSubmit(e: React.FormEvent): void {
    e.preventDefault();
  }

  render(): React.ReactNode {
    let saveButtonDisabled: boolean;
    const editFields = Object.keys(UIStore.get().getValue('settingsPanel', 'editState'));
    if (editFields.length === 0) {
      saveButtonDisabled = true;
    } else {
      saveButtonDisabled = false;
    }

    return (
      <Form onSubmit={this.handleFormSubmit}>
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

export default observer(SettingsPanel as any);
