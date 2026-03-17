import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJarallaxBlock } from './test-helpers.js';

describe('jarallax jQuery plugin', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('registers $.fn.jarallax in the UMD entry', async () => {
    await import('../src/core.umd.ts');

    expect(window.jQuery.fn.jarallax).toBeTypeOf('function');
    expect(window.jQuery.fn.jarallax.noConflict).toBeTypeOf('function');
  });

  it('initializes and destroys through the jQuery plugin API', async () => {
    await import('../src/core.umd.ts');

    const block = createJarallaxBlock({ mode: 'img' });
    const $block = window.jQuery(block);

    $block.jarallax({
      speed: 0.7,
    });

    expect(block.jarallax).toBeDefined();
    expect(block.jarallax.options.speed).toBe(0.7);

    $block.jarallax('destroy');

    expect(block.jarallax).toBeUndefined();
  });

  it('restores the previous plugin on noConflict', async () => {
    const previousPlugin = () => 'previous';
    window.jQuery.fn.jarallax = previousPlugin;

    await import('../src/core.umd.ts');

    const plugin = window.jQuery.fn.jarallax.noConflict();

    expect(window.jQuery.fn.jarallax).toBe(previousPlugin);
    expect(plugin).toBeTypeOf('function');
  });
});
