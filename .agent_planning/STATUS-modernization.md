# Full Modernization Assessment - React Project

**Generated:** 2025-12-08
**Project:** tesseract-react (draco-ui-react)
**Current Status:** Node.js 20, webpack 5, Jest 29, pnpm ✅
**Next Phase:** React 18/19, TypeScript, Modern Dependencies

---

## Executive Summary

This project requires a **comprehensive, multi-phase modernization**. Current dependencies are 5-7 years old and the stack is significantly outdated:

- **React:** 16.8.6 → Need React 18+ (React 19 is latest as of 2025)
- **MobX:** 5.9.4 → Need MobX 6.x (major breaking changes)
- **Material UI:** 3.9.3 → Need MUI 5.x (complete rewrite, JSS→Emotion)
- **React Bootstrap:** 1.0.0-beta.8 → Need 2.x/3.x (Bootstrap 5 support)
- **Testing:** enzyme (deprecated) → React Testing Library
- **Language:** JavaScript → TypeScript

**Complexity:** ~3,550 LOC across 47 JavaScript files
**Risk Level:** HIGH - Multiple breaking changes across core dependencies
**Effort Estimate:** SUBSTANTIAL - This is not a simple dependency update

---

## 1. Current State Analysis

### Dependencies Status

#### Core React Stack
```
CURRENT          LATEST       GAP        STATUS
React 16.8.6  →  React 19.x   7 years   🔴 CRITICAL
react-dom         Same         Same      🔴 CRITICAL
mobx 5.9.4    →  MobX 6.13+   5 years   🔴 CRITICAL
mobx-react 5  →  mobx-react 9  5 years   🔴 CRITICAL
```

#### UI Libraries
```
CURRENT                          LATEST           STATUS
@material-ui/core 3.9.3       →  @mui/material 6.x  🔴 CRITICAL (complete rewrite)
@material-ui/icons 3.0.2      →  @mui/icons-material 6.x  🔴 CRITICAL
react-bootstrap 1.0.0-beta.8  →  react-bootstrap 3.x  🔴 MAJOR (Bootstrap 4→5)
bootstrap 4.3.1               →  bootstrap 5.x     🔴 MAJOR
```

#### Testing Stack
```
CURRENT                       LATEST              STATUS
enzyme 3.11.0              →  DEPRECATED         🔴 DEAD PROJECT
enzyme-adapter-react-16    →  No React 18 support  🔴 BLOCKER
jest 29.7.0                →  ✅ CURRENT         ✅ OK
```

#### Other Dependencies
```
react-hot-loader 4.8.3     →  DEPRECATED (React 18 Fast Refresh)  🔴
react-data-grid 6.1.0      →  react-data-grid 7.x  ⚠️  CHECK COMPATIBILITY
react-beautiful-dnd 11.0.1 →  @hello-pangea/dnd    ⚠️  FORK REQUIRED
uuid 3.3.2                 →  uuid 11.x            ⚠️  MINOR CHANGES
```

### Architectural Patterns in Codebase

**MobX Usage Pattern:**
- Heavy use of `@observable` decorators (24 components)
- Legacy decorator syntax (`{ legacy: true }` in babel config)
- No `makeObservable()` calls (required for MobX 6)
- Class-based stores with singleton pattern
- Direct array mutation methods (`.remove()`, `.replace()`)

**React Patterns:**
- Class components throughout (React 16 era)
- `componentWillMount()` lifecycle (deprecated in React 17+)
- Extensive use of decorators with `@observer`
- `react-hot-loader` (deprecated, replaced by Fast Refresh)

**Component Count:**
- 24 `@observer` components
- Mix of class and functional components
- Deep component tree with Material-UI and React-Bootstrap

**Test Coverage:**
- 1 test file (`__tests__/app.test.jsx`)
- Uses enzyme's `mount()` and `shallow()`
- Minimal coverage (smoke tests only)
- No integration or user flow tests

### File Structure
```
src/
├── components/        # 28 JSX files
├── stores/            # 8 JS files (MobX stores)
├── models/            # 6 JS files (MobX models)
└── util/              # 2 JS files

Total: 47 JavaScript/JSX files (~3,550 LOC)
```

---

## 2. Major Breaking Changes & Migration Paths

### 2.1 React 16 → React 18 Migration

**Breaking Changes:**
1. **New Root API** - `ReactDOM.render` → `createRoot()`
2. **Automatic Batching** - More aggressive state batching (performance win, rare breaks)
3. **useEffect Timing** - Runs synchronously for discrete user inputs
4. **Strict Mode** - Double-mounting in dev (catches bugs)
5. **Lifecycle Deprecations** - `componentWillMount` → `componentDidMount`
6. **TypeScript Types** - Significant type changes

**Migration Strategy:**
```javascript
// BEFORE (React 16)
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// AFTER (React 18)
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**Concurrent Features (Optional but Recommended):**
- `startTransition` - Mark non-urgent updates
- `useDeferredValue` - Defer expensive renders
- `useId` - Generate stable IDs for SSR
- Suspense improvements

**Issues in This Codebase:**
- `src/components/main-content/index.jsx:38` - Uses `componentWillMount()` ⚠️
- Hot module reloading uses deprecated `react-hot-loader`
- No concurrent features currently used

**References:**
- [How to Upgrade to React 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React 18 Migration Guide](https://refine.dev/blog/react-18-upgrade-guide/)

---

### 2.2 MobX 5 → MobX 6 Migration

**CRITICAL BREAKING CHANGE:** MobX 6 requires explicit `makeObservable()` calls.

**The Problem:**
```javascript
// MobX 5 (CURRENT) - Works fine
class SceneModel extends BaseModel {
  @observable displayName;
  @observable clip;
  @observable rawClipValues = [];
}

