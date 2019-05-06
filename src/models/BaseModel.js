import { observable } from 'mobx';
import uuidv4 from 'uuid/v4';

// A Scene is one or more clips loaded into channels with specific parameters defined
// Scenes have two channels (for now, can expand to 4 later)
export default class BaseModel {
  uuid;

  constructor() {
    this.uuid = uuidv4();
  }
}
