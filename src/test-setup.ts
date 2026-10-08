import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// Adds `expect(results).toHaveNoViolations()` for axe-core checks in tests.
// (`vitest-axe/extend-expect` is a no-op since Vitest 4, so extend explicitly.)
expect.extend(axeMatchers);

// vitest-axe only augments the legacy global `Vi` namespace (which Vitest 3+
// no longer reads) and types the matcher's return value as its internal
// result object, so declare it on the `vitest` module ourselves.
declare module 'vitest' {
  // Type parameters must match Vitest 5's own `Matchers<R, T>` to merge.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
    /** Asserts an axe-core result (`await axe(container)`) has no violations. */
    toHaveNoViolations(): R;
  }
}

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
