import "@testing-library/jest-dom";

// jsdom doesn't implement IntersectionObserver (used by Nav's scroll-spy /
// sticky-shadow behavior, and later by the scroll-reveal motion in spec §1).
// A minimal no-op mock lets components mount in tests without crashing;
// the actual intersection behavior itself is Potchie's manual/browser QA
// territory per ADR 0005 (no automated real-browser visual testing in CI).
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = () => undefined;
  unobserve = () => undefined;
  disconnect = () => undefined;
  takeRecords = () => [];

  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {}
}

if (!("IntersectionObserver" in globalThis)) {
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}
