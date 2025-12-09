import * as mobx from 'mobx';
import { observable, makeObservable } from 'mobx';
import BaseModel from './BaseModel';
import ClipModel from './ClipModel';
import ControlModel from './ControlModel';

// Interface for scene data serialization
export interface ISceneData {
  id: string | number;
  displayName: string;
  clipId: string;
  clipValues: number[];
  filename: string | null;
}

// A Scene is one or more clips loaded into channels with specific parameters defined
// Scenes have two channels (for now, can expand to 4 later)
export default class SceneModel extends BaseModel {
  id: string | number;

  // Pretty name
  @observable displayName!: string;

  // Clip for the scene.  type: ClipModel
  @observable clip!: ClipModel;

  // Array of 7 floats
  @observable rawClipValues!: number[];

  @observable clipControls!: mobx.IObservableArray<ControlModel>;

  @observable filename!: string | null;

  constructor(
    id: string | number,
    displayName: string,
    clip: ClipModel,
    rawClipValues: number[] | null = null,
    filename: string | null = null
  ) {
    super();
    makeObservable(this);
    this.id = id;
    this.displayName = displayName;
    this.clip = clip;
    this.rawClipValues = [];
    this.clipControls = observable.array([]);

    // Handle creating the clipControl objects
    // This is our hacky way to make this both work in both cases
    // Clips can have EITHER p1-p8 values OR a filename right now
    // To make this fully generic, we have to abstract the clip controls in a better way than we are doing right now
    // If we have another type of clip that uses a 'filename' control, we must update this here or it will break!
    if (clip.clipId === 'video') {
      this.setFilenameValue(this.clip, filename);
      // we can only do ONE of these two things, because they both set the clipControls!
    } else if (rawClipValues != null) {
      this.setClipValues(this.clip, rawClipValues);
    }
  }

  setClip(clip: ClipModel): void {
    this.clip = clip;

    // create clip controls with default values
    // totally refactor this
    const clipDefaultValues = clip.controls.map(control => control.defaultValue as number);
    this.setClipValues(clip, clipDefaultValues);
  }

  // TODO: refactor
  // the Clip Values are all floats, the 'filename' is a string.  in the future we'll refactor this so its not so bespoke
  setClipValues(clip: ClipModel, values: number[]): void {
    this.rawClipValues = values;
    const controls = this.createClipControls(clip, values);
    this.clipControls.replace(controls);
  }

  setFilenameValue(clip: ClipModel, filename: string | null): void {
    this.filename = filename;
    const controls = this.createClipControls(clip, [filename]);
    this.clipControls.replace(controls);
  }

  // Create Clip Controls.  Set values to the values in 'values'
  createClipControls(clip: ClipModel, values: (number | string | null)[]): ControlModel[] {
    const controls = clip.controls.map((control) => {
      return ControlModel.fromJS(control.toJS());
    });

    // hacky but does the job
    values.forEach((value, idx) => {
      if (controls.length > idx && value != null) {
        controls[idx].currentValue = value;
      }
    });

    return controls;
  }

  // Clones the existing clip controls
  cloneClipControls(values: Record<string, number | string> | null = null): ControlModel[] {
    return this.clipControls.map((control) => {
      const newControlModel = ControlModel.fromJS(control.toJS());

      if (values != null) {
        newControlModel.currentValue = values[newControlModel.fieldName];
      }
      return newControlModel;
    });
  }

  toJS(): ISceneData {
    return {
      id: this.id,
      displayName: this.displayName,
      clipId: this.clip.clipId,
      clipValues: this.rawClipValues,
      filename: this.filename,
    };
  }

  static fromJS(obj: ISceneData & { clip: ClipModel }): SceneModel {
    return new SceneModel(obj.id, obj.displayName, obj.clip, obj.clipValues, obj.filename);
  }
}
