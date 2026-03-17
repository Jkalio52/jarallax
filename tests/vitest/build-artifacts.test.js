import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);

describe('build artifact compatibility', () => {
  it('keeps package entry points aligned with the Phase 1 snapshot', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

    expect(pkg.main).toBe('dist/jarallax.cjs');
    expect(pkg.module).toBe('dist/jarallax.esm.js');
    expect(pkg.unpkg).toBe('dist/jarallax.min.js');
    expect(pkg.style).toBe('dist/jarallax.css');
    expect(pkg.types).toBe('./dist/types/src/public-api.d.ts');
    expect(pkg.files).toEqual(expect.arrayContaining(['src', 'dist', 'typings']));
    expect(pkg.exports).toMatchObject({
      '.': {
        types: './dist/types/src/public-api.d.ts',
        import: './dist/jarallax.esm.js',
        require: './dist/jarallax.cjs',
        default: './dist/jarallax.esm.js',
      },
      './dist/*': './dist/*',
      './src/*': './src/*',
      './typings': './typings/index.d.ts',
      './jarallax-video.js': './dist/jarallax-video.js',
      './jarallax-element.js': './dist/jarallax-element.js',
      './jarallax.min.css': './dist/jarallax.min.css',
    });
  });

  it('ships the required dist artifacts', () => {
    const requiredFiles = [
      'dist/jarallax.cjs',
      'dist/jarallax.css',
      'dist/jarallax.esm.js',
      'dist/jarallax.esm.min.js',
      'dist/jarallax.js',
      'dist/jarallax.min.css',
      'dist/jarallax.min.js',
      'dist/jarallax-video.js',
      'dist/jarallax-video.min.js',
      'dist/jarallax-element.js',
      'dist/jarallax-element.min.js',
      'dist/types/src/public-api.d.ts',
      'typings/index.d.ts',
    ];

    requiredFiles.forEach((relativePath) => {
      expect(fs.existsSync(path.join(rootDir, relativePath)), relativePath).toBe(true);
    });
  });

  it('exposes the current ESM export names from the built bundle', async () => {
    const entry = await import('../../dist/jarallax.esm.js');

    expect(Object.keys(entry).sort()).toEqual(['jarallax', 'jarallaxElement', 'jarallaxVideo']);
    expect(entry.jarallax).toBeTypeOf('function');
    expect(entry.jarallaxVideo).toBeTypeOf('function');
    expect(entry.jarallaxElement).toBeTypeOf('function');
  });

  it('keeps the CommonJS bundle loadable', () => {
    const entry = require(path.join(rootDir, 'dist/jarallax.cjs'));

    expect(Object.keys(entry).sort()).toEqual(['jarallax', 'jarallaxElement', 'jarallaxVideo']);
    expect(entry.jarallax).toBeTypeOf('function');
    expect(entry.jarallaxVideo).toBeTypeOf('function');
    expect(entry.jarallaxElement).toBeTypeOf('function');
  });

  it('allows SSR-safe package imports without a DOM', () => {
    const cjsBundlePath = path.join(rootDir, 'dist/jarallax.cjs');
    const esmBundleUrl = pathToFileURL(path.join(rootDir, 'dist/jarallax.esm.js')).href;
    const cjsRun = spawnSync(
      process.execPath,
      [
        '-e',
        `const entry = require(${JSON.stringify(cjsBundlePath)});\nentry.jarallax([], { speed: 0.2 });\nentry.jarallax([], 'destroy');\nconsole.log(Object.keys(entry).sort().join(','));`,
      ],
      {
        encoding: 'utf8',
      }
    );
    const esmRun = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `const entry = await import(${JSON.stringify(esmBundleUrl)});\nentry.jarallax([], { speed: 0.2 });\nentry.jarallax([], 'destroy');\nconsole.log(Object.keys(entry).sort().join(','));`,
      ],
      {
        encoding: 'utf8',
      }
    );

    expect(cjsRun.status, cjsRun.stderr).toBe(0);
    expect(cjsRun.stdout.trim()).toBe('jarallax,jarallaxElement,jarallaxVideo');
    expect(esmRun.status, esmRun.stderr).toBe(0);
    expect(esmRun.stdout.trim()).toBe('jarallax,jarallaxElement,jarallaxVideo');
  });

  it('keeps the legacy UMD global names intact', () => {
    const body = {
      appendChild() {},
      removeChild() {},
    };
    const context = {
      document: {
        readyState: 'complete',
        addEventListener() {},
        body,
        documentElement: {
          clientHeight: 768,
          clientWidth: 1024,
        },
        createElement() {
          return {
            style: {},
          };
        },
        querySelectorAll() {
          return [];
        },
      },
      navigator: {
        userAgent: 'vitest',
      },
      window: {},
    };

    context.window = context;
    context.self = context;
    context.global = context;
    context.Element = function Element() {};
    context.HTMLElement = function HTMLElement() {};
    context.SVGElement = function SVGElement() {};
    context.Image = function Image() {};
    context.setTimeout = setTimeout;
    context.clearTimeout = clearTimeout;
    context.setInterval = setInterval;
    context.clearInterval = clearInterval;
    context.requestAnimationFrame = (callback) => setTimeout(callback, 0);
    context.cancelAnimationFrame = (id) => clearTimeout(id);

    vm.createContext(context);
    ['dist/jarallax.js', 'dist/jarallax-video.js', 'dist/jarallax-element.js'].forEach((file) => {
      const source = fs.readFileSync(path.join(rootDir, file), 'utf8');
      vm.runInContext(source, context, { filename: file });
    });

    expect(context.jarallax).toBeTypeOf('function');
    expect(context.jarallaxVideo).toBeTypeOf('function');
    expect(context.jarallaxElement).toBeTypeOf('function');
    expect(context.VideoWorker).toBeTypeOf('function');
  });

  it('ships CSS artifacts with the expected selectors', () => {
    const css = fs.readFileSync(path.join(rootDir, 'dist/jarallax.css'), 'utf8');
    const minifiedCss = fs.readFileSync(path.join(rootDir, 'dist/jarallax.min.css'), 'utf8');

    expect(css).toContain('.jarallax');
    expect(minifiedCss).toContain('.jarallax');
  });

  it('keeps the legacy typings entry as a compatibility re-export', () => {
    const typingsEntry = fs.readFileSync(path.join(rootDir, 'typings/index.d.ts'), 'utf8');

    expect(typingsEntry).toContain("export * from '../dist/types/src/public-api';");
  });
});
