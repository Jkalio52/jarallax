const path = require('node:path');

const excludedPrefixes = ['dist/', 'docs/', '.vscode/', 'examples/', 'demo/', 'node_modules/'];
const excludedFiles = ['typings/index.d.ts'];

function toRelativePath(file) {
  return path.relative(process.cwd(), file).split(path.sep).join('/');
}

function isExcludedFile(file) {
  return excludedPrefixes.some((prefix) => file.startsWith(prefix)) || excludedFiles.includes(file);
}

function runBiomeOnSupportedFiles(filenames) {
  const files = filenames.map(toRelativePath).filter((file) => !isExcludedFile(file));

  if (files.length) {
    return `biome check --write ${files.join(' ')}`;
  }

  return [];
}

module.exports = {
  '*.{js,json,mjs,ts,css}': runBiomeOnSupportedFiles,
};
