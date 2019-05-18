import { observable } from 'mobx';
import uuidv4 from 'uuid/v4';

// A Scene is one or more clips loaded into channels with specific parameters defined
// Scenes have two channels (for now, can expand to 4 later)
export default class BaseModel {
  // This UUID is used on the client side for things like a unique key in a React list
  // It is not persisted and randomly generated each time, which is fine for this purpose
  uuid;

  constructor() {
    this.uuid = uuidv4();
  }
}
