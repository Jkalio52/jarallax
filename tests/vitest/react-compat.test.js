import React, { StrictMode } from 'react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

function createRect() {
  return {
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
  };
}

function createHost() {
  const host = document.createElement('div');
  document.body.appendChild(host);

  return host;
}

beforeEach(() => {
  vi.resetModules();
  document.head.querySelectorAll('[data-jarallax-react-styles]').forEach((node) => {
    node.remove();
  });

  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: createRect,
  });
});

describe('jarallax React compatibility', () => {
  it('renders stable SSR markup without initializing DOM helpers', async () => {
    const { Jarallax, JarallaxImage } = await import('../../src/react/index.ts');

    const html = renderToString(
      React.createElement(
        Jarallax,
        {
          className: 'hero',
          id: 'ssr-block',
          style: {
            backgroundImage: 'url("https://via.placeholder.com/100x50")',
            height: '180px',
            width: '320px',
          },
        },
        React.createElement(JarallaxImage, {
          alt: '',
          src: 'https://via.placeholder.com/100x50',
        }),
        React.createElement('span', null, 'SSR content')
      )
    );

    expect(html).toContain('class="jarallax hero"');
    expect(html).toContain('id="ssr-block"');
    expect(html).toContain('SSR content');
    expect(html).toContain('position:relative');
    expect(html).toContain('object-fit:cover');
    expect(html).not.toContain('jarallax-container');
  });

  it('hydrates into exactly one Jarallax instance', async () => {
    const { Jarallax, JarallaxImage } = await import('../../src/react/index.ts');
    const host = createHost();
    const element = React.createElement(
      Jarallax,
      {
        className: 'hero',
        id: 'hydrated-block',
        style: {
          height: '180px',
          width: '320px',
        },
      },
      React.createElement(JarallaxImage, {
        alt: '',
        src: 'https://via.placeholder.com/100x50',
      })
    );

    host.innerHTML = renderToString(element);

    await act(async () => {
      hydrateRoot(host, element);
    });

    const block = host.querySelector('#hydrated-block');

    expect(block.jarallax).toBeDefined();
    expect(block.querySelectorAll('.jarallax-container')).toHaveLength(1);
    expect(document.head.querySelectorAll('[data-jarallax-react-styles]')).toHaveLength(1);
  });

  it('does not leak observers across Strict Mode mount cycles', async () => {
    const observe = vi.fn((target) => {
      if (target?.jarallax) {
        target.jarallax.isElementInViewport = true;
      }
    });
    const unobserve = vi.fn();

    class TrackingIntersectionObserver {
      observe = observe;
      unobserve = unobserve;
      disconnect() {}
    }

    vi.stubGlobal('IntersectionObserver', TrackingIntersectionObserver);

    const { Jarallax } = await import('../../src/react/index.ts');
    const host = createHost();
    const root = createRoot(host);

    await act(async () => {
      root.render(
        React.createElement(
          StrictMode,
          null,
          React.createElement(Jarallax, {
            id: 'strict-block',
            style: {
              backgroundImage: 'url("https://via.placeholder.com/100x50")',
              height: '180px',
              width: '320px',
            },
          })
        )
      );
    });

    const block = host.querySelector('#strict-block');

    expect(block.jarallax).toBeDefined();
    expect(block.querySelectorAll('.jarallax-container')).toHaveLength(1);
    expect(document.head.querySelectorAll('[data-jarallax-react-styles]')).toHaveLength(1);
    expect(observe).toHaveBeenCalledTimes(2);
    expect(unobserve).toHaveBeenCalledTimes(1);

    await act(async () => {
      root.unmount();
    });

    expect(unobserve).toHaveBeenCalledTimes(2);
  });

  it('reuses the instance when effective options are unchanged and reinitializes when they change', async () => {
    const { Jarallax } = await import('../../src/react/index.ts');
    const host = createHost();
    const root = createRoot(host);

    await act(async () => {
      root.render(
        React.createElement(Jarallax, {
          id: 'update-block',
          options: {
            speed: 0.3,
          },
          style: {
            backgroundImage: 'url("https://via.placeholder.com/100x50")',
            height: '180px',
            width: '320px',
          },
        })
      );
    });

    const block = host.querySelector('#update-block');
    const initialInstanceId = block.jarallax.instanceID;

    await act(async () => {
      root.render(
        React.createElement(Jarallax, {
          id: 'update-block',
          options: {
            speed: 0.3,
          },
          style: {
            backgroundImage: 'url("https://via.placeholder.com/100x50")',
            height: '180px',
            width: '320px',
          },
        })
      );
    });

    expect(block.jarallax.instanceID).toBe(initialInstanceId);
    expect(block.querySelectorAll('.jarallax-container')).toHaveLength(1);

    await act(async () => {
      root.render(
        React.createElement(Jarallax, {
          id: 'update-block',
          options: {
            speed: 0.8,
          },
          style: {
            backgroundImage: 'url("https://via.placeholder.com/100x50")',
            height: '180px',
            width: '320px',
          },
        })
      );
    });

    expect(block.jarallax.instanceID).not.toBe(initialInstanceId);
    expect(block.querySelectorAll('.jarallax-container')).toHaveLength(1);

    await act(async () => {
      root.unmount();
    });

    expect(host.innerHTML).toBe('');
  });

  it('initializes video mode after client mount', async () => {
    const { JarallaxVideo } = await import('../../src/react/index.ts');
    const host = createHost();
    const root = createRoot(host);

    await act(async () => {
      root.render(
        React.createElement(JarallaxVideo, {
          id: 'video-block',
          style: {
            backgroundImage: 'url("https://via.placeholder.com/100x50")',
            height: '180px',
            width: '320px',
          },
          videoSrc: 'https://youtu.be/mru3Q5m4lkY',
        })
      );
    });

    const block = host.querySelector('#video-block');

    expect(block.jarallax).toBeDefined();
    expect(block.jarallax.video.videoID).toBe('mru3Q5m4lkY');
  });
});
