import { beforeEach, describe, expect, it, vi } from 'vitest';
import defaults from '../src/defaults.ts';
import { createJarallaxBlock } from './test-helpers.js';

describe('jarallax core DOM behavior', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('initializes an instance on a DOM element', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'background' });

    jarallax(block);

    expect(block.jarallax).toBeDefined();
    expect(block.jarallax.$item).toBe(block);
    expect(block.querySelector('.jarallax-container')).toBeTruthy();
  });

  it('keeps background-mode image metadata compatible with the legacy implementation', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'background' });

    jarallax(block);

    expect(block.jarallax.image.src).toBe(
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    );
    expect(block.jarallax.image.bgImage).toContain('https://via.placeholder.com/100x50');
  });

  it('keeps img-mode initialization bound to the source img element', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'img' });
    const image = block.querySelector('img.jarallax-img');

    jarallax(block);

    expect(block.jarallax.image.useImgTag).toBe(true);
    expect(block.jarallax.image.$item).toBe(image);
  });

  it('preserves the documented default option values', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'background' });

    jarallax(block);

    const { options } = block.jarallax;

    expect(options.type).toBe(defaults.type);
    expect(options.speed).toBe(defaults.speed);
    expect(options.imgElement).toBe(defaults.imgElement);
    expect(options.imgSize).toBe(defaults.imgSize);
    expect(options.imgPosition).toBe(defaults.imgPosition);
    expect(options.imgRepeat).toBe(defaults.imgRepeat);
    expect(options.zIndex).toBe(defaults.zIndex);
    expect(options.videoSrc).toBe(defaults.videoSrc);
    expect(options.videoPlayOnlyVisible).toBe(defaults.videoPlayOnlyVisible);
    expect(options.videoLoop).toBe(defaults.videoLoop);
  });

  it('stores original inline styles only when the element already had them', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = document.createElement('div');
    block.className = 'jarallax';
    const image = document.createElement('img');
    image.className = 'jarallax-img';
    image.src = 'https://via.placeholder.com/100x50';
    block.appendChild(image);
    document.body.appendChild(block);

    jarallax(block);

    expect(block.getAttribute('data-jarallax-original-styles')).toBeNull();

    jarallax(block, 'destroy');
    block.style.position = 'relative';
    block.style.zIndex = '10';

    jarallax(block);

    expect(block.getAttribute('data-jarallax-original-styles')).toContain('position: relative;');
    expect(block.getAttribute('data-jarallax-original-styles')).toContain('z-index: 10;');
  });

  it('changes static positioning to relative during init', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'img' });
    block.style.position = 'static';

    jarallax(block);

    expect(block.style.position).toBe('relative');
  });

  it('uses absolute image positioning when an ancestor has a transform', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'img' });
    document.body.style.transform = 'scale(1)';

    jarallax(block);

    expect(block.querySelector('.jarallax-img').style.position).toBe('absolute');
  });

  it('restores original inline styles on destroy', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'background' });
    block.style.position = 'relative';
    block.style.zIndex = '10';

    jarallax(block);
    jarallax(block, 'destroy');

    expect(block.jarallax).toBeUndefined();
    expect(block.style.position).toBe('relative');
    expect(block.style.zIndex).toBe('10');
    expect(block.style.backgroundImage).toContain('https://via.placeholder.com/100x50');
    expect(block.querySelector('.jarallax-container')).toBeNull();
  });

  it('restores an img-mode block on destroy', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'img' });
    const image = block.querySelector('img.jarallax-img');
    image.style.borderRadius = '8px';

    jarallax(block);
    jarallax(block, 'destroy');

    expect(block.jarallax).toBeUndefined();
    expect(block.querySelector('.jarallax-container')).toBeNull();
    expect(block.firstElementChild).toBe(image);
    expect(image.style.borderRadius).toBe('8px');
  });
});
