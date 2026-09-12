import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// Adds `expect(results).toHaveNoViolations()` for axe-core checks in tests.
// (`vitest-axe/extend-expect` is a no-op under Vitest 4, so extend explicitly.)
expect.extend(axeMatchers);

// jsdom is missing a few APIs Base UI relies on.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof window.ResizeObserver;
}

if (typeof window.PointerEvent === 'undefined') {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? 'mouse';
    }
  } as unknown as typeof window.PointerEvent;
}