// MobX 6 - BREAKS without makeObservable()
class SceneModel extends BaseModel {
  @observable displayName;  // ❌ NOT OBSERVABLE!

  constructor(...args) {
    super();
    makeObservable(this);  // ✅ REQUIRED!
  }
}
```

**Migration Options:**

**Option 1: Keep Decorators + Add `makeObservable()`** (Recommended)
```javascript
import { makeObservable, observable, action } from 'mobx';

class SceneModel extends BaseModel {
  @observable displayName;

  constructor() {
    super();
    makeObservable(this);  // Reads decorator metadata
  }
}
```

**Option 2: Switch to `makeAutoObservable`** (Cannot use with inheritance)
```javascript
// ❌ WON'T WORK - We extend BaseModel/BaseStore everywhere
class SceneModel extends BaseModel {
  displayName;

  constructor() {
    super();
    makeAutoObservable(this);  // ERROR: Can't use with subclasses!
  }
}
```

**Impact Analysis:**
- **8 Store classes** - All extend `BaseStore`, need `makeObservable()`
- **6 Model classes** - All extend `BaseModel`, need `makeObservable()`
- **24 Components** - Using `@observer`, needs update to `observer()`
- BaseStore pattern uses singleton - must update carefully

**Additional MobX 6 Changes:**
1. `items.remove()` → No longer exists, use `items.splice()`
2. `items.replace()` → No longer exists, use `items.length = 0; items.push(...)`
3. Decorators config - Babel needs `{ legacy: true }` for old decorators
4. `mobx-react` 5 → 9 - API changes for `observer()` HOC

**Automated Migration:**
```bash
npx mobx-undecorate  # Codemod to add makeObservable() calls
```

**References:**
- [Migrating from MobX 4/5](https://mobx.js.org/migrating-from-4-or-5.html)
- [MobX 6 Breaking Changes](https://michel.codes/blogs/mobx6/)

---

### 2.3 Material-UI 3 → MUI 5 Migration

**MASSIVE REWRITE:** This is effectively a new library.

**Package Renaming:**
```bash
@material-ui/core      → @mui/material
@material-ui/icons     → @mui/icons-material
@material-ui/lab       → @mui/lab
```

**Styling Engine Change:**
```
JSS (makeStyles, withStyles)  →  Emotion (styled, sx prop)
```

**Migration Path:**
1. **Must upgrade through v4 first** - No direct v3 → v5 path
2. MUI v3 → MUI v4 (intermediate step)
3. MUI v4 → MUI v5 (major rewrite)

**Breaking Changes:**
- **Styling System:** JSS → Emotion (or styled-components)
- **Theme Structure:** Complete overhaul
- **Component APIs:** Many props renamed/removed
- **Icon Imports:** Different package, different names
- **Grid System:** `xs`/`sm`/`md`/`lg` behavior changes
- **Autocomplete:** Moved from lab to core, API changes

**Current Usage in Code:**
```javascript
import { withStyles } from '@material-ui/core/styles';
// Will need to become:
import { styled } from '@mui/material/styles';
// OR use sx prop inline
```

**Migration Strategies:**

**Strategy 1: Run v4 and v5 Side-by-Side**
```javascript
// Install both temporarily
npm install @material-ui/core  # v4
npm install @mui/material       # v5

