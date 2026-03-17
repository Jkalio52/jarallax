import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
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
    expect(pkg.types).toBe('./typings/index.d.ts');
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

  it('ships CSS artifacts with the expected selectors', () => {
    const css = fs.readFileSync(path.join(rootDir, 'dist/jarallax.css'), 'utf8');
    const minifiedCss = fs.readFileSync(path.join(rootDir, 'dist/jarallax.min.css'), 'utf8');

    expect(css).toContain('.jarallax');
    expect(minifiedCss).toContain('.jarallax');
  });
});
