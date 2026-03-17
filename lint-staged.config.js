function runBiomeOnSupportedFiles(filenames) {
  const files = filenames.filter((file) => !file.startsWith('dist/'));

  if (files.length) {
    return `biome check --write ${files.join(' ')}`;
  }

  return [];
}

module.exports = {
  '*.{js,json,mjs,ts,css}': runBiomeOnSupportedFiles,
};