// Use StyledEngineProvider for compatibility
import { StyledEngineProvider } from '@mui/material/styles';
```

**Strategy 2: Incremental with Codemods**
```bash
npx @mui/codemod v4.0.0/preset-safe <path>
npx @mui/codemod v5.0.0/preset-safe <path>
```

**This Project's MUI Usage:**
- Components used: Tabs, Grid, Buttons, Icons, Modals, Autocomplete
- No custom theming currently
- Minimal use of `withStyles` / `makeStyles`
- Mostly using default MUI styling

**Risk Assessment:**
- Medium to High - MUI is used throughout UI
- Many component API changes
- Styling approach fundamentally different
- Icon names may have changed

**References:**
- [MUI v5 Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
- [MUI v5 Style Changes](https://mui.com/material-ui/migration/v5-style-changes/)
- [Migrating from JSS](https://mui.com/material-ui/migration/migrating-from-jss/)

---

### 2.4 React-Bootstrap 1.0-beta → 3.x Migration

**Bootstrap Version Jump:** Bootstrap 4 → Bootstrap 5

**Breaking Changes:**
1. **Bootstrap 5 Changes** (Upstream)
   - `.form-group` class removed
   - Utility classes renamed (`.ml-*` → `.ms-*`, `.float-left` → `.float-start`)
   - jQuery removed (good!)
   - IE 11 support dropped

2. **React-Bootstrap v2 Changes:**
   - Accordion rewritten (no longer card-based)
   - `alignRight` → `align="end"`
   - Grid: `ColOrder` max 5 instead of 12
   - Form.Group loses `controlId` in some cases
   - Dropdown alignment changes

3. **React-Bootstrap v3 Changes:**
   - Collapse/Fade require ref forwarding
   - `useAccordionButton` import path changed

**Current Usage:**
```javascript
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
```

**Migration Steps:**
1. Read [Bootstrap 5 migration guide](https://getbootstrap.com/docs/5.0/migration/)
2. Update to `react-bootstrap@2.x` (Bootstrap 5 support)
3. Update to `react-bootstrap@3.x` (latest)
4. Update `bootstrap` CSS to 5.x

**Risk Assessment:**
- Low to Medium - Limited usage of React-Bootstrap
- Mainly using Nav/Tab/Row/Col (relatively stable)
- No complex custom Bootstrap styling

**References:**
- [React-Bootstrap v2 Migration](https://react-bootstrap.netlify.app/docs/migrating/)
- [React-Bootstrap v3 Migration](https://react-bootstrap.netlify.app/docs/migrating/migrating_v2/)

---

### 2.5 Enzyme → React Testing Library Migration

**Status:** Enzyme is **DEAD**. No React 18+ support.

**The Problem:**
```javascript
// enzyme - DEPRECATED, won't work with React 18
import { mount } from 'enzyme';
const wrap = mount(<App />);
expect(wrap.find(MainContent).exists()).toBe(true);
```

**The Solution:**
```javascript
// React Testing Library - Modern, maintained
import { render, screen } from '@testing-library/react';
render(<App />);
expect(screen.getByRole('main')).toBeInTheDocument();
```

**Philosophy Shift:**
- **Enzyme:** Test implementation (internal state, instance methods)
- **RTL:** Test behavior (what users see and do)

**Migration Patterns:**

| Enzyme | React Testing Library |
|--------|----------------------|
| `mount(<App />)` | `render(<App />)` |
| `wrapper.find(Component)` | `screen.getByRole()` / `getByText()` |
| `wrapper.find('.class')` | Avoid - query by accessible role/text |
| `wrapper.state()` | Don't test internal state |
| `wrapper.instance().method()` | Don't call instance methods |
| `shallow()` | Use `render()` - no shallow |

**Current Test Coverage:**
- **1 test file** with 2 trivial tests
- Tests only check component existence
- No user interaction tests
- No integration tests

**Migration Effort:**
- Very Low - Minimal existing tests
- Good opportunity to add real tests

**Real-World Context:**
HubSpot migrated 76,000 tests from Enzyme → RTL over 2.5 years (completed Feb 2025). For this project: ~2 tests = easy migration.

**References:**
- [Migrate from Enzyme - Testing Library](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/)
- [HubSpot Migration (2025)](https://product.hubspot.com/blog/migrated-from-enzyme-to-react-testing-library)
- [Enzyme Migration Guide](https://www.aviator.co/blog/migrating-from-enzyme/)

---

### 2.6 TypeScript Migration

**Current State:** 100% JavaScript (47 files, ~3,550 LOC)

**TypeScript Benefits:**
- Type safety for complex MobX stores
- Better IDE support
- Catch bugs at compile time
- Easier refactoring
- Industry standard for React in 2025

**Migration Complexity Factors:**

**HIGH COMPLEXITY:**
1. **MobX Decorators + TypeScript**
   - Legacy decorators need `experimentalDecorators: true`
   - Modern decorators incompatible with MobX 5
   - MobX 6 + TypeScript = better story
   - Type annotations for observable arrays

2. **Class Fields**
   - Need `useDefineForClassFields: true`
   - Interacts with decorator behavior

3. **React Component Types**
   ```typescript
   // Before
   class MainContent extends React.Component {
     clipStore = null;
   }

   // After
   class MainContent extends React.Component<Props, State> {
     clipStore: ClipStore | null = null;
   }
   ```

**MEDIUM COMPLEXITY:**
- Typing MobX stores (generic typing for items array)
- Model classes with `fromJS()` patterns
- WebSocket types
- React Bootstrap component types

**TypeScript Configuration Needed:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

**Babel Integration:**
```javascript
// babel.config.js additions
presets: [
  "@babel/preset-typescript",  // Add this
  "@babel/preset-env",
  "@babel/preset-react"
]
```

**Migration Strategy:**

**Phase 1: Hybrid Setup**
1. Add `tsconfig.json`
2. Add `@babel/preset-typescript`
3. Configure Jest for `.ts`/`.tsx`
4. Allow `.js` and `.ts` files side-by-side

**Phase 2: Incremental Migration**
1. Start with leaf nodes (no dependencies)
2. Models first (clear data types)
3. Stores next (generic types)
4. Components last (complex props)

**Phase 3: Strict Mode**
1. Enable `strict: true`
2. Fix all type errors
3. Remove all `any` types

**Decorator Considerations:**
- **Current:** Babel legacy decorators
- **MobX 6 + TS:** Keep legacy decorators OR use modern decorators
- **Recommendation:** Stick with legacy until MobX stabilizes on modern decorators

**References:**
- [TypeScript React Migration Guide 2025](https://www.creolestudios.com/react-native-javascript-to-typescript-migration/)
- [MobX Decorators in TypeScript](https://mobx.js.org/enabling-decorators.html)
- [Babel TypeScript Support](https://babeljs.io/docs/babel-plugin-transform-typescript)

---

### 2.7 Other Dependency Updates

**react-data-grid 6.1.0 → 7.x**
- Check breaking changes in v7
- May need migration for column definitions
- Usage: `PlaylistEditorGrid.jsx`

**react-beautiful-dnd 11.0.1 → @hello-pangea/dnd**
- Original project unmaintained
- Community fork is active: `@hello-pangea/dnd`
- API mostly compatible, some TS improvements
- Usage: Drag and drop wrappers

**uuid 3.x → 11.x**
- Import changed: `import uuidv4 from 'uuid/v4'` → `import { v4 as uuidv4 } from 'uuid'`
- Simple find/replace migration

**react-hot-loader → Built-in Fast Refresh**
- React 18 has built-in Fast Refresh
- Remove `react-hot-loader` dependency
- Update webpack dev server config
- Remove `hot(App)` wrapper

---

## 3. Risk Assessment

### HIGH RISK Areas

**1. MobX Decorator Migration (HIGHEST RISK)**
- **Risk:** Breaking all observable state if `makeObservable()` not added correctly
- **Impact:** App won't work at all
- **Mitigation:**
  - Use `mobx-undecorate` codemod
  - Test each store/model individually
  - Keep MobX 5 and 6 comparison build

**2. Material-UI Component Breakage**
- **Risk:** Components won't render or will render incorrectly
- **Impact:** UI broken until fixed
- **Mitigation:**
  - Use MUI codemods
  - Migrate v3→v4→v5 step-by-step
  - Visual regression testing

**3. React 18 Lifecycle Changes**
- **Risk:** `componentWillMount()` deprecated
- **Impact:** Warning in dev, may break in future React versions
- **Mitigation:**
  - Search for all deprecated lifecycles
  - Move logic to `componentDidMount()`

**4. Testing Complete Rewrite**
- **Risk:** Enzyme completely broken with React 18
- **Impact:** Can't run tests during migration
- **Mitigation:**
  - Migrate tests FIRST before React 18
  - Or delete tests temporarily (only 2 tests)

### MEDIUM RISK Areas

**1. TypeScript Introduction**
- **Risk:** Type errors blocking development
- **Impact:** Slower development during migration
- **Mitigation:**
  - Use `any` liberally at first
  - Incremental strict mode
  - Allow `.js` files during transition

**2. Bootstrap 5 CSS Changes**
- **Risk:** Layout shifts, broken styling
- **Impact:** Visual bugs
- **Mitigation:**
  - Visual regression screenshots
  - Test responsive layouts

**3. State Management Edge Cases**
- **Risk:** Subtle MobX reactivity bugs
- **Impact:** UI not updating when it should
- **Mitigation:**
  - Thorough manual testing
  - Enable MobX strict mode
  - Add integration tests

### LOW RISK Areas

**1. Build Tooling**
- Webpack 5 already updated ✅
- Jest 29 already updated ✅
- Babel config stable

**2. Minor Dependency Updates**
- uuid, lodash, etc. - straightforward

---

## 4. Recommended Migration Strategy

### Phased Approach (REQUIRED)

**Why Phased?**
- Too many breaking changes to do at once
- Need working app between phases
- Easier to isolate problems
- Can deploy incrementally

---

### **PHASE 0: Pre-Migration Preparation** (1-2 days)

**Goal:** Baseline and safety net

1. **Create Baseline**
   - Screenshot all UI states
   - Document current behavior
   - List all features to validate

2. **Improve Test Coverage** (Optional but Recommended)
   - Add integration tests for critical flows
   - Test with current stack (enzyme)
   - Gives confidence for migration

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/modernization
   ```

