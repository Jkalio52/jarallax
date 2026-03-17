import { afterEach, beforeEach, vi } from 'vitest';
import jqueryFactory from 'jquery';

class FakeIntersectionObserver {
  observe(target) {
    if (target?.jarallax) {
      target.jarallax.isElementInViewport = true;
    }
  }

  unobserve() {}

  disconnect() {}
}

function installGeometryStub(element) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      top: 0,
      left: 0,
      width: 320,
      height: 180,
      bottom: 180,
      right: 320,
      x: 0,
      y: 0,
      toJSON() {
        return this;
      },
    }),
  });
}

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';

  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);

  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 1280,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: 720,
  });

  const $ = jqueryFactory.fn ? jqueryFactory : jqueryFactory(window);
  window.$ = $;
  window.jQuery = $;
  globalThis.$ = $;
  globalThis.jQuery = $;

  installGeometryStub(document.documentElement);
  installGeometryStub(document.body);
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
  delete window.$;
  delete window.jQuery;
  delete globalThis.$;
  delete globalThis.jQuery;
});
