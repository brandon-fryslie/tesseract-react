# Architecture Baseline Documentation

**Generated:** 2025-12-08
**Project:** tesseract-react (draco-ui-react)
**Purpose:** Document current architecture before modernization

---

## Overview

This is a React 16.8.6 application using MobX 5 for state management, built for controlling a visual art installation. The application communicates with a backend server via WebSocket for real-time state synchronization.

**Technology Stack:**
- React 16.8.6 + react-dom 16.8.6
- MobX 5.9.4 + mobx-react 5.4.3
- Material-UI 3.9.3
- React-Bootstrap 1.0.0-beta.8 + Bootstrap 4.3.1
- Webpack 5.89.0, Jest 29.7.0, Babel 7.x
- Testing: enzyme (deprecated)

**Code Statistics:**
- ~3,550 lines of code
- 47 JavaScript/JSX files
- 29 component files (28 JSX)
- 7 MobX stores (BaseStore + 6 concrete)
- 6 MobX models (BaseModel + 5 concrete)
- 24 components using @observer decorator

---

## MobX Stores (State Management)

### Store Architecture Pattern

All stores follow a **singleton pattern** with inheritance from `BaseStore`:

```javascript
// src/stores/BaseStore.js
import { observable } from 'mobx';

export default class BaseStore {
  @observable items = [];

  static instance;

  static get() {
    if (this.instance == null) {
      this.instance = new this();
    }
    return this.instance;
  }

  getModelType() { throw "Must implement"; }
  addItem(item) { this.items.push(item); }
  removeItem(item) { this.items.remove(item); }  // MobX 5 array method
  refreshFromJS(arr) { this.items.replace(...); }  // MobX 5 array method
}
```

**Key Points:**
- Uses legacy MobX 5 `@observable` decorators (no `makeObservable()` calls)
- Singleton pattern via `static get()` method
- Uses deprecated MobX 5 array methods: `.remove()` and `.replace()`
- All stores extend `BaseStore` for common functionality

### Store List (7 Stores)

#### 1. **BaseStore** (`src/stores/BaseStore.js`)
- **Purpose:** Abstract base class for all stores
- **Observable State:** `items` array
- **Methods:** `get()`, `getModelType()`, `addItem()`, `removeItem()`, `find()`, `refreshFromJS()`
- **Pattern:** Singleton pattern, provides common CRUD operations

#### 2. **ClipStore** (`src/stores/ClipStore.js`)
- **Purpose:** Manages video/media clips available in the system
- **Extends:** BaseStore
- **Model Type:** ClipModel
- **Key Responsibilities:**
  - Store available clips
  - Provide clips for scene configuration
  - Handle clip metadata

#### 3. **SceneStore** (`src/stores/SceneStore.js`)
- **Purpose:** Manages scenes (configurations of clips with parameters)
- **Extends:** BaseStore
- **Model Type:** SceneModel
- **Key Responsibilities:**
  - Store all scenes
  - Track current active scene
  - Handle scene CRUD operations
  - Coordinate with WebSocket for scene updates

#### 4. **PlaylistStore** (`src/stores/PlaylistStore.js`)
- **Purpose:** Manages playlists (ordered collections of scenes)
- **Extends:** BaseStore
- **Model Type:** PlaylistModel
- **Key Responsibilities:**
  - Store all playlists
  - Track current active playlist
  - Handle playlist CRUD operations
  - Manage playlist item ordering (drag-and-drop)

#### 5. **MediaStore** (`src/stores/MediaStore.js`)
- **Purpose:** Manages media files and file picker state
- **Extends:** BaseStore
- **Key Responsibilities:**
  - Track available media files
  - Handle file picker modal state
  - Coordinate file selection

#### 6. **SettingsStore** (`src/stores/SettingsStore.js`)
- **Purpose:** Application settings and configuration
- **Extends:** BaseStore
- **Key Responsibilities:**
  - Store user preferences
  - Server connection settings
  - UI preferences
  - Settings persistence (likely localStorage)

#### 7. **UIStore** (`src/stores/UIStore.js`)
- **Purpose:** Global UI state management
- **Key Responsibilities:**
  - Active panel/tab state
  - Modal visibility states
  - WebSocket connection status
  - UI component state tree
  - Does NOT extend BaseStore (different pattern)