4. **Document Current State**
   - List all pages/routes
   - List all MobX stores
   - List all external integrations (WebSocket, etc.)

---

### **PHASE 1: Testing Migration** (2-3 days)

**Goal:** Fix testing before upgrading React

**Why First?**
- Enzyme blocks React 18 upgrade
- Small test suite = easy migration
- Can test in isolation

**Steps:**
1. Install React Testing Library
   ```bash
   pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```

2. Update `setupTests.js`
   ```javascript
   import '@testing-library/jest-dom';
   // Remove enzyme adapter
   ```

3. Migrate 2 existing tests
   ```javascript
   // Before (enzyme)
   const wrap = mount(<App />);
   expect(wrap.find(MainContent).exists()).toBe(true);

   // After (RTL)
   render(<App />);
   expect(screen.getByRole('main')).toBeInTheDocument();
   ```

4. Remove enzyme dependencies
   ```bash
   pnpm remove enzyme enzyme-adapter-react-16
   ```

5. Add new integration tests (recommended)

**Validation:**
- All tests pass
- `pnpm test` works
- No enzyme imports remain

---

### **PHASE 2: React 18 Upgrade** (3-5 days)

**Goal:** Upgrade React + react-dom to 18.x

**Why Before MobX?**
- Smaller change surface
- React 18 works with MobX 5 (with warnings)
- Can test React 18 features independently

**Steps:**
1. Upgrade React packages
   ```bash
   pnpm add react@18 react-dom@18
   ```

2. Update root rendering (`src/index.jsx`)
   ```javascript
   import { createRoot } from 'react-dom/client';
   const root = createRoot(document.getElementById('root'));
   root.render(<App />);
   ```

3. Fix deprecated lifecycles
   - Find: `componentWillMount`
   - Replace: `componentDidMount` or `constructor`

4. Remove react-hot-loader
   ```bash
   pnpm remove react-hot-loader
   ```
   - Update webpack config for Fast Refresh
   - Remove `hot(App)` wrapper

