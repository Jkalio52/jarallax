import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJarallaxBlock } from './helpers.js';

describe('jarallax events and method compatibility', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('fires lifecycle events and passes scroll calculations during init', async () => {
    const { default: jarallax } = await import('../../src/core.js');
    const block = createJarallaxBlock({ mode: 'img' });
    const onScroll = vi.fn();
    const onInit = vi.fn();
    const onDestroy = vi.fn();
    const onCoverImage = vi.fn();

    jarallax(block, {
      onScroll,
      onInit,
      onDestroy,
      onCoverImage,
    });
    jarallax(block, 'destroy');

    expect(onInit).toHaveBeenCalledTimes(1);
    expect(onCoverImage).toHaveBeenCalledTimes(1);
    expect(onDestroy).toHaveBeenCalledTimes(1);
    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(onScroll).toHaveBeenCalledWith(
      expect.objectContaining({
        section: expect.any(Object),
        beforeTop: expect.any(Number),
        beforeTopEnd: expect.any(Number),
        afterTop: expect.any(Number),
        beforeBottom: expect.any(Number),
        beforeBottomEnd: expect.any(Number),
        afterBottom: expect.any(Number),
        visiblePercent: expect.any(Number),
        fromViewportCenter: expect.any(Number),
      })
    );
  });

  it('keeps instance css and extend helpers callable', async () => {
    const { default: jarallax } = await import('../../src/core.js');
    const block = createJarallaxBlock({ mode: 'background' });
    const probe = document.createElement('div');

    jarallax(block);
    block.jarallax.css(probe, {
      transform: 'scale(1)',
      textAlign: 'right',
    });

    expect(probe.style.transform).toBe('scale(1)');
    expect(probe.style.textAlign).toBe('right');
    expect(block.jarallax.css(probe, 'text-align')).toBe('right');
    expect(
      block.jarallax.extend(
        {
          val1: 1,
          val2: 1,
          val3: 1,
        },
        {
          val3: 2,
        },
        {
          val4: 3,
        },
        {
          val1: 4,
        }
      )
    ).toEqual({
      val1: 4,
      val2: 1,
      val3: 2,
      val4: 3,
    });
  });

  it('dispatches the public isVisible method through the root API', async () => {
    const { default: jarallax } = await import('../../src/core.js');
    const block = createJarallaxBlock({ mode: 'background' });

    jarallax(block);
    block.jarallax.isElementInViewport = false;

    expect(jarallax(block, 'isVisible')).toBe(false);

    block.jarallax.isElementInViewport = true;

    expect(jarallax(block, 'isVisible')).toBe(true);
  });
});