- **Notable:** Has a `stateTree` observable object for nested state

**Usage Pattern:**
```javascript
// Components access stores via singleton getter
const sceneStore = SceneStore.get();
const clips = sceneStore.getItems();
sceneStore.addItem(newScene);
```

---

## MobX Models (Data Models)

### Model Architecture Pattern

All models extend `BaseModel` and use MobX 5 `@observable` decorators:

```javascript
// src/models/BaseModel.js
import { observable } from 'mobx';
import uuidv4 from 'uuid/v4';

export default class BaseModel {
  uuid;  // Client-side UUID for React keys

  constructor() {
    this.uuid = uuidv4();  // Using uuid v3 API
  }
}
```

**Key Points:**
- All models have a client-side `uuid` for React list keys
- Server data has `id` field (persisted identifier)
- Models use `fromJS()` static factory for deserialization
- Observable properties track changes for MobX reactivity

### Model List (6 Models)

#### 1. **BaseModel** (`src/models/BaseModel.js`)
- **Purpose:** Base class for all models
- **Properties:** `uuid` (client-side, ephemeral)
- **Pattern:** Generates UUID on construction for React keys

#### 2. **ClipModel** (`src/models/ClipModel.js`)
- **Purpose:** Represents a video/media clip
- **Extends:** BaseModel
- **Observable Properties:**
  - `id`: string (server identifier)
  - `name`: string (clip name)
  - `filename`: string (file path)
  - `duration`: number (clip length)
  - Other clip metadata
- **Factory:** `ClipModel.fromJS(data)`

#### 3. **SceneModel** (`src/models/SceneModel.js`)
- **Purpose:** Represents a scene configuration
- **Extends:** BaseModel
- **Observable Properties:**
  - `id`: string
  - `displayName`: string
  - `clip`: ClipModel (associated clip)
  - `rawClipValues`: number[] (control values)
  - `clipControls`: ControlModel[] (control definitions)
  - `filename`: string | null (saved scene file)
- **Relationships:**
  - Has one ClipModel
  - Has many ControlModel instances
- **Factory:** `SceneModel.fromJS(data)`

#### 4. **ControlModel** (`src/models/ControlModel.js`)
- **Purpose:** Represents a control parameter (slider, knob, etc.)
- **Extends:** BaseModel
- **Observable Properties:**
  - `id`: string
  - `name`: string
  - `type`: string (slider, knob, file, etc.)
  - `value`: number | string
  - `min`, `max`: number (range for numeric controls)
  - `step`: number (increment for numeric controls)
- **Used By:** SceneModel (as clipControls)

#### 5. **PlaylistModel** (`src/models/PlaylistModel.js`)
- **Purpose:** Represents a playlist
- **Extends:** BaseModel
- **Observable Properties:**
  - `id`: string
  - `name`: string
  - `items`: PlaylistItemModel[] (ordered playlist items)
- **Relationships:**
  - Has many PlaylistItemModel instances
- **Factory:** `PlaylistModel.fromJS(data)`

#### 6. **PlaylistItemModel** (`src/models/PlaylistItemModel.js`)
- **Purpose:** Represents one item in a playlist
- **Extends:** BaseModel
- **Observable Properties:**
  - `id`: string
  - `sceneId`: string (reference to SceneModel)
  - `duration`: number (how long to show this scene)
  - `order`: number (position in playlist)
- **Relationships:**
  - References SceneModel by ID
- **Factory:** `PlaylistItemModel.fromJS(data)`

**Model Usage Pattern:**
```javascript
// Deserialize from WebSocket/API data
const scene = SceneModel.fromJS(jsonData);

// Access observable properties
scene.displayName = 'New Name';  // Triggers reactivity

// Store in MobX store
SceneStore.get().addItem(scene);
```

---

## Component Architecture

### Component Tree Structure

