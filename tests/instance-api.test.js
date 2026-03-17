import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJarallaxBlock, stubElementRect } from './test-helpers.js';

function getParallaxHeight(speed, containerHeight, windowHeight) {
  let scrollDistance = 0;
  let resultHeight = containerHeight;

  if (speed < 0) {
    scrollDistance = speed * Math.max(containerHeight, windowHeight);

    if (windowHeight < containerHeight) {
      scrollDistance -= speed * (containerHeight - windowHeight);
    }
  } else {
    scrollDistance = speed * (containerHeight + windowHeight);
  }

  if (speed > 1) {
    resultHeight = Math.abs(scrollDistance - windowHeight);
  } else if (speed < 0) {
    resultHeight = scrollDistance / speed + Math.abs(scrollDistance);
  } else {
    resultHeight += (windowHeight - containerHeight) * (1 - speed);
  }

  return resultHeight;
}

describe('jarallax instance API', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('keeps instance css and extend helpers callable', async () => {
    const { default: jarallax } = await import('../src/core.ts');
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

  it('keeps coverImage sizing compatible with the legacy runtime', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'img' });

    jarallax(block, {
      speed: 0.85,
    });

    const container = block.querySelector('.jarallax-container');
    const image = block.querySelector('.jarallax-img');

    stubElementRect(container, {
      top: 0,
      left: 0,
      width: 320,
      height: 180,
    });

    const imageData = jarallax(block, 'coverImage');
    const expectedHeight = getParallaxHeight(0.85, 180, window.innerHeight);

    expect(imageData.image.height).toBe(expectedHeight);
    expect(image.style.height).toBe(`${expectedHeight}px`);
    expect(image.style.width).toBe('320px');
    expect(image.style.left).toBe('0px');
  });

  it('dispatches the public isVisible method through the root API', async () => {
    const { default: jarallax } = await import('../src/core.ts');
    const block = createJarallaxBlock({ mode: 'background' });

    jarallax(block);
    block.jarallax.isElementInViewport = false;

    expect(jarallax(block, 'isVisible')).toBe(false);

    block.jarallax.isElementInViewport = true;

    expect(jarallax(block, 'isVisible')).toBe(true);
  });
});
