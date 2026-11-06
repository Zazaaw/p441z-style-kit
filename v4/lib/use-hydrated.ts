import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * true after hydration, false during SSR and the hydration pass — without setState-in-effect.
 * Use it to render client-only things (portals, theme icons, clocks) without a hydration mismatch.
 */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