```
App (src/App.jsx)
├── WebsocketController (manages WS connection)
│   └── Websocket (low-level WS component)
├── PageHeader (top navigation)
│   └── SidebarButtons (tab navigation)
└── MainContent (main application area)
    ├── ScenesPanel (tab: scene management)
    │   ├── ScenesList
    │   ├── ChannelControls
    │   │   ├── SliderControl (@observer)
    │   │   ├── KnobControl (@observer)
    │   │   └── FilePickerControl (@observer)
    │   └── SceneModal (create/edit scenes)
    ├── ClipsPanel (tab: clip library)
    │   └── ClipsList
    ├── PlaylistsPanel (tab: playlist management)
    │   ├── PlaylistsList
    │   ├── NewPlaylistButton
    │   ├── PlaylistEditor
    │   │   ├── PlaylistItemView (draggable)
    │   │   └── PlaylistEditorGrid (react-data-grid)
    │   └── PlaylistDetailModal
    ├── ControlPanel (tab: advanced controls)
    ├── SettingsPanel (tab: settings)
    └── AboutPanel (tab: about)
```

### Components Using @observer (24 Total)

**Pattern:** Components decorated with `@observer` automatically re-render when observed MobX state changes.

```javascript
import { observer } from 'mobx-react';

@observer
class MyComponent extends React.Component {
  render() {
    const store = SomeStore.get();
    return <div>{store.items.length}</div>;  // Auto-updates on change
  }
}
```

**@observer Components:**
1. `WebsocketController` - WS state management
2. `MainContent` - Main application container
3. `PageHeader` - Top navigation
4. `SidebarButtons` - Tab buttons
5. `ScenesPanel` - Scene management UI
6. `ClipsPanel` - Clip library UI
7. `PlaylistsPanel` - Playlist management UI
8. `ControlPanel` - Control interface
9. `SettingsPanel` - Settings UI
10. `ScenesList` - List of scenes
11. `ClipsList` - List of clips
12. `PlaylistsList` - List of playlists
13. `PlaylistEditor` - Playlist editing interface
14. `PlaylistItemView` - Individual playlist item
15. `NewPlaylistButton` - Create playlist button
16. `ChannelControls` - Control widgets container
17. `SliderControl` - Slider widget
18. `KnobControl` - Rotary knob widget
19. `FilePickerControl` - File selection widget
20. `SceneModal` - Scene create/edit modal
21. `PlaylistDetailModal` - Playlist detail modal
22. `FilePickerModal` - File picker modal
23. `PlaylistEditorGrid` - Data grid for playlist editing
24. `DurationRemaining` - Duration display widget

**Non-Observer Components:**
- `App` (root component)
- `DraggableWrapper` (DnD wrapper)
- `DroppableWrapper` (DnD wrapper)
- `Websocket` (low-level WebSocket)
- `LogViewer` (log display)
- Utility components

### Deprecated Lifecycle Usage

**CRITICAL:** `componentWillMount()` is used and deprecated in React 17+

**Location:** `src/components/main-content/index.jsx:38`

**Must be migrated to:** `componentDidMount()` or constructor during React 18 upgrade

---

## WebSocket Integration

### Architecture

**WebSocket Controller:** `src/components/WebsocketController.jsx`
- Manages connection to backend server
- Protocol: `ws://{serverAddr}:8883`
- Auto-reconnect enabled (1s interval)

### Message Protocol

**Outgoing Messages:**
```javascript
{
  action: string,  // Action type
  data: object     // Action payload
}
```

**Incoming Messages:**
```javascript
{
  action: string,  // 'sendInitialState' | 'stateUpdate' | 'logMessage'
  data: object     // Varies by action
}
```

### Message Flow

1. **Connection Open:**
   - `WebsocketController` sets `UIStore.stateTree.websocket.isConnected = true`
   - `StateManager.loadInitialState()` requests initial state

2. **Initial State Load:**
   - Server sends `sendInitialState` action
   - `StateManager.handleSendInitialStateAction(data)` populates stores
   - Refreshes ClipStore, SceneStore, PlaylistStore from JSON

3. **Runtime Updates:**
   - Server sends `stateUpdate` action
   - `StateManager.handleStateUpdatedAction(data)` updates specific store/model
   - MobX reactivity triggers UI updates

4. **Client Actions:**
   - User interactions trigger `WebsocketController.sendMessage(action, data)`
   - Server processes and broadcasts `stateUpdate` to all clients

### State Manager

