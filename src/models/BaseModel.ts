import { v4 as uuidv4 } from 'uuid';

// Base model class for all domain models
// Provides common UUID functionality for React list keys
export default abstract class BaseModel {
  // This UUID is used on the client side for things like a unique key in a React list
  // It is not persisted and randomly generated each time, which is fine for this purpose
  uuid: string;

  constructor() {
    this.uuid = uuidv4();
  }

  // Subclasses should implement toJS to serialize model data
  abstract toJS(): Record<string, any>;
}
