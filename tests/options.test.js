import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJarallaxBlock } from './test-helpers.js';

describe('jarallax options', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('preserves custom options and normalizes legacy disable checks', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Android vitest',
    });

    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'background' });
    const onScroll = vi.fn();
    const onInit = vi.fn();
    const onDestroy = vi.fn();
    const onCoverImage = vi.fn();
    const elementInViewport = document.querySelectorAll('.jarallax');

    jarallax(block, {
      type: 'opacity',
      speed: -0.3,
      imgSrc: 'https://via.placeholder.com/100x50',
      imgElement: '.jarallax-img-test',
      imgSize: 'contain',
      imgPosition: 'center',
      imgRepeat: 'repeat',
      elementInViewport,
      zIndex: -101,
      disableParallax: /Android/,
      disableVideo: /Android/,
      videoSrc: 'https://youtu.be/mru3Q5m4lkY',
      videoStartTime: 10,
      videoEndTime: 20,
      videoVolume: 30,
      videoPlayOnlyVisible: false,
      onScroll,
      onInit,
      onDestroy,
      onCoverImage,
    });

    const { options } = block.jarallax;

    expect(options.type).toBe('opacity');
    expect(options.speed).toBe(-0.3);
    expect(options.imgSrc).toBe('https://via.placeholder.com/100x50');
    expect(options.imgElement).toBe('.jarallax-img-test');
    expect(options.imgSize).toBe('contain');
    expect(options.imgPosition).toBe('center');
    expect(options.imgRepeat).toBe('repeat');
    expect(options.elementInViewport).toBe(block);
    expect(options.zIndex).toBe(-101);
    expect(options.disableParallax()).toBe(true);
    expect(options.disableVideo()).toBe(true);
    expect(options.videoSrc).toBe('https://youtu.be/mru3Q5m4lkY');
    expect(options.videoStartTime).toBe(10);
    expect(options.videoEndTime).toBe(20);
    expect(options.videoVolume).toBe(30);
    expect(options.videoPlayOnlyVisible).toBe(false);
    expect(options.onScroll).toBe(onScroll);
    expect(options.onInit).toBe(onInit);
    expect(options.onDestroy).toBe(onDestroy);
    expect(options.onCoverImage).toBe(onCoverImage);
  });

  it('reads data attributes and keeps explicit options higher priority', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Android vitest',
    });

    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'background' });

    block.setAttribute('data-type', 'scale');
    block.setAttribute('data-speed', '1.3');
    block.setAttribute('data-img-src', 'https://via.placeholder.com/100x50');
    block.setAttribute('data-img-element', '.jarallax-img-test');
    block.setAttribute('data-img-size', 'fill');
    block.setAttribute('data-img-position', 'top');
    block.setAttribute('data-img-repeat', 'repeat');
    block.setAttribute('data-z-index', '-102');
    block.setAttribute('data-disable-parallax', '/Android/');
    block.setAttribute('data-disable-video', '/Android/');
    block.setAttribute('data-video-src', 'https://youtu.be/mru3Q5m4lkY');
    block.setAttribute('data-video-start-time', '10');
    block.setAttribute('data-video-end-time', '20');
    block.setAttribute('data-video-volume', '30');
    block.setAttribute('data-video-play-only-visible', 'false');

    jarallax(block, {
      speed: 0.9,
    });

    const { options } = block.jarallax;

    expect(options.type).toBe('scale');
    expect(options.speed).toBe(0.9);
    expect(options.imgSrc).toBe('https://via.placeholder.com/100x50');
    expect(options.imgElement).toBe('.jarallax-img-test');
    expect(options.imgSize).toBe('fill');
    expect(options.imgPosition).toBe('top');
    expect(options.imgRepeat).toBe('repeat');
    expect(options.zIndex).toBe('-102');
    expect(options.disableParallax()).toBe(true);
    expect(options.disableVideo()).toBe(true);
    expect(options.videoSrc).toBe('https://youtu.be/mru3Q5m4lkY');
    expect(options.videoStartTime).toBe('10');
    expect(options.videoEndTime).toBe('20');
    expect(options.videoVolume).toBe('30');
    expect(options.videoPlayOnlyVisible).toBe(false);
  });

  it('clamps speed values to the supported range', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'background' });

    jarallax(block, {
      speed: 2.1,
    });

    expect(block.jarallax.options.speed).toBe(2);

    jarallax(block, 'destroy');
    jarallax(block, {
      speed: -1.5,
    });

    expect(block.jarallax.options.speed).toBe(-1);
  });
});
