import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJarallaxBlock } from './helpers.js';

describe('jarallax video URL compatibility', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('parses the legacy set of supported video URLs', async () => {
    const { default: jarallax } = await import('../../src/core.ts');
    const { default: jarallaxVideo } = await import('../../src/ext-video.ts');
    const block = createJarallaxBlock({ mode: 'img' });

    jarallaxVideo(jarallax);

    const cases = [
      ['https://youtu.be/mru3Q5m4lkY', 'mru3Q5m4lkY'],
      ['http://www.youtube.com/watch?v=mru3Q5m4lkY', 'mru3Q5m4lkY'],
      ['www.youtube.com/embed/mru3Q5m4lkY', 'mru3Q5m4lkY'],
      ['https://vimeo.com/235212527', '235212527'],
      ['http://vimeo.com/235212527', '235212527'],
      ['https://player.vimeo.com/video/235212527?byline=0&portrait=0', '235212527'],
      [
        'mp4:../demo/video/local-video.mp4,webm:../demo/video/local-video.webm,ogv:../demo/video/local-video.ogv',
        {
          mp4: '../demo/video/local-video.mp4',
          webm: '../demo/video/local-video.webm',
          ogg: '../demo/video/local-video.ogv',
        },
      ],
    ];

    cases.forEach(([videoSrc, expectedVideoId], index) => {
      if (index > 0) {
        jarallax(block, 'destroy');
      }

      jarallax(block, { videoSrc });

      expect(block.jarallax.video.videoID).toEqual(expectedVideoId);
    });
  });
});