5. Test in Strict Mode
   ```javascript
   root.render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

**Validation:**
- App loads without errors
- All features work
- No console warnings
- Tests pass

**Known Issues:**
- MobX 5 may have warnings with React 18 (non-blocking)
- Will be fixed in Phase 3

---

### **PHASE 3: MobX 6 Migration** (5-7 days)

**Goal:** Upgrade MobX 5 → 6 + mobx-react 5 → 9

**Critical Phase:** This changes state management core.

**Steps:**

1. **Install MobX 6**
   ```bash
   pnpm add mobx@6 mobx-react@9 mobx-utils@6
   ```

2. **Run Codemod** (if available)
   ```bash
   npx mobx-undecorate
   ```

3. **Manual Updates to Stores/Models** (14 files)

   For each class using `@observable`:
   ```javascript
   // Add import
   import { makeObservable, observable, action } from 'mobx';

   // Add to constructor
   constructor() {
     super();
     makeObservable(this);
   }
   ```

   **Files to update:**
   - `src/stores/BaseStore.js`
   - `src/stores/ClipStore.js`
   - `src/stores/MediaStore.js`
   - `src/stores/PlaylistStore.js`
   - `src/stores/SceneStore.js`
   - `src/stores/SettingsStore.js`
   - `src/stores/UIStore.js`
   - `src/models/BaseModel.js`
   - `src/models/ClipModel.js`
   - `src/models/ControlModel.js`
   - `src/models/PlaylistItemModel.js`
   - `src/models/PlaylistModel.js`
   - `src/models/SceneModel.js`

4. **Fix Array Methods**
   ```javascript
   // Before (MobX 5)
   this.items.remove(item);
   this.items.replace(newItems);

   // After (MobX 6)
   const idx = this.items.indexOf(item);
   if (idx > -1) this.items.splice(idx, 1);

   this.items.length = 0;
   this.items.push(...newItems);
   ```

5. **Update Observer Components**
   - Components using `@observer` should still work
   - Verify all components react to state changes

6. **Enable Strict Mode** (Optional but Recommended)
   ```javascript
   import { configure } from 'mobx';
   configure({
     enforceActions: 'always',
     computedRequiresReaction: true,
     reactionRequiresObservable: true,
   });
   ```

**Validation:**
- All stores initialize correctly
- Observable state updates trigger re-renders
- No MobX warnings in console
- WebSocket integration works
- Drag and drop works
- All CRUD operations work

**Rollback Plan:**
- Keep MobX 5 in separate branch
- Compare behavior side-by-side
- Document any behavior changes

---

### **PHASE 4: Material-UI → MUI 5 Migration** (7-10 days)

**Goal:** Upgrade Material-UI 3 → MUI 5 (via v4)

**Sub-Phase 4A: MUI v3 → v4**

1. Upgrade to MUI v4
   ```bash
   pnpm add @material-ui/core@4 @material-ui/icons@4 @material-ui/lab@4
   ```

2. Run v4 codemods
   ```bash
   npx @mui/codemod v4.0.0/preset-safe src
   ```

3. Test thoroughly

**Sub-Phase 4B: MUI v4 → v5**

1. Install MUI v5 alongside v4 (temporary)
   ```bash
   pnpm add @mui/material @mui/icons-material @mui/lab
   ```

2. Use both libraries during migration
   ```javascript
   import { StyledEngineProvider } from '@mui/material/styles';

   <StyledEngineProvider injectFirst>
     <App />
   </StyledEngineProvider>
   ```

3. Migrate components incrementally
   - Update imports: `@material-ui/core` → `@mui/material`
   - Update icon imports
   - Replace JSS styling with `sx` prop or `styled()`

4. Run v5 codemods
   ```bash
   npx @mui/codemod v5.0.0/preset-safe src
   ```

5. Remove v4 packages
   ```bash
   pnpm remove @material-ui/core @material-ui/icons @material-ui/lab
   ```

**Styling Strategy:**

**Option A: Use `sx` prop** (Recommended)
```javascript
// Before
<Box className={classes.container}>

// After
<Box sx={{ padding: 2, margin: 'auto' }}>
```

**Option B: Use `styled()`**
```javascript
import { styled } from '@mui/material/styles';
const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));
```

**Validation:**
- All MUI components render correctly
- Theming works (if any)
- Icons display correctly
- Responsive breakpoints work
- No v4 imports remain

---

### **PHASE 5: React-Bootstrap + Bootstrap 5** (3-4 days)

**Goal:** Upgrade to Bootstrap 5 and react-bootstrap 2.x/3.x

**Steps:**

1. Read Bootstrap 5 migration guide
   - Note removed classes (`.form-group`, etc.)
   - Note renamed utilities (`.ml-*` → `.ms-*`)

2. Upgrade packages
   ```bash
   pnpm add react-bootstrap@latest bootstrap@5
   ```

3. Update CSS imports
   ```javascript
   import 'bootstrap/dist/css/bootstrap.min.css';
   ```

4. Fix component usage
   - Update `Accordion` (complete rewrite)
   - Change `alignRight` → `align="end"`
   - Fix `Form.Group` usage

5. Update custom CSS
   - Search for Bootstrap 4 utilities
   - Replace with Bootstrap 5 equivalents

**Validation:**
- Navigation works
- Tabs work
- Forms work
- Responsive grid works
- No Bootstrap 4 CSS remains

---

### **PHASE 6: TypeScript Migration** (10-15 days)

**Goal:** Migrate to TypeScript incrementally

**Why Last?**
- All dependencies now support TS
- Modern stack in place
- Can focus on types, not breakage

**Steps:**

1. **Setup TypeScript**
   ```bash
   pnpm add -D typescript @types/react @types/react-dom @types/node
   ```

2. **Create `tsconfig.json`**
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "lib": ["ES2020", "DOM"],
       "jsx": "react-jsx",
       "module": "ESNext",
       "moduleResolution": "node",
       "strict": false,  // Start loose
       "esModuleInterop": true,
       "skipLibCheck": true,
       "experimentalDecorators": true,
       "useDefineForClassFields": true,
       "allowJs": true,  // Allow .js during migration
       "outDir": "./dist",
       "rootDir": "./src"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   ```

3. **Update Babel**
   ```javascript
   // babel.config.js
   presets: [
     "@babel/preset-typescript",  // Add first
     "@babel/preset-env",
     "@babel/preset-react"
   ]
   ```

4. **Update Jest**
   ```javascript
   // jest.config.js
   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
   transform: {
     '^.+\\.(ts|tsx)$': 'babel-jest',
     '^.+\\.(js|jsx)$': 'babel-jest',
   }
   ```

