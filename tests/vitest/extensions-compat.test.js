import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJarallaxBlock } from './helpers.js';

describe('jarallax extension compatibility', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('registers the video extension and keeps local video parsing', async () => {
    const { default: jarallax } = await import('../../src/core.ts');
    const { default: jarallaxVideo } = await import('../../src/ext-video.ts');
    const block = createJarallaxBlock({ mode: 'img' });

    jarallaxVideo(jarallax);
    jarallax(block, {
      videoSrc:
        'mp4:../demo/video/local-video.mp4,webm:../demo/video/local-video.webm,ogv:../demo/video/local-video.ogv',
    });

    expect(block.jarallax.video.videoID).toEqual({
      mp4: '../demo/video/local-video.mp4',
      webm: '../demo/video/local-video.webm',
      ogg: '../demo/video/local-video.ogv',
    });
  });

  it('registers the deprecated element extension', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { default: jarallax } = await import('../../src/core.ts');
    const { default: jarallaxElement } = await import('../../src/deprecated/ext-element.ts');
    const block = createJarallaxBlock({ mode: 'background' });

    block.setAttribute('data-jarallax-element', '120 -50');
    jarallaxElement(jarallax);
    jarallax(block);

    expect(warn).toHaveBeenCalled();
    expect(block.jarallax.options.type).toBe('element');

    warn.mockRestore();
  });

  it('keeps VideoWorker on the global object in the UMD video wrapper', async () => {
    delete window.VideoWorker;

    await import('../../src/core.umd.ts');
    await import('../../src/ext-video.umd.ts');

    expect(window.VideoWorker).toBeDefined();
  });
});