**Location:** `src/util/StateManager.js` (singleton)

**Responsibilities:**
- Coordinate WebSocket message handling
- Parse and route incoming state updates
- Call appropriate store methods (`refreshFromJS()`, etc.)
- Maintain bidirectional sync with backend

**Key Methods:**
- `loadInitialState()` - Request initial data load
- `handleSendInitialStateAction(data)` - Process initial state
- `handleStateUpdatedAction(data)` - Process incremental updates
- `setWebsocketController(ws)` - Set WS reference

---

## Singleton Pattern

### Pattern Overview

Multiple singletons are used throughout the application:

**Stores:**
```javascript
// All stores use this pattern
class SomeStore extends BaseStore {
  static instance;
  static get() {
    if (this.instance == null) {
      this.instance = new this();
    }
    return this.instance;
  }
}

// Usage
const store = SomeStore.get();
```

**State Manager:**
```javascript
// Similar singleton pattern for StateManager
StateManager.get();
```

**Why Singletons:**
- Global state management (MobX stores)
- Consistent state across component tree
- No prop drilling needed
- Access stores anywhere: `SceneStore.get()`

**MobX 6 Consideration:**
- Singleton pattern is compatible with MobX 6
- Will need to add `makeObservable(this)` in constructors
- Singleton access pattern (`get()`) remains unchanged

---

## Decorator Usage

### MobX Decorators (Legacy)

**Current Configuration:**
```javascript
// babel.config.js
plugins: [
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-class-properties', { loose: true }]
]
```

**Decorator Usage Patterns:**

**Stores:**
```javascript
import { observable } from 'mobx';

class SomeStore {
  @observable items = [];
  @observable currentItem = null;
}
```

**Components:**
```javascript
import { observer } from 'mobx-react';

@observer
class SomeComponent extends React.Component {
  render() { /* ... */ }
}
```

**MobX 6 Migration Required:**
- Must add `makeObservable(this)` to all class constructors
- Decorators remain but require explicit registration
- See Phase 3 of modernization plan

---

## Drag and Drop

### react-beautiful-dnd Integration

**Usage:** Playlist item ordering

**Wrappers:**
- `DraggableWrapper` (`src/components/dnd-wrappers/DraggableWrapper.jsx`)
- `DroppableWrapper` (`src/components/dnd-wrappers/DroppableWrapper.jsx`)

**Pattern:**
```javascript
<DroppableWrapper>
  {items.map((item, index) => (
    <DraggableWrapper key={item.id} index={index}>
      <PlaylistItemView item={item} />
    </DraggableWrapper>
  ))}
</DroppableWrapper>
```

**State Updates:**
- Drag events call store methods to reorder items
- MobX reactivity updates UI automatically

**Migration Note:**
- `react-beautiful-dnd` is unmaintained
- Phase 7 will migrate to `@hello-pangea/dnd` (community fork)

---

## Routes and Pages

### Single Page Application

**No React Router:** Application uses internal tab/panel state management

**Navigation Pattern:**
```javascript
// UIStore manages active panel
UIStore.get().stateTree.activePanel = 'scenes' | 'clips' | 'playlists' | ...

// PageHeader/SidebarButtons control navigation
// MainContent renders active panel based on state
```

**Available Panels:**
1. **Scenes Panel** - Scene management
2. **Clips Panel** - Clip library
3. **Playlists Panel** - Playlist management
4. **Control Panel** - Advanced controls
5. **Settings Panel** - Application settings
6. **About Panel** - About information

**URL:** No URL routing, all state is in-memory (server-synced)

---

## Testing

### Current Test Setup

**Framework:** Jest 29.7.0 + enzyme 3.11.0
**Adapter:** enzyme-adapter-react-16
**Test File:** `src/__tests__/app.test.jsx` (only test file)

**Test Coverage:**
- 2 smoke tests (basic rendering checks)
- enzyme `mount()` and `shallow()`
- No integration tests
- No user interaction tests
- Minimal coverage (~5%)

**Test Pattern:**
```javascript
import { mount } from 'enzyme';

it('renders without crashing', () => {
  const wrap = mount(<App />);
  expect(wrap.find(MainContent).exists()).toBe(true);
});
```

