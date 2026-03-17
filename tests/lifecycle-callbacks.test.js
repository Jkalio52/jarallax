import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJarallaxBlock } from './test-helpers.js';

describe('jarallax lifecycle callbacks', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('fires lifecycle callbacks and passes scroll calculations during init', async () => {
    const { default: jarallax } = await import('../src/core.ts');
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
});