5. **Update Webpack**
   ```javascript
   // webpack.config.js
   resolve: {
     extensions: ['.ts', '.tsx', '.js', '.jsx']
   }
   ```

6. **Incremental File Migration**

   **Order:**
   1. Utility files (`src/util/`)
   2. Models (`src/models/`)
   3. Stores (`src/stores/`)
   4. Components (leaf nodes first)

   **Pattern:**
   ```typescript
   // Rename: SceneModel.js → SceneModel.ts

   import { observable, makeObservable } from 'mobx';
   import BaseModel from './BaseModel';
   import ClipModel from './ClipModel';
   import ControlModel from './ControlModel';

   export default class SceneModel extends BaseModel {
     id: string;
     displayName: string;
     clip: ClipModel;
     rawClipValues: number[] = [];
     clipControls: ControlModel[] = [];
     filename: string | null;

     constructor(
       id: string,
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
       // ... rest
     }
   }
   ```

7. **Generic Store Types**
   ```typescript
   // BaseStore.ts
   import { observable, makeObservable } from 'mobx';

   export default abstract class BaseStore<T extends BaseModel> {
     @observable items: T[] = [];

     constructor() {
       makeObservable(this);
     }

     abstract getModelType(): new (...args: any[]) => T;

     addItem(item: T): void {
       this.items.push(item);
     }
   }
   ```

8. **Component Types**
   ```typescript
   // MainContent.tsx
   import React from 'react';
   import { observer } from 'mobx-react';
   import ClipStore from '../../stores/ClipStore';

   interface MainContentProps {
     // Add props if any
   }

   interface MainContentState {
     // Add state if any
   }

   @observer
   class MainContent extends React.Component<MainContentProps, MainContentState> {
     private clipStore: ClipStore | null = null;

     componentDidMount() {
       this.clipStore = ClipStore.get();
     }

     render() {
       return <div>...</div>;
     }
   }
   ```

