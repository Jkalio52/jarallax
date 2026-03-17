import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJarallaxBlock } from './test-helpers.js';

describe('jarallax element extension', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('keeps legacy element translation math intact', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { default: jarallax } = await import('../src/core.ts');
    const { default: jarallaxElement } = await import('../src/deprecated/ext-element.ts');
    const block = createJarallaxBlock({ mode: 'background' });

    block.style.backgroundImage = '';
    block.setAttribute('data-jarallax-element', '120 -50');

    jarallaxElement(jarallax);
    jarallax(block);
    jarallax(block, 'onScroll');

    const centerPercent =
      (window.innerHeight / 2 - block.getBoundingClientRect().height / 2) /
      (window.innerHeight / 2);
    const moveY = centerPercent * 120;
    const moveX = centerPercent * -50;

    expect(warn).toHaveBeenCalled();
    expect(block.jarallax.options.type).toBe('element');
    expect(block.style.transform).toBe(`translate3d(${moveX}px,${moveY}px,0)`);

    warn.mockRestore();
  });

  it('does not synthesize a background image for element mode', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { default: jarallax } = await import('../src/core.ts');
    const { default: jarallaxElement } = await import('../src/deprecated/ext-element.ts');
    const block = createJarallaxBlock({ mode: 'background' });

    block.style.backgroundImage = '';
    block.setAttribute('data-jarallax-element', '120 -50');

    jarallaxElement(jarallax);
    jarallax(block);
    jarallax(block, 'onScroll');

    const generatedLayer = block.querySelector('.jarallax-container > div');

    expect(generatedLayer).toBeTruthy();
    expect(generatedLayer.style.backgroundImage).toBe('');

    warn.mockRestore();
  });
});
