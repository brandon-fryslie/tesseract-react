// Type declarations for third-party libraries without TypeScript definitions

declare module 'uuid' {
  export function v4(): string;
  export function v1(): string;
  export function v3(name: string, namespace: string): string;
  export function v5(name: string, namespace: string): string;
}

declare module 'react-beautiful-dnd' {
  export const DragDropContext: any;
  export const Droppable: any;
  export const Draggable: any;
  export type DropResult = any;
  export type DraggableProvided = any;
  export type DraggableStateSnapshot = any;
  export type DroppableProvided = any;
  export type DroppableStateSnapshot = any;
}

declare module 'react-data-grid' {
  const ReactDataGrid: any;
  export default ReactDataGrid;
}

declare module 'react-data-grid-addons' {
  export const Data: any;
  export const Editors: any;
  export const Formatters: any;
  export const Toolbar: any;
  export const Menu: any;
  export const Filters: any;
  export const DraggableContainer: any;
}