**Migration Required:**
- enzyme is DEAD (no React 18 support)
- Phase 1 will migrate to React Testing Library
- Opportunity to add real integration tests

---

## Build Configuration

### Webpack 5

**Entry:** `src/index.jsx`
**Output:** `build/` directory
**Dev Server:** webpack-dev-server (port 8080)

**Key Features:**
- Hot Module Replacement (react-hot-loader 4.8.3)
- CSS/SCSS loading (sass-loader, css-loader, style-loader)
- Babel transpilation
- Production minification (terser)
- Code splitting (webpack built-in)

**Babel:**
- `@babel/preset-env` - ES6+ transpilation
- `@babel/preset-react` - JSX transformation
- Decorator plugins (legacy mode)
- Polyfills via core-js 3.33.0

### Scripts

```json
{
  "start": "webpack-dev-server --open",
  "build": "cross-env NODE_ENV=production webpack",
  "test": "jest --watchAll --coverage"
}
```

---

## External Dependencies

### UI Libraries

**Material-UI 3.9.3:**
- Used for: Tabs, Modals, Icons, Buttons, Grid, Autocomplete
- Styling: JSS (makeStyles, withStyles)
- Icons: @material-ui/icons 3.0.2

**React-Bootstrap 1.0.0-beta.8:**
- Used for: Tab, Nav, Row, Col components
- Bootstrap CSS: 4.3.1

**react-data-grid 6.1.0:**
- Used in: PlaylistEditorGrid
- Provides editable grid for playlist items

**react-rotary-knob:**
- Custom knob control component

### Utilities

**lodash:** Utility functions
**uuid 3.3.2:** UUID generation (old API)
**prop-types:** Runtime type checking

---

## Known Issues / Technical Debt

### Critical Issues

1. **Enzyme Testing Library**
   - DEAD PROJECT, no React 18 support
   - Blocks React upgrade
   - Must migrate to React Testing Library (Phase 1)

2. **react-hot-loader**
   - Deprecated in favor of React 18 Fast Refresh
   - Must remove during React 18 upgrade (Phase 2)

3. **componentWillMount Usage**
   - Deprecated lifecycle in `src/components/main-content/index.jsx:38`
   - Must migrate to componentDidMount (Phase 2)

4. **MobX 5 Array Methods**
   - `.remove()` and `.replace()` deprecated in MobX 6
   - All stores using these must be updated (Phase 3)

5. **No makeObservable() Calls**
   - Required for MobX 6
   - Must add to all 7 stores and 6 models (Phase 3)

### Architectural Debt

1. **No Integration Tests**
   - Only 2 smoke tests
   - No user flow tests
   - No WebSocket integration tests

2. **No TypeScript**
   - All JavaScript
   - No type safety
   - Complex state management would benefit from types

3. **Material-UI 3 (5-7 years old)**
   - Extremely outdated
   - Missing features
   - JSS styling engine deprecated

4. **uuid Old API**
   - Using `uuid/v4` import (v3 API)
   - Modern API: `import { v4 } from 'uuid'`

---

## Summary

This is a well-structured React application using MobX for state management with real-time WebSocket synchronization. The architecture is clean with clear separation of concerns:

- **Stores** manage global state (singleton pattern)
- **Models** represent data entities (observable)
- **Components** render UI (reactive via @observer)
- **WebSocket** syncs state with backend

**Strengths:**
- Clean MobX patterns
- Good separation of concerns
- Working WebSocket integration
- Stable build pipeline (webpack 5, Jest 29)

**Weaknesses:**
- Severely outdated dependencies (5-7 years old)
- Using deprecated libraries (enzyme, react-hot-loader)
- Minimal test coverage
- No TypeScript
- Legacy MobX 5 patterns

**Modernization Priority:**
1. Fix testing (enzyme → RTL) - blocks React 18
2. Upgrade React to 18 - critical for ecosystem
3. Upgrade MobX to 6 - core state management
4. Upgrade UI libraries - Material-UI 3→5, Bootstrap 4→5
5. Add TypeScript - type safety and DX
6. Update minor deps - uuid, dnd library, etc.

---

**Next Steps:** Proceed with Phase 0 (create feature branch) and Phase 1 (testing migration)
