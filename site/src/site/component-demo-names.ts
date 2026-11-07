// Components with a live preview on their page (keys of DEMOS in component-demos.tsx). A plain module
// so server pages can check it without importing the client file.
export const DEMO_NAMES = new Set([
  "button", "badge", "card", "input", "skeleton", "pill-tabs",
  "glass-panel", "stack-card", "pocket-card", "spotlight-card", "border-beam", "marquee", "magnetic", "aurora", "dot-pattern", "grid-pattern", "blur-fade",
  "word-rotator", "count-up", "mask-reveal", "stepper", "swap", "copy-button",
  "mac-window", "terminal", "notification",
  "typography", "page-header", "karaoke-text", "logo-collapse", "device-frame", "soft-cursor", "flying-pill",
  "element-lift", "virtual-camera", "dock", "menu-bar", "spotlight",
]);

/** Where to see the components that need a whole scene. */
export const SCENES: Record<string, string> = {
  dock: "#top", "menu-bar": "#top", spotlight: "#top",
  "device-frame": "#keynote", "virtual-camera": "#keynote", "flying-pill": "#keynote", "karaoke-text": "#keynote",
  "soft-cursor": "#motion", "element-lift": "#motion", "logo-collapse": "#motion",
};