9. **Gradually Enable Strict Mode**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,  // Enable once most files migrated
       "noImplicitAny": true,
       "strictNullChecks": true,
       // etc.
     }
   }
   ```

**Validation:**
- `pnpm build` succeeds with no TS errors
- `pnpm test` passes
- IDE autocomplete works
- No `any` types (or minimal)
- No type assertions unless necessary

---

### **PHASE 7: Minor Dependency Updates** (2-3 days)

**Goal:** Update remaining dependencies

**Dependencies to Update:**

1. **react-data-grid 6 → 7**
   - Check changelog
   - Update column definitions if needed

2. **react-beautiful-dnd → @hello-pangea/dnd**
   ```bash
   pnpm remove react-beautiful-dnd
   pnpm add @hello-pangea/dnd
   ```
   - Update imports
   - Test drag and drop

3. **uuid 3 → 11**
   ```bash
   pnpm add uuid@latest
   pnpm add -D @types/uuid
   ```
   - Update import: `import { v4 as uuidv4 } from 'uuid'`

4. **Other minor updates**
   - lodash (already latest)
   - core-js (already latest)

**Validation:**
- All features work
- No deprecation warnings
- Dependencies audit clean

---

### **PHASE 8: Final Cleanup & Optimization** (2-3 days)

**Goal:** Polish and optimize

**Tasks:**

1. **Remove Dead Code**
   - Unused imports
   - Commented code
   - Old configuration

2. **Update Scripts**
   ```json
   // package.json
   {
     "scripts": {
       "dev": "webpack serve --mode development",
       "build": "webpack --mode production",
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage",
       "type-check": "tsc --noEmit",
       "lint": "eslint src --ext .ts,.tsx,.js,.jsx"
     }
   }
   ```

3. **Update Documentation**
   - README with new setup instructions
   - Development guide
   - Architecture notes

4. **Performance Audit**
   - Bundle size analysis
   - Lighthouse score
   - React DevTools profiling

5. **Security Audit**
   ```bash
   pnpm audit
   ```

**Final Validation:**
- Full regression test
- Cross-browser testing
- Performance benchmarks
- Documentation complete

---

## 5. Effort & Timeline Estimates

**Total Effort:** 6-8 weeks (1 developer, full-time)

| Phase | Duration | Complexity |
|-------|----------|------------|
| Phase 0: Preparation | 1-2 days | Low |
| Phase 1: Testing Migration | 2-3 days | Low |
| Phase 2: React 18 | 3-5 days | Medium |
| Phase 3: MobX 6 | 5-7 days | High |
| Phase 4: MUI 5 | 7-10 days | High |
| Phase 5: React-Bootstrap | 3-4 days | Medium |
| Phase 6: TypeScript | 10-15 days | High |
| Phase 7: Minor Dependencies | 2-3 days | Low |
| Phase 8: Cleanup | 2-3 days | Low |
| **Total** | **35-52 days** | **Varies** |

**Risk Buffer:** +20% for unexpected issues = **42-62 days**

**Parallelization:** Some phases can't be parallelized (sequential dependencies).

---

## 6. Alternative Strategies

### Strategy A: "Big Bang" Migration (NOT RECOMMENDED)

**Approach:** Update everything at once

**Pros:**
- Faster if it works
- Only one deployment

**Cons:**
- HIGH RISK of breaking everything
- Hard to debug when things break
- No working app during migration
- Can't deploy incrementally

**Verdict:** ❌ Too risky for this project

---

### Strategy B: "Parallel Rewrite" (OVERKILL)

**Approach:** Rewrite app in new stack, migrate features one by one

**Pros:**
- Always have working old app
- Can take time
- Learn new patterns

**Cons:**
- Massive effort (3-6 months)
- Maintain two codebases
- Feature drift
- Overkill for this size project

**Verdict:** ❌ Not justified for 3,550 LOC

---

### Strategy C: "Phased Migration" (RECOMMENDED)

**Approach:** Incremental upgrades, phase by phase (outlined above)

**Pros:**
- Lower risk
- Working app between phases
- Can deploy incrementally
- Easier to debug
- Can pause/resume

**Cons:**
- Takes longer than "big bang"
- More commits/deployments
- Need discipline to follow phases

**Verdict:** ✅ Best approach for this project

---

## 7. Dependencies That Can Be Grouped

Some dependencies should be updated together:

**Group 1: React Core** (Phase 2)
- react
- react-dom
- Remove react-hot-loader

**Group 2: MobX Stack** (Phase 3)
- mobx
- mobx-react
- mobx-utils

**Group 3: MUI Stack** (Phase 4)
- @mui/material (was @material-ui/core)
- @mui/icons-material (was @material-ui/icons)
- @mui/lab (was @material-ui/lab)

**Group 4: Bootstrap Stack** (Phase 5)
- bootstrap
- react-bootstrap

**Group 5: TypeScript Types** (Phase 6)
- typescript
- @types/react
- @types/react-dom
- @types/node
- @types/uuid
- @types/lodash

---

## 8. Testing Strategy for Migration

### Pre-Migration Tests

1. **Baseline Screenshots**
   - Capture all UI states
   - Document current behavior

2. **Manual Test Checklist**
   - [ ] App loads
   - [ ] WebSocket connects
   - [ ] Scenes list loads
   - [ ] Playlists CRUD works
   - [ ] Drag and drop works
   - [ ] Controls update correctly
   - [ ] Settings save/load
   - [ ] File picker works

### During Migration

1. **Run Tests After Each Phase**
   - Automated tests pass
   - Manual smoke test
   - Visual comparison

2. **Add Integration Tests**
   - Critical user flows
   - State management interactions
   - WebSocket integration

3. **Type Checking** (Phase 6+)
   - `pnpm type-check` passes
   - No `any` types (or justified)

### Post-Migration

1. **Full Regression**
   - All features work
   - Performance acceptable
   - No console errors

2. **Cross-Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers if relevant

3. **Accessibility Audit**
   - Lighthouse score
   - Keyboard navigation
   - Screen reader compatibility

---

## 9. Rollback Strategy

**Per-Phase Rollback:**

1. **Git Branches**
   - Each phase = separate branch
   - Merge to main only when validated
   - Can revert to previous phase

2. **Feature Flags** (Optional)
   - Use environment variables
   - Toggle between old/new implementations
   - Useful for React 18 concurrent features

3. **Backup Plan**
   - Keep working production build
   - Document how to rollback
   - Test rollback procedure

---

## 10. Key Decision Points

### Decision 1: TypeScript - Yes or No?

**Recommendation:** YES

**Rationale:**
- Industry standard in 2025
- Better DX with MobX and complex state
- Catches bugs at compile time
- Modernization incomplete without it

**Alternative:** Stay with JavaScript
- Faster short-term
- Missing out on major benefits
- Will need to migrate later anyway

---

### Decision 2: MUI v5 or Switch to Different Library?

**Recommendation:** Stay with MUI v5

**Rationale:**
- Already using Material-UI
- Migration path exists
- Excellent TypeScript support
- Active maintenance

**Alternatives:**
- Ant Design (requires full rewrite)
- Chakra UI (requires full rewrite)
- Tailwind + Headless UI (requires full rewrite)

All alternatives = more work than MUI migration.

---

### Decision 3: Keep MobX or Switch to Redux/Zustand?

**Recommendation:** Keep MobX 6

**Rationale:**
- Already deeply integrated
- MobX 6 is modern and well-maintained
- Switching = massive refactor
- MobX works great with TypeScript

**Alternatives:**
- Redux Toolkit (complete rewrite, more boilerplate)
- Zustand (simpler, but complete rewrite)
- React Context (too simple for this complexity)

---

### Decision 4: Class Components or Migrate to Hooks?

**Recommendation:** Keep class components (for now)

**Rationale:**
- MobX 6 works with both
- Large refactor on top of migration
- Can migrate incrementally later
- Class components not deprecated

**Future Option:**
- Phase 9 (future): Convert to function components + hooks
- Use `observer` HOC → `observer()` with hooks
- MobX `useLocalObservable()` hook

---

## 11. Open Questions / Clarifications Needed

**Q1:** What's the deployment environment?
- Affects Build config
- SSR considerations
- Browser compatibility targets

**Q2:** Are there any backend API dependencies?
- May need to coordinate API changes
- WebSocket protocol changes?

**Q3:** What's the current user base?
- Can we do canary releases?
- Beta testing available?

**Q4:** Performance requirements?
- Acceptable bundle size?
- Lighthouse score targets?

**Q5:** Browser support requirements?
- Modern browsers only?
- IE11 (hopefully not)?
- Mobile Safari versions?

**Q6:** Timeline constraints?
- Hard deadlines?
- Can we do incremental releases?

---

## 12. Success Metrics

### Technical Metrics

- ✅ All dependencies on supported versions
- ✅ No deprecation warnings
- ✅ TypeScript strict mode passing
- ✅ Test coverage >70% (with real tests)
- ✅ Bundle size <500KB (gzipped)
- ✅ Lighthouse score >90
- ✅ No console errors in production

### Functional Metrics

- ✅ All features work as before
- ✅ Performance same or better
- ✅ No visual regressions
- ✅ WebSocket integration stable
- ✅ Drag and drop smooth
- ✅ Responsive design intact

### Developer Experience Metrics

- ✅ Fast HMR (<2s)
- ✅ Fast builds (<30s production)
- ✅ IDE autocomplete works
- ✅ Type errors helpful
- ✅ Clear error messages

---

## 13. Documentation Requirements

### Update During Migration

1. **README.md**
   - New setup instructions
   - Updated tech stack
   - TypeScript notes

2. **CONTRIBUTING.md**
   - TypeScript guidelines
   - Testing expectations
   - Code style

3. **ARCHITECTURE.md** (New)
   - MobX store pattern
   - Component structure
   - State management flow

4. **MIGRATION.md** (New)
   - What changed
   - Breaking changes
   - Migration notes

---

## 14. Final Recommendations

### DO THIS:

1. **Follow the phased approach** - Don't skip phases
2. **Test thoroughly between phases** - Catch problems early
3. **Commit frequently** - Small, atomic commits
4. **Document decisions** - Future you will thank you
5. **Add integration tests** - Don't rely on enzyme smoke tests
6. **Use codemods** - Automate where possible
7. **Keep MobX** - Migration easier than switching
8. **Migrate to TypeScript** - Industry standard, worth it
9. **Stay with MUI** - Migration path clear

### DON'T DO THIS:

1. ❌ Big bang migration - Too risky
2. ❌ Skip testing migration - Blocks React 18
3. ❌ Update MobX before React 18 - Harder to debug
4. ❌ Skip intermediate MUI v4 - Direct v3→v5 unsupported
5. ❌ Use `any` everywhere in TS - Defeats the purpose
6. ❌ Migrate all files to TS at once - Incremental is safer
7. ❌ Switch to new UI library - More work than MUI migration
8. ❌ Switch to Redux/Zustand - Massive refactor, not needed

---

## 15. Conclusion

This modernization is **substantial but achievable**. The project is currently 5-7 years behind on core dependencies, but the codebase is manageable (~3,550 LOC, 47 files).

**Estimated Timeline:** 6-8 weeks (1 developer, full-time)
**Risk Level:** HIGH if done incorrectly, MEDIUM if phased approach followed
**Value:** HIGH - Modern stack, TypeScript, maintainable, future-proof

**Critical Success Factors:**
1. **Follow phased approach** - Don't rush
2. **Test thoroughly** - Between every phase
3. **Use automation** - Codemods, type checking
4. **Document everything** - Decisions, changes, learnings

**Next Steps:**
1. Review this assessment
2. Clarify open questions
3. Get buy-in on phased approach
4. Create Phase 0 baseline
5. Begin Phase 1 (testing migration)

---

## 16. References & Resources

### Official Documentation

**React:**
- [How to Upgrade to React 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React 18 Migration Guide - Refine](https://refine.dev/blog/react-18-upgrade-guide/)
- [Migrating from React 16 to React 18 - Paul Serban](https://paulserban.eu/blog/post/migrating-from-react-16-to-react-18-challenges-and-solutions/)

**MobX:**
- [Migrating from MobX 4/5 - Official Guide](https://mobx.js.org/migrating-from-4-or-5.html)
- [Announcing MobX 6 - michel.codes](https://michel.codes/blogs/mobx6/)
- [MobX Decorators in TypeScript](https://mobx.js.org/enabling-decorators.html)

**Material-UI / MUI:**
- [MUI v5 Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
- [MUI v5 Style Changes](https://mui.com/material-ui/migration/v5-style-changes/)
- [Migrating from JSS](https://mui.com/material-ui/migration/migrating-from-jss/)
- [MUI Core v5 Announcement](https://mui.com/blog/mui-core-v5/)
- [Our Experience Migrating to MUI v5 - Tint](https://www.tint.ai/technical-blog/our-experience-migrating-to-material-ui-v5)

**React-Bootstrap:**
- [React-Bootstrap v2 Migration](https://react-bootstrap.netlify.app/docs/migrating/)
- [React-Bootstrap v3 Migration](https://react-bootstrap.netlify.app/docs/migrating/migrating_v2/)
- [Bootstrap 5 Migration Guide](https://getbootstrap.com/docs/5.0/migration/)

**Testing:**
- [Migrate from Enzyme - Testing Library](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/)
- [HubSpot's Enzyme to RTL Migration (2025)](https://product.hubspot.com/blog/migrated-from-enzyme-to-react-testing-library)
- [Migrating from Enzyme - Aviator](https://www.aviator.co/blog/migrating-from-enzyme/)
- [Enzyme vs React Testing Library - ClarityDev](https://claritydev.net/blog/enzyme-vs-react-testing-library-migration-guide)

**TypeScript:**
- [React Native JavaScript to TypeScript Migration 2025](https://www.creolestudios.com/react-native-javascript-to-typescript-migration/)
- [JavaScript Decorators: Native Support, TypeScript, and Beyond](https://www.furkanbaytekin.dev/blogs/software/javascript-decorators-native-support-typescript-and-beyond)
- [Babel TypeScript Support](https://babeljs.io/docs/babel-plugin-transform-typescript)
- [Babel Decorators Plugin](https://babeljs.io/docs/babel-plugin-proposal-decorators)

### Tools & Codemods

- `npx mobx-undecorate` - Add makeObservable() calls
- `npx @mui/codemod v4.0.0/preset-safe` - MUI v4 migration
- `npx @mui/codemod v5.0.0/preset-safe` - MUI v5 migration
- TypeScript compiler - Type checking
- ESLint - Linting
- Prettier - Code formatting

---

**END OF ASSESSMENT**
