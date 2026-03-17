import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import esbuild from 'rollup-plugin-esbuild';
import serve from 'rollup-plugin-serve';
import CleanCSS from 'clean-css';

import data from './package.json' with { type: 'json' };

const year = new Date().getFullYear();

function getHeader() {
  return `/*!
 * Jarallax v${data.version} (${data.homepage})
 * Copyright ${year} ${data.author}
 * Licensed under MIT (https://github.com/nk-o/jarallax/blob/master/LICENSE)
 */`;
}

function getVideoHeader() {
  return `/*!
 * Video Extension for Jarallax v${data.version} (${data.homepage})
 * Copyright ${year} ${data.author}
 * Licensed under MIT (https://github.com/nk-o/jarallax/blob/master/LICENSE)
 */
`;
}

function getElementHeader() {
  return `/*!
 * DEPRECATED Elements Extension for Jarallax. Use lax.js instead https://github.com/alexfoxy/lax.js
 */
`;
}

const pathCore = './src/core.esm.ts';
const pathCoreUmd = './src/core.umd.ts';
const pathExtVideoUmd = './src/ext-video.umd.ts';
const pathExtElementUmd = './src/deprecated/ext-element.umd.ts';

const bundles = [
  // Core.
  {
    input: pathCore,
    output: {
      banner: getHeader(),
      file: './dist/jarallax.esm.js',
      format: 'esm',
    },
  },
  {
    input: pathCore,
    output: {
      banner: getHeader(),
      file: './dist/jarallax.esm.min.js',
      format: 'esm',
      compact: true,
    },
  },
  {
    input: pathCoreUmd,
    output: {
      banner: getHeader(),
      name: 'jarallax',
      file: './dist/jarallax.js',
      format: 'umd',
    },
  },
  {
    input: pathCoreUmd,
    output: {
      banner: getHeader(),
      name: 'jarallax',
      file: './dist/jarallax.min.js',
      format: 'umd',
      compact: true,
    },
  },
  {
    input: pathCore,
    output: {
      banner: getHeader(),
      file: './dist/jarallax.cjs',
      format: 'cjs',
    },
  },

  // Video Extension.
  {
    input: pathExtVideoUmd,
    output: {
      banner: getVideoHeader(),
      name: 'jarallaxVideo',
      file: './dist/jarallax-video.js',
      format: 'umd',
    },
  },
  {
    input: pathExtVideoUmd,
    output: {
      banner: getVideoHeader(),
      name: 'jarallaxVideo',
      file: './dist/jarallax-video.min.js',
      format: 'umd',
      compact: true,
    },
  },

  // Element Extension.
  {
    input: pathExtElementUmd,
    output: {
      banner: getElementHeader(),
      name: 'jarallaxElement',
      file: './dist/jarallax-element.js',
      format: 'umd',
    },
  },
  {
    input: pathExtElementUmd,
    output: {
      banner: getElementHeader(),
      name: 'jarallaxElement',
      file: './dist/jarallax-element.min.js',
      format: 'umd',
      compact: true,
    },
  },
];

const isDev = () => process.env.NODE_ENV === 'dev';
const isUMD = (file) => file.includes('jarallax.js') || file.includes('jarallax-video.js');
const isMinEnv = (file) => file.includes('.min.');
const isSpecificEnv = (file) => isMinEnv(file);
const isDebugAlways = (file) => (isDev() || isUMD(file) ? 'true' : 'false');

function createTypeScriptPlugin() {
  return esbuild({
    sourceMap: true,
    target: 'es2020',
    tsconfig: './tsconfig.json',
  });
}

const configs = bundles.map(({ input: inputPath, output }) => ({
  input: inputPath,
  output,
  plugins: [
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.ts'],
    }),
    createTypeScriptPlugin(),
    replace({
      __DEV__: isSpecificEnv(output.file)
        ? isDebugAlways(output.file)
        : 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    output.file.includes('.min.') && terser(),
  ],
}));

// Copy CSS file to dist.
configs[0].plugins.unshift(
  copy({
    targets: [{ src: './src/core.css', dest: 'dist', rename: () => 'jarallax.css' }],
  })
);

configs[0].plugins.unshift(
  copy({
    targets: [
      {
        src: './src/core.css',
        dest: 'dist',
        rename: () => 'jarallax.min.css',
        transform: (contents) => new CleanCSS().minify(contents).styles,
      },
    ],
  })
);

// Dev server.
if (isDev()) {
  configs[configs.length - 1].plugins.push(
    serve({
      open: true,
      contentBase: ['demo', './'],
      port: 3002,
    })
  );
}

export default configs;
