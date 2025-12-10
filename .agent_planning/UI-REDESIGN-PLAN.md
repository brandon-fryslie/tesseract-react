# UI Redesign Plan - Tesseract React

**Date**: 2025-12-10
**Status**: Draft for User Approval

## Vision

Transform the current functional-but-basic UI into a **premium dark-mode control interface** that feels like professional DJ/VJ software. Think: Resolume, TouchDesigner, or Ableton Live meets a modern SaaS dashboard.

## Design Philosophy

1. **Purposeful Darkness** - True dark theme optimized for low-light performance environments
2. **Glowing Accents** - Cyan (#00ffff) as primary accent with subtle glow effects
3. **Tactile Feedback** - Every interaction feels responsive and deliberate
4. **Information Density** - Show relevant data without clutter
5. **Professional Polish** - Details matter: shadows, gradients, micro-animations

## Current State Assessment

### What Works
- MobX state management is solid
- Responsive layout exists (mobile hamburger, desktop sidebar)
- Dark theme SCSS foundation (816 lines) with good variables
- Component hierarchy is clean

### What Needs Work
- Visual design feels generic/template-like
- Inconsistent styling (Bootstrap + custom + Material UI mixed)
- No visual hierarchy or focal points
- Controls lack personality
- No micro-interactions or feedback animations
- Cards and panels blend together

## Proposed Design System

### Color Palette

```scss
// Backgrounds (layered depth)
$bg-void: #050508;        // Deepest background
$bg-base: #0a0a0f;        // Primary background
$bg-surface: #12121a;     // Cards, panels
$bg-elevated: #1a1a24;    // Hover states, active items
$bg-overlay: #222230;     // Modals, dropdowns

// Accents
$accent-primary: #00ffff;    // Cyan - main interactive color
$accent-secondary: #ff00ff;  // Magenta - for contrast/alerts
$accent-tertiary: #00ff88;   // Mint - success/active states

// Text
$text-bright: #ffffff;       // Headings, active
$text-primary: #e0e0e8;      // Body text
$text-secondary: #888890;    // Muted, labels
$text-disabled: #555560;     // Inactive

// Status
$status-active: #00ff88;     // Playing, connected
$status-warning: #ffaa00;    // Attention needed
$status-error: #ff4466;      // Errors, disconnected
```

### Typography

```scss
// Using system fonts for performance, Inter as primary
$font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-mono: 'JetBrains Mono', 'Fira Code', monospace;

// Scale (using clamp for fluid sizing)
$text-xs: clamp(0.625rem, 0.5vw + 0.5rem, 0.75rem);
$text-sm: clamp(0.75rem, 0.6vw + 0.5rem, 0.875rem);
$text-base: clamp(0.875rem, 0.7vw + 0.5rem, 1rem);
$text-lg: clamp(1rem, 0.8vw + 0.5rem, 1.125rem);
$text-xl: clamp(1.25rem, 1vw + 0.5rem, 1.5rem);
$text-2xl: clamp(1.5rem, 1.5vw + 0.5rem, 2rem);
```

### Component Styles

#### Cards & Panels
```scss
.panel {
  background: linear-gradient(135deg, $bg-surface, rgba($bg-surface, 0.8));
  border: 1px solid rgba($accent-primary, 0.1);
  border-radius: 12px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}
```

#### Buttons
```scss
.btn-primary {
  background: linear-gradient(135deg, $accent-primary, darken($accent-primary, 15%));
  border: none;
  box-shadow: 0 0 20px rgba($accent-primary, 0.3);
  text-shadow: 0 0 10px rgba($accent-primary, 0.5);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 0 30px rgba($accent-primary, 0.5);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}
```

#### Glowing Focus States
```scss
*:focus-visible {
  outline: 2px solid $accent-primary;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba($accent-primary, 0.2);
}
```

## Implementation Plan

### Phase 1: Foundation (Complexity: Low)

1. **Clean up dependencies**
   - Remove unused @emotion packages
   - Audit and consolidate CSS/SCSS imports

2. **Establish design tokens**
   - Create `_variables.scss` with complete token system
   - Create `_mixins.scss` for reusable patterns
   - Create `_animations.scss` for micro-interactions

3. **Update base styles**
   - Apply new color palette globally
   - Set up typography scale
   - Configure root-level CSS custom properties

### Phase 2: Core Components (Complexity: Medium)

1. **Sidebar redesign**
   - Glowing active state indicators
   - Smooth expand/collapse animation
   - Connection status with pulse animation

2. **Tab navigation overhaul**
   - Replace Bootstrap tabs with custom styled tabs
   - Animated underline indicator
   - Icon integration

3. **Card/Panel system**
   - Consistent glass-morphism effect
   - Subtle border glow on hover
   - Section headers with accent line

### Phase 3: Interactive Controls (Complexity: Medium-High)

1. **Knob control enhancement**
   - Already has FuturisticKnob - enhance visuals
   - Add value tooltip on drag
   - Glow intensifies with value

2. **Slider control upgrade**
   - Custom track with gradient fill
   - Thumb glow effect
   - Value display overlay

3. **Buttons & Actions**
   - Play/Stop with icon animations
   - Ripple effect on click
   - Loading states

### Phase 4: Data Display (Complexity: Medium)

1. **Playlist list redesign**
   - Card-based items with hover elevation
   - Active item glow border
   - Drag handle visibility on hover

2. **Data grid styling**
   - Dark theme for react-data-grid
   - Row hover and selection states
   - Custom header styling

3. **Scene/Clip views**
   - Thumbnail placeholders with gradient
   - Duration badges
   - Status indicators

### Phase 5: Polish & Animation (Complexity: Low-Medium)

1. **Micro-interactions**
   - Button press feedback
   - List item transitions
   - Modal enter/exit animations

2. **Loading states**
   - Skeleton screens
   - Spinner with brand colors
   - Progress indicators

3. **Empty states**
   - Illustrated empty states
   - Call-to-action prompts

## File Changes Summary

### Files to Modify
- `src/styles/dark-theme.scss` - Major overhaul
- `src/components/main-content/MainContent.scss` - Layout updates
- `src/components/main-content/index.tsx` - Structure adjustments
- `src/components/controls/FuturisticKnob.tsx` - Visual enhancements
- `src/components/controls/SliderControl.tsx` - Custom styling
- All panel components in `src/components/main-panels/`

### Files to Create
- `src/styles/_variables.scss` - Design tokens
- `src/styles/_mixins.scss` - Reusable patterns
- `src/styles/_animations.scss` - Animation definitions
- `src/styles/_components.scss` - Component-specific styles

### Files to Remove
- None (preserving backward compatibility)

## Success Criteria

1. **Visual Impact** - First impression is "wow, this looks professional"
2. **Consistency** - Every element follows the design system
3. **Responsiveness** - Works beautifully on mobile and desktop
4. **Performance** - No jank, smooth 60fps animations
5. **Accessibility** - WCAG AA contrast ratios, keyboard navigation

## Questions for User

1. **Font Choice**: Use Inter (needs import) or stick with system fonts?
2. **Animation Level**: Subtle micro-interactions or more dramatic effects?
3. **Bootstrap**: Keep using it or migrate to pure custom CSS?
4. **Dark Mode Only**: Remove light mode option entirely, or keep the toggle?

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing functionality | Test each component after styling |
| Performance impact from effects | Use GPU-accelerated properties only |
| Accessibility regression | Test contrast ratios, focus states |
| Mobile touch targets | Maintain 44px minimum |

---

**Ready to proceed with Phase 1?**
