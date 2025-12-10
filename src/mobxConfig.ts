import { configure } from 'mobx';

// Configure MobX 6 to work with legacy decorators
// This enables the same decorator behavior as MobX 5
configure({
  // Use proxy-based observables (default in MobX 6)
  useProxies: 'always',
  // Don't enforce actions for modifying state (matches MobX 5 default)
  enforceActions: 'never',
  // Computed values are updated lazily (default)
  computedRequiresReaction: false,
  // Don't require reaction context for observable reads
  reactionRequiresObservable: false,
  // Don't require that all observable values are accessed within a reaction
  observableRequiresReaction: false,
  // Log errors to console instead of catching them silently
  disableErrorBoundaries: true,
});
